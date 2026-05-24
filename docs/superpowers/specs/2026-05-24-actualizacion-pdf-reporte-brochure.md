# Especificación de Diseño: Actualización de Reporte y Brochure Ejecutivo (PDF)
**Fecha:** 2026-05-24
**Estado:** Propuesto (Para revisión de usuario)
**Autor:** Antigravity (AI Pair Programmer)

---

## 1. Introducción y Objetivos
El objetivo de esta especificación es actualizar el reporte del proyecto `docs/reporte_proyecto.html` y compilarlo en `Ecosistema_FinTech_Club_Social.pdf`. El documento final debe:
*   Adoptar la identidad visual del proyecto de manera profesional e híbrida (fondo claro optimizado para impresión, con acentos dorados `#D4B26F`, texto azul marino `#0A1128` y tipografías `Outfit` e `Inter`).
*   Ser completamente funcional e inteligible para perfiles no técnicos (eliminar referencias directas a código SQL, nombres de tablas técnicas, restricciones de integridad como PK/FK, y tipos de datos de base de datos como UUID).
*   Incorporar una sección de **Brochure Comercial** al final del PDF que destaque de manera atractiva el valor agregado y el funcionamiento del ecosistema tanto para el socio como para la administración del club (Enfoque de Beneficios Duales).

---

## 2. Identidad Visual y Estilo (CSS)
El reporte utilizará un diseño moderno inspirado en el tema **Glass** de la aplicación, pero optimizado para lectura y ahorro de tinta (impresión):
*   **Colores**:
    *   Fondo de página: Blanco Off-white (`#FCFBF7`).
    *   Texto principal: Azul Marino Profundo (`#0A1128`).
    *   Texto secundario: Gris Azulado (`#4A5568`).
    *   Acento primario: Oro Champagne (`#D4B26F`).
    *   Acento secundario/alerta: Verde de Aprobación (`#2F9E44`), Rojo de Alerta (`#E03131`), Azul Claro (`#EFF6FF`).
*   **Fuentes**:
    *   Títulos (h1, h2, h3, h4): `Outfit`, sans-serif (Google Fonts).
    *   Cuerpo de texto y listas: `Inter`, sans-serif (Google Fonts).
*   **Componentes Visuales**:
    *   *Tarjetas ejecutivas*: Fondo blanco con bordes dorados muy tenues (`1px solid rgba(212, 178, 111, 0.3)`) y sombras suaves.
    *   *Cajas de Alerta*: Fondo azul claro o verde claro con un borde izquierdo grueso dorado o verde.
    *   *Diagramas*: Los SVG existentes se mantendrán centrados y optimizados con bordes redondeados y fondos claros.
    *   *Estructura de Impresión*: Control estricto de saltos de página con `page-break-after: always` y `page-break-inside: avoid` para evitar orfandad de párrafos y cortar tarjetas por la mitad al imprimir.

---

## 3. Contenido del Reporte Actualizado (No Técnico)

### 3.1. Portada del Ecosistema
Una portada limpia con logo del club/sistema, título en Outfit de gran tamaño, fecha actualizada y metadatos de autoría.

### 3.2. Sección 1: Flujo de Trabajo y Ciclo de Vida del Consumo
Explicación detallada del flujo general (ETL inyectando datos, socio consultando balance indexado, pago vía crédito, pago directo por banco y conciliación pasiva/excepciones de auditoría).

### 3.3. Sección 2: Módulos de Información y Modelo de Negocio
Sustituir la sección técnica de base de datos (ERD técnico y tablas SQL) por una descripción funcional del modelo relacional de negocio:
*   **Identidades**: Socios, Auditores, Administradores.
*   **Cuentas de Crédito**: Límites autorizados y balances deudores en dólares.
*   **Consumos del Socio**: Pedidos individuales generados dentro de las instalaciones del club.
*   **Comprobantes de Pago**: Reportes financieros emitidos por los socios.
*   **Extracto Bancario del Club**: Transacciones bancarias que sirven para contrastar y conciliar los reportes.
*   **Tasa de Cambio Oficial (BCV)**: Gestión y autorización manual de la tasa cambiaria.
*   **Bitácora de Seguridad**: Historial de control obligatorio de auditoría.

### 3.5. Sección 3: Reglas del Motor de Conciliación y Soporte Directo
Descripción clara del motor de cruce automático (banco + referencia, ventana de ±2 días, y monto exacto en bolívares), la cola de auditoría para discrepancias, la capacidad del socio de corregir y cancelar reportes, y la integración de mensajería con soporte de WhatsApp.

### 3.6. Sección 4: Roles y Cumplimiento Normativo (SUDEBAN)
Detallar el control de acceso de roles a nivel de negocio y cómo cumple con las normas SUDEBAN en Venezuela (logs inmutables que no se pueden editar ni borrar, captura de dirección IP del operador en transacciones críticas).

---

## 4. Sección 5: Brochure Ejecutivo (Nuevo)
Esta sección se ubicará al final, con un salto de página obligatorio, diseñada para servir de folleto de presentación y venta interna:
*   **Título Principal**: "Ecosistema FinTech - Cuenta Club Social"
*   **Subtítulo**: "Transformando la gestión financiera y la experiencia del socio."
*   **Pilar 1: El Socio (Comodidad y Autogestión)**:
    *   *Crédito del Club*: Línea de financiamiento interna indexada al dólar para consumos diarios.
    *   *Pagos Ágiles*: Reporte rápido de transferencias y Pago Móvil con cálculo automático a tasa BCV.
    *   *Soporte a un Click*: Enlace directo a WhatsApp con ficha pre-rellenada ante discrepancias.
    *   *Control Familiar*: Unificación de cuentas y visualización detallada de deudas por núcleo familiar.
*   **Pilar 2: El Club (Eficiencia y Gobernanza)**:
    *   *Conciliación en Segundos*: Motor automatizado que elimina el trabajo manual de cuadre de extractos bancarios.
    *   *Mitigación de Fraudes*: Restricción de duplicados que bloquea el doble gasto de referencias.
    *   *Control de Riesgo*: Límites de crédito parametrizables por socio y aprobación de tasas centralizada.
    *   *Cumplimiento SUDEBAN*: Bitácora forense de auditoría inmutable que rastrea IPs de operadores.

---

## 5. Estrategia de Compilación a PDF
El archivo `Ecosistema_FinTech_Club_Social.pdf` se compilará directamente desde el código HTML actualizado de `docs/reporte_proyecto.html` utilizando la versión headless de Google Chrome disponible en el entorno de desarrollo:
```powershell
Start-Process "C:\Program Files\Google\Chrome\Application\chrome.exe" -ArgumentList "--headless=new", "--disable-gpu", "--no-sandbox", "--print-to-pdf=C:\Coding\PJNautico\Ecosistema_FinTech_Club_Social.pdf", "C:\Coding\PJNautico\docs\reporte_proyecto.html" -Wait
```

---

## 6. Plan de Verificación
1.  **Validación de Sintaxis HTML/CSS**: Asegurar que las tipografías de Google Fonts carguen correctamente y que no existan estilos rotos.
2.  **Verificación de Saltos de Página**: Comprobar que no haya tarjetas rotas o títulos huérfanos al final de las páginas mediante pruebas de compilación a PDF.
3.  **Verificación de Contenido**: Confirmar que no exista código SQL ni mención a nombres técnicos de tablas o llaves de bases de datos.
4.  **Confirmación del Brochure**: Asegurar que el brochure contenga los pilares definidos para el Socio y para el Club.
