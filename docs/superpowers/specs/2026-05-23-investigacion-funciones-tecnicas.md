# Investigación Técnica: Mecanismos de Implementación
## Ecosistema FinTech — Cuenta Club Social

**Fecha:** 2026-05-23
**Versión:** 1.0
**Documento base:** [ecosistema-fintech-club-design.md](./2026-05-23-ecosistema-fintech-club-design.md)
**Propósito:** Documentar la investigación, las opciones viables y las decisiones técnicas para cada función crítica del sistema. Este documento NO contiene código; es un reporte de ingeniería previa al desarrollo.

---

## Índice

1. [Obtención Automática de la Tasa BCV](#1-obtención-automática-de-la-tasa-bcv)
2. [Verificación y Conciliación de Pago Móvil](#2-verificación-y-conciliación-de-pago-móvil)
3. [Sincronización ETL con el Sistema del Club](#3-sincronización-etl-con-el-sistema-del-club)
4. [Seguridad, Autenticación y RBAC](#4-seguridad-autenticación-y-rbac)
5. [Cumplimiento Normativo SUDEBAN](#5-cumplimiento-normativo-sudeban)
6. [Integración de WhatsApp para Soporte](#6-integración-de-whatsapp-para-soporte)

---

## 1. Obtención Automática de la Tasa BCV

### 1.1. Problema
El BCV publica la tasa de cambio oficial VES/USD diariamente en su sitio web (`bcv.org.ve`). **No existe una API oficial pública** del BCV para consumo de desarrolladores. El sistema necesita obtener este valor automáticamente para calcular los equivalentes en USD de los pagos en bolívares reportados por los socios.

### 1.2. Opciones Evaluadas

| Opción | Descripción | Estabilidad | Costo | Riesgo |
|:---|:---|:---|:---|:---|
| **A. API de terceros (DolarApi.com)** | API REST comunitaria que ya extrae y publica la tasa BCV | Alta | Gratis | Dependencia de servicio externo |
| **B. API de terceros (bcvapi.tech)** | Servicio orientado a e-commerce con tasa oficial | Alta | Gratis/Freemium | Dependencia de servicio externo |
| **C. Scraping directo del BCV** | Parsear el HTML de `bcv.org.ve` con Deno DOM | Baja | Gratis | Cambios en estructura HTML rompen el scraper |
| **D. Esquema híbrido (A + C como fallback)** | Consumir API de tercero; si falla, ejecutar scraping | Media-Alta | Gratis | Complejidad adicional |

### 1.3. Decisión Recomendada: Opción D (Híbrido con fallback)

**Fuente primaria:** `https://ve.dolarapi.com/v1/dolares/oficial`

Respuesta esperada:
```json
{
  "fuente": "oficial",
  "nombre": "Oficial",
  "compra": null,
  "venta": 92.45,
  "promedio": 92.45,
  "fechaActualizacion": "2026-05-23T13:00:00.000Z"
}
```

**Fuente de fallback:** Scraping de `bcv.org.ve` usando selectores CSS del contenedor `.view-tipo-de-cambio-oficial` y extracción del valor dentro de un elemento `strong` bajo el bloque del USD. Se requiere conversión de coma decimal (`,`) a punto (`.`).

### 1.4. Mecanismo de Ejecución en Supabase

El flujo se ejecuta en tres componentes:

1. **Edge Function (`fetch-bcv-rate`):** Función Deno que hace la petición HTTP a DolarApi (o al fallback de scraping). Devuelve el valor numérico limpio.
2. **`pg_cron` + `pg_net`:** Una tarea cron programada a las 9:00 AM VET (13:00 UTC) diariamente invoca la Edge Function vía HTTP POST.
3. **Inserción en `exchange_rates`:** La Edge Function inserta un registro con `status = 'proposed'`.

**Flujo de activación:**
```
pg_cron (diario 13:00 UTC)
    → pg_net HTTP POST a Edge Function
        → Edge Function consulta DolarApi
            → SI éxito: inserta tasa como 'proposed'
            → SI fallo: intenta scraping BCV
                → SI éxito: inserta tasa como 'proposed'
                → SI fallo: registra error en audit_logs, mantiene la tasa 'active' del día anterior
```

### 1.5. Validación Humana Obligatoria

La tasa insertada automáticamente **nunca entra en vigor sin la aprobación del `head_admin`** desde el panel administrativo. Este es un control de seguridad que protege contra:
- Valores corruptos por errores de scraping
- Cambios inesperados en la estructura de la fuente
- Manipulación de la fuente de tercero

Al aprobar, la tasa anterior con `status = 'active'` pasa a `'archived'`, y la nueva se establece como `'active'`.

### 1.6. Consideraciones de Formato

| Aspecto | Detalle |
|:---|:---|
| Separador decimal BCV | Coma (`,`). Convertir a punto (`.`) antes de almacenar |
| Precisión | `NUMERIC(15,2)` en PostgreSQL |
| Frecuencia de consulta | 1 vez al día. La tasa del BCV se actualiza una vez por jornada |
| Caché de emergencia | Si ambas fuentes fallan, el sistema opera con la última tasa `'active'` almacenada |

---

## 2. Verificación y Conciliación de Pago Móvil

### 2.1. Problema
Los socios pagan sus deudas al club vía **Pago Móvil Interbancario** o transferencia bancaria en bolívares. El sistema necesita verificar que el pago efectivamente se realizó y fue recibido en la cuenta bancaria del club, eliminando la validación manual y previniendo el fraude de referencias falsas o duplicadas.

### 2.2. Estado del Ecosistema de Open Banking y APIs en Venezuela (2025-2026)

> [!IMPORTANT]
> **No existe una API bancaria pública universal ni regulada de manera estandarizada** en Venezuela para la verificación de pagos en tiempo real. La Resolución **SUDEBAN No. 001-21** establece el marco para las alianzas entre instituciones bancarias y Fintechs. Por lo tanto, la integración automatizada en tiempo real requiere o bien contratos corporativos directos con los bancos, o el uso de pasarelas/agregadores Fintech que simplifican el proceso técnico a cambio de comisiones.

### 2.3. Opciones Tecnológicas Evaluadas para Verificación Automatizada

#### A. APIs de Integración Bancaria Directa (Clientes Jurídicos)

1.  **Banesco - API Confirmación de Transacción:**
    *   **Mecanismo:** Servicio REST expuesto a través del portal de **Banesco Desarrolladores**. Permite consultar en línea operaciones de pago móvil y transferencias recibidas desde cualquier banco nacional hacia cuentas Banesco.
    *   **Parámetros de Consulta:** Número de referencia de la transacción, número de teléfono emisor, banco origen y fecha del pago (o mediante cuenta destino y rango de fechas/horas).
    *   **Historial y Horario:** Permite consultar transacciones de hasta 30 días de antigüedad. El servicio está altamente disponible (suele operar de 2:00 a.m. a 11:55 p.m.).
    *   **Acceso:** Requiere afiliación de cuenta jurídica y aprobación formal de su Ejecutivo de Cuenta para obtener el ID de aplicación y claves de autenticación JWT.
2.  **Bancaribe - API de Consulta de Operaciones (Open Banking):**
    *   **Mecanismo:** Servicio web SOAP/REST bajo el estándar **ISO 8583** (incluyendo el método de consulta `queryPaymentB2P` o similares).
    *   **Acceso:** Se gestiona mediante el API Manager de Bancaribe generando tokens de acceso de cliente corporativo para verificar de forma inmediata si un pago entrante fue satisfactorio.
3.  **Mercantil - API C2P / Botón de Pago:**
    *   **Mecanismo:** Integración a través del portal de desarrolladores para iniciar cobros directos y verificar transferencias al instante.

#### B. Agregadores Fintech y Pasarelas de Pago (Integración Simplificada)

1.  **PagoFlash (Grupo UniDigital):**
    *   **Mecanismo:** Pasarela de pago con API REST y colección Postman oficial. Soporta validación de transferencias y pago móvil.
    *   **Flujo Operativo:** Requiere que el comercio genere y asocie un **código de concepto aleatorio** al ticket de pago. El socio debe ingresar este código exacto en el concepto del pago móvil. El motor de PagoFlash escanea los ingresos y valida el pago de manera automática ("Flash").
    *   **Contacto técnico:** `api@unidigital.global`.
2.  **Pabilo (pabilo.app):**
    *   **Mecanismo:** Servicio especializado en la verificación automatizada en segundos de pagos móviles y transferencias entrantes de múltiples bancos nacionales (BDV, Mercantil, Provincial, Bancaribe, BNC, etc.) a través de una API unificada. Ideal para mantener la experiencia P2P (Persona a Persona) sin obligar al socio a usar códigos de concepto.
3.  **e4Cash Empresarial (e4cash.com):**
    *   **Mecanismo:** Plataforma diseñada para la integración de pagos móviles mediante APIs empresariales que permiten consulta inmediata de saldos recibidos, cobro automatizado C2P y vuelto digital para transacciones exactas.
4.  **Ramblay (ramblay.com):**
    *   **Mecanismo:** Capa de software intermedia que no retiene fondos (el dinero va de la cuenta del socio al banco del club). Conecta con APIs bancarias (por ejemplo, Mercantil) y soporta flujos C2P, enlaces de pago (*payment links*) y cobros automatizados recurrentes en planes Enterprise.
5.  **VerificaPago (verificapago.com):**
    *   **Mecanismo:** Sistema de conciliación basado en bots y paneles unificados. Permite a los auditores verificar referencias en tiempo real sin necesidad de darles acceso directo a la banca en línea del club.

---

### 2.4. Comparativa de Protocolos: Pago Móvil P2P vs C2P

| Característica | Pago Móvil P2P (Persona a Persona) | Pago Móvil C2P (Comercio a Persona) |
| :--- | :--- | :--- |
| **Iniciador de la transacción** | El socio (desde su App bancaria). | El Club (desde el portal de la app del club). |
| **Experiencia del Usuario** | Realiza el pago móvil manual, copia la referencia y la reporta en el portal del club. | Ingresa su Cédula, Teléfono, Banco y genera una clave OTP temporal desde su banco, la cual ingresa en la app del club. |
| **Mecanismo de Validación** | **Pasivo:** El sistema busca la referencia en el extracto bancario o consulta la API del banco receptor. | **Activo:** La API debita al instante los fondos tras enviar la clave OTP; la confirmación es en tiempo real. |
| **Tasa de Error Humano** | **Alta:** Socios pueden equivocarse en montos, referencias o banco de origen. | **Nula:** El cobro es exacto por el monto adeudado y se debita directamente tras la autorización. |
| **Requisito del Socio** | Conocer el teléfono de destino del club. | Generar una clave temporal de pago móvil comercio (OTP) desde su app de banco o SMS. |

---

### 2.5. Decisión Recomendada: Estrategia de Conciliación Híbrida Evolutiva

Para balancear costos de integración, tiempos de desarrollo y la experiencia de usuario, se adopta un esquema evolutivo dividido en fases:

1.  **Fase 1 (MVP) - Conciliación por Extracto Bancario (CSV):**
    *   Los socios reportan pagos P2P tradicionales.
    *   El auditor descarga y sube periódicamente los CSV del banco receptor al sistema.
    *   El motor en base de datos ejecuta el cruce automático usando reglas de matching estricto.
2.  **Fase 2 - Carga CSV Automatizada (SFTP/Email):**
    *   Automatizar la carga de los extractos bancarios del club al backend de Supabase mediante un buzón de email receptor del banco o conexión SFTP.
3.  **Fase 3 - Botón Pago C2P y API Bancaria de Consulta:**
    *   Integración de botón C2P (vía agregador o directo con Mercantil) para cobros en tiempo real.
    *   Integración con la **API Confirmación de Transacción de Banesco** y/o **Bancaribe** para validar pagos P2P tradicionales sin intervención del auditor.

---

### 2.6. Motor de Conciliación (MVP) — Reglas de Cruce

El proceso de conciliación automática se dispara mediante un trigger en PostgreSQL al insertar registros en `bank_transactions_mock` o reportar un ticket en `payment_tickets`.

```
Regla de Coincidencia Exacta (Cruce 3 Criterios):
┌────────────────────────────────────────────────────────────────────────┐
│  Monto VES del Ticket = Monto VES de la Transacción (Tolerancia ±0.50) │
│  +                                                                     │
│  Últimos 6 dígitos de Referencia en Ticket = Referencia Bancaria       │
│  +                                                                     │
│  Fecha de Pago del Ticket = Fecha de Transacción (Tolerancia ±2 días)  │
└────────────────────────────────────────────────────────────────────────┘

Si existen duplicados en las coincidencias de referencia, se evalúa:
- Coincidencia de Código de Banco Origen (bank_origin_code).
- Coincidencia del número de teléfono del socio (phone_number).
```

#### Estados Resultantes:

| Estado de Salida | Condición | Acción del Sistema |
| :--- | :--- | :--- |
| **`auto_approved`** | Coincidencia en los 3 criterios y transacción no conciliada previamente. | Marca `is_reconciled = true` en `bank_transactions_mock`, asigna `status = 'auto_approved'` al ticket, actualiza saldo reduciendo la deuda en `credit_accounts`. |
| **`pending_audit`** | Coincidencia parcial (ej. coincide referencia pero el monto varía) o no se encuentra la transacción en el extracto. | El ticket queda en `pending_audit`. Se habilita el botón de soporte de WhatsApp para el socio. |
| **`rejected`** | La referencia ya fue utilizada con éxito por otro ticket de pago. | Marca el ticket como `rejected` con `rejection_reason = 'referencia_duplicada'` (Previene doble canje). |

---

### 2.7. Especificación del Formato de Ingesta CSV (MVP)

El sistema procesará archivos CSV de forma flexible mediante cabeceras normalizadas. Si las cabeceras varían según el banco del club, el importador mapea las columnas según los siguientes sinónimos:

| Columna en BD | Cabeceras Soportadas (Sinónimos) | Tipo | Ejemplo de Valor |
| :--- | :--- | :--- | :--- |
| `bank_origin_code` | `banco_origen`, `Banco`, `Entidad`, `Origen` | Alfanumérico | `0102` o `BANESCO` |
| `reference_number` | `referencia`, `Nro Referencia`, `Secuencia`, `Ref` | Alfanumérico | `2026052300012345` |
| `amount_ves` | `monto`, `Monto VES`, `Importe`, `Monto Operacion` | Decimal | `4500.00` |
| `payment_date` | `fecha`, `Fecha Operacion`, `Fecha Valor`, `Fec. Valor` | Fecha | `2026-05-23` (Formatos: YYYY-MM-DD, DD/MM/YYYY) |
| `phone_number` | `telefono`, `Celular`, `Telefono Origen` (Opcional) | Alfanumérico | `04121234567` |
| `identity_card` | `cedula`, `Identificacion`, `Rif/CI` (Opcional) | Alfanumérico | `V-12345678` |

---

## 3. Sincronización ETL con el Sistema del Club

### 3.1. Problema
El club opera un sistema existente (punto de venta, gestión de socios) que contiene los datos de usuarios, membresías, consumos y saldos. Estos datos necesitan sincronizarse hacia la plataforma FinTech sin reemplazar el sistema existente.

### 3.2. Estrategia: Script ETL Programado

| Aspecto | Decisión |
|:---|:---|
| Dirección de datos | Unidireccional: Sistema del club → Plataforma FinTech |
| Frecuencia | Diaria (nocturna) o bajo demanda |
| Formato de intercambio | CSV o JSON exportado del sistema del club |
| Mecanismo de carga | Edge Function de Supabase o script externo con `supabase-js` |
| Manejo de conflictos | Upsert por `membership_number` (usuarios) y `invoice_number` (pedidos) |

### 3.3. Flujo del Proceso ETL

```
[Sistema del Club]
    → Exporta CSV/JSON con usuarios, consumos, saldos
        → [Edge Function o Script Node.js]
            → Valida esquema y tipos de datos
            → Transforma datos (normalización de cédulas, formatos de fecha)
            → Upsert en tablas: users, credit_accounts, purchases_orders
            → Registra resultado en audit_logs
                → [Notificación al head_admin si hay errores]
```

### 3.4. Manejo de Volumen

| Escenario | Volumen estimado | Estrategia |
|:---|:---|:---|
| Usuarios activos | 2,000 – 8,000 registros | Upsert en batch de 500 filas |
| Consumos diarios | 200 – 1,000 pedidos/día | Inserción incremental (solo nuevos) |
| Saldos de crédito | 2,000 – 8,000 actualizaciones | Update condicional por `user_id` |

### 3.5. Validaciones Obligatorias

- Números de cédula con formato normalizado (`V-` + 8 dígitos)
- Montos con `NUMERIC(15,2)`, sin valores negativos
- `invoice_number` único: rechazar duplicados silenciosamente
- Integridad referencial: no crear `purchases_orders` sin `user_id` existente

---

## 4. Seguridad, Autenticación y RBAC

### 4.1. Autenticación

| Componente | Mecanismo |
|:---|:---|
| Proveedor | Supabase Auth (email + contraseña) |
| Tokens | JWT firmados por Supabase |
| Sesiones | Refresh tokens con rotación automática |
| 2FA | Fase 2 (post-MVP) vía TOTP |

### 4.2. Row Level Security (RLS) — Principios

1. **RLS habilitado en TODAS las tablas** sin excepción
2. **Principio de mínimo privilegio:** cada política permite únicamente la acción estrictamente necesaria
3. **Roles verificados vía JWT claims:** `auth.jwt() ->> 'role'` para diferenciar `socio`, `auditor`, `head_admin`
4. **La `service_role` key** se usa exclusivamente en Edge Functions y el script ETL. Nunca en el cliente React
5. **La `anon` key** es la única expuesta en el frontend; su seguridad depende de que el RLS esté correctamente definido

### 4.3. Protección de Datos Financieros

| Medida | Implementación |
|:---|:---|
| Cifrado en tránsito | HTTPS/TLS obligatorio (Vercel + Supabase lo proveen por defecto) |
| Cifrado en reposo | PostgreSQL de Supabase cifra los datos almacenados |
| Logs inmutables | Tabla `audit_logs` sin permisos de `UPDATE` ni `DELETE` |
| Validación server-side | Toda lógica financiera ejecuta en Edge Functions o triggers PL/pgSQL, no en el cliente |
| Rate limiting | Configurar límites de tasa en Supabase para prevenir abuso |

---

## 5. Cumplimiento Normativo SUDEBAN

### 5.1. Contexto Regulatorio

> [!WARNING]
> Este sistema NO opera como una Institución de Tecnología Financiera del Sector Bancario (ITFB). Es una herramienta interna de gestión de cuentas de crédito de un club social. Sin embargo, las mejores prácticas de auditoría y registro siguen las directrices de SUDEBAN como referencia de calidad.

### 5.2. Directrices Aplicables

| Normativa | Relevancia para este sistema |
|:---|:---|
| **Resolución 001-21 (SUDEBAN)** | Marco de referencia para registro cronológico de transacciones |
| **Resolución 010.25 (2025)** | Prevención de riesgos LC/FT: base para el diseño del `audit_logs` |
| **Manual de Contabilidad Bancaria** | Referencia para la estructura de registros financieros con precisión decimal |

### 5.3. Controles Implementados

1. **Registro cronológico inmutable:** Cada acción financiera (aprobación, rechazo, cambio de límite, activación de tasa) genera un registro en `audit_logs` con: actor, acción, valores anteriores/nuevos, IP, timestamp
2. **Segregación de funciones:** El socio reporta; el auditor verifica; el head_admin autoriza tasas y cambios de crédito
3. **Trazabilidad completa:** Cada pago se vincula a su pedido, su ticket, su tasa BCV y su auditor
4. **Prohibición de eliminación:** Los registros financieros no tienen función de borrado en la aplicación

---

## 6. Integración de WhatsApp para Soporte

### 6.1. Mecanismo

Se utiliza el protocolo de enlace directo de WhatsApp Web (`wa.me`). No requiere API de WhatsApp Business ni servidor intermedio.

### 6.2. Flujo

1. Cuando un ticket pasa a `pending_audit` o `rejected`, el sistema habilita un botón de soporte en la interfaz del socio.
2. El botón abre una URL con formato: `https://wa.me/{NUMERO}?text={MENSAJE_CODIFICADO}`
3. El mensaje incluye datos pre-rellenados del ticket (socio, cédula, membresía, banco, referencia, monto, estado).
4. El equipo de soporte recibe el mensaje en su grupo de WhatsApp y puede atender la discrepancia.

### 6.3. Limitaciones

| Aspecto | Detalle |
|:---|:---|
| Automatización | Nula. Es un enlace estático que abre el chat. No hay bot ni respuestas automáticas |
| Trazabilidad | El mensaje queda en el chat de WhatsApp, no en el sistema. El auditor debe actualizar el ticket manualmente |
| Escalabilidad | Funcional para volúmenes bajos/medios. Para escala alta, considerar WhatsApp Business API con CRM integrado |

### 6.4. Ruta de Evolución

```
Fase 1 (MVP): Enlace wa.me con mensaje pre-rellenado
Fase 2: WhatsApp Business API con plantillas de mensaje
Fase 3: Bot de WhatsApp con flujo guiado y actualización automática del ticket en el sistema
```

---

## Apéndice: Fuentes Consultadas

| Fuente | URL | Consulta |
|:---|:---|:---|
| DolarApi.com | `https://ve.dolarapi.com/v1/dolares/oficial` | Tasa BCV oficial |
| bcvapi.tech | `https://bcvapi.tech` | Tasa BCV alternativa |
| BCV sitio oficial | `https://bcv.org.ve` | Estructura HTML para scraping |
| Supabase Docs | `https://supabase.com/docs` | Edge Functions, pg_cron, RLS |
| SUDEBAN Resolución 001-21 | Gaceta Oficial N° 42.151 | Marco ITFB |
| SUDEBAN Resolución 010.25 | Gaceta 2025 | Prevención LC/FT |
| Mercantil Portal Dev | Portal privado bancario | API C2P (referencia futura) |
