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

---

## 2. Sistema de Diseño Visual (CSS)
*   **Dimensiones del Papel**:
    ```css
    @page {
        size: letter landscape;
        margin: 10mm;
    }
    @page header-footer {
        margin: 0;
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
*   **Subtítulo**: "Ruta de Vuelo y Planificación de Desarrollo del Proyecto"
*   **Metadatos**: Versión 1.0, Duración estimada: 76 días hábiles (~3.5 meses), Equipo: 1-2 Desarrolladores.

### 3.2. Hitos y Fases
*   **Fase 0: Cimientos del Sistema (10 días)**
    *   *Objetivo*: Establecer la infraestructura digital del proyecto en la nube.
    *   *Entregables*: Setup inicial de la plataforma React, integración base de la nube en Supabase, pantallas seguras de acceso y despliegue del portal base.
*   **Fase 1: Estructura de Información y Sincronización (12 días)**
    *   *Objetivo*: Conectar el sistema de cobros actual del club con el nuevo ecosistema.
    *   *Entregables*: Automatización del pipeline de datos (ETL) que lee deudas de socios, y configuración de políticas de privacidad para que los datos estén aislados.
*   **Fase 2: Experiencia del Socio y Automatización Cambiaria (15 días)**
    *   *Objetivo*: Habilitar la autogestión de pagos y la indexación de tasa cambiaria oficial.
    *   *Entregables*: Dashboard interactivo del socio (balance de consumos familiares en USD/VES), formulario digital de reportes de pago móvil/transferencia, y automatización diaria del registro y aprobación de la tasa oficial del BCV.
*   **Fase 3: Motor de Conciliación y Panel de Aprobaciones (17 días)**
    *   *Objetivo*: Diseñar el cerebro que cruza reportes de pago contra los extractos bancarios.
    *   *Entregables*: Lógica inteligente de auto-aprobación de pagos (coincidencia de banco, referencia y montos VES con tolerancia de ±2 días), cola de auditoría para discrepancias, y panel administrativo para auditores de caja.
*   **Fase 4: Gobernanza, Seguridad y SUDEBAN (12 días)**
    *   *Objetivo*: Asegurar el control administrativo y el cumplimiento forense normativo.
    *   *Entregables*: Panel de control de administradores, editor de límites de crédito para socios, visor de bitácora de auditoría histórica inalterable (prohibición de editar logs) y captura de direcciones IP de operadores.
*   **Fase 5: Garantía de Calidad y Puesta en Producción (10 días)**
    *   *Objetivo*: Certificar el funcionamiento óptimo del sistema bajo estrés y desplegar.
    *   *Entregables*: Pruebas de simulación masiva (cruce de más de 500 pagos simultáneos), auditoría de seguridad digital y lanzamiento oficial en el dominio de producción del club.

### 3.3. Pie de Resumen
*   Estadísticas clave: 76 días acumulados de desarrollo, 5 fases operativas + 1 fase de despliegue, y resumen ejecutivo de riesgos (tasa de cambio e integración) con sus respectivas medidas de mitigación.

---

## 4. Estrategia de Compilación a PDF
El archivo PDF final se compilará desde la terminal de PowerShell en modo apaisado (horizontal):
```powershell
Start-Process "C:\Program Files\Google\Chrome\Application\chrome.exe" -ArgumentList "--headless=new", "--disable-gpu", "--no-sandbox", "--print-to-pdf=C:\Coding\PJNautico\Ecosistema_FinTech_Fases_Desarrollo.pdf", "C:\Coding\PJNautico\docs\brochure_fases.html" -Wait
```

---

## 5. Plan de Verificación
1.  **Validación de Layout**: Probar la visualización del Bento Grid en resolución tipo carta (Landscape).
2.  **Verificación de Saltos de Página**: Asegurar que todo el Bento Grid quepa exactamente en una sola página Carta apaisada (o máximo 2 páginas si se desea más espaciado) sin desbordamientos tipográficos.
3.  **Verificación de No-SQL**: Revisar que no haya nombres técnicos de base de datos ni consultas en el texto final.
