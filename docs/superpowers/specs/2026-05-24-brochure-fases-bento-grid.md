# Especificación de Diseño: Brochure Bento Grid - Fases del Proyecto
**Fecha:** 2026-05-24
**Estado:** Propuesto (Para revisión de usuario)
**Autor:** Antigravity (AI Pair Programmer)

---

## 1. Introducción y Objetivos
El objetivo de este brochure es presentar la hoja de ruta del desarrollo del Ecosistema FinTech - Cuenta Club Social en un formato visual independiente.
*   **Nombre del archivo fuente**: `docs/brochure_fases.html`
*   **Nombre del PDF compilado**: `Ecosistema_FinTech_Fases_Desarrollo.pdf`
*   **Estilo del Layout**: Bento Grid asimétrico con una grilla de 12 columnas.
*   **Orientación**: Hoja tipo carta en horizontal (Landscape) optimizada para visualización digital e impresión corporativa.
*   **Audiencia**: Directores, socios y coordinadores del club (sin jerga técnica ni código SQL).
*   **Alineación de Enfoque**: Remover duraciones temporales específicas (días) para centrarse estrictamente en explicar el propósito conceptual, los objetivos y los entregables clave de cada etapa.

---

## 2. Sistema de Diseño Visual (CSS)
*   **Dimensiones del Papel**:
    ```css
    @page {
        size: letter landscape;
        margin: 10mm;
    }
    ```
*   **Colores Core**:
    *   Fondo general: `#FCFBF7` (Off-white).
    *   Fondo destacado (Cabecera/Pie): `#0A1128` (Azul marino profundo).
    *   Acento primario: `#D4B26F` (Oro champagne).
    *   Bordes de tarjeta: `1px solid rgba(212, 178, 111, 0.25)`.
    *   Sombras: `box-shadow: 0 4px 15px rgba(0, 0, 0, 0.02)`.
*   **Fuentes**:
    *   Títulos: `Outfit`, sans-serif (Google Fonts).
    *   Cuerpo/Listas: `Inter`, sans-serif (Google Fonts).
*   **Layout (Bento Grid)**:
    *   Contenedor principal: `display: grid; grid-template-columns: repeat(12, 1fr); gap: 15px;`.
    *   La portada/cabecera ocupa el ancho total (span 12).
    *   Fase 0 y Fase 5: span 4.
    *   Fase 1 y Fase 4: span 8.
    *   Fase 2 y Fase 3 (Hitos Core): span 12 (grande, con rejillas internas a 2 columnas para una presentación balanceada).
    *   Pie de página: span 12.

---

## 3. Contenido de las Tarjetas del Bento Grid

### 3.1. Cabecera del Proyecto
*   **Título**: "Ecosistema FinTech - Cuenta Club Social"
*   **Subtítulo**: "Estructura de Etapas y Planificación de Desarrollo del Proyecto"
*   **Metadatos**: Versión 1.0, Orientación: Enfoque Modular de Capacidades, Planificación: 6 Etapas Integradas.

### 3.2. Hitos y Fases
*   **Fase 0: Cimientos del Sistema**
    *   *Objetivo*: Establecer la infraestructura base y los protocolos de seguridad de acceso en la nube.
    *   *Entregables*: Setup inicial de la plataforma del portal, integración del motor en la nube de Supabase, pantallas de inicio de sesión seguro y despliegue del layout base de navegación.
*   **Fase 1: Estructura de Información y Sincronización**
    *   *Objetivo*: Modelar el almacenamiento financiero y automatizar la sincronización de deudas existentes.
    *   *Entregables*: Estructura de datos para saldos y pedidos, políticas de seguridad a nivel de fila (RLS) para proteger los datos de los socios, y automatización del sincronizador de datos (ETL) para leer deudas externas.
*   **Fase 2: Experiencia del Socio y Automatización Cambiaria**
    *   *Objetivo*: Habilitar la autogestión de deudas por los socios y el control cambiario oficial de pagos.
    *   *Entregables*: Portal del Socio (visualización de saldos familiares y compras en USD/VES), formulario digital para reporte de transferencias o Pago Móvil, y sincronización diaria automatizada de la tasa de cambio oficial del BCV.
*   **Fase 3: Motor de Conciliación y Panel de Aprobaciones**
    *   *Objetivo*: Implementar el motor de validación automática de pagos y la mesa de soporte.
    *   *Entregables*: Motor de cruce automático (coincidencia de banco, referencia, montos y fecha con tolerancia), panel para auditores para resolver discrepancias manuales y botón de soporte inmediato con ficha estructurada para WhatsApp.
*   **Fase 4: Gobernanza, Seguridad y SUDEBAN**
    *   *Objetivo*: Ofrecer a la junta directiva control total y auditoría inalterable del ecosistema.
    *   *Entregables*: Panel de control administrativo para Head Admin, control y edición de límites de crédito, bitácora histórica de auditoría inmutable (protección contra edición de registros) y registro automático de dirección IP del operador.
*   **Fase 5: Garantía de Calidad y Puesta en Producción**
    *   *Objetivo*: Certificar la robustez del sistema y realizar el lanzamiento final.
    *   *Entregables*: Pruebas integrales de estrés (procesamiento masivo de pagos simultáneos), auditoría final de seguridad digital de Supabase y puesta en producción en el dominio definitivo del club.

### 3.3. Pie de Resumen
*   Estadísticas clave: 6 etapas consecutivas de desarrollo, cobertura total del ciclo financiero del club, y análisis de mitigación de riesgos operativos (fallback de tasas de cambio e integraciones de datos).
