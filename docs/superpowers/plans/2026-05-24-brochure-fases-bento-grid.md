# Brochure Bento Grid - Fases del Proyecto Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Crear un brochure independiente en formato Bento Grid (`docs/brochure_fases.html`) que presente las fases de desarrollo del Ecosistema FinTech sin menciones a días de duración, y compilarlo en `Ecosistema_FinTech_Fases_Desarrollo.pdf`.

**Architecture:** El brochure se diseñará utilizando un sistema CSS Grid asimétrico de 12 columnas en orientación horizontal (Letter Landscape). Se utilizará un diseño híbrido premium con fuentes Outfit e Inter, y se compilará con Google Chrome headless en formato PDF apaisado.

**Tech Stack:** HTML5, CSS3 Grid, Google Fonts (Outfit & Inter), Headless Chrome.

---

### Task 1: Creación del Layout y Estilos de la Cuadrícula Bento (Bento Grid)

**Files:**
- Create: `docs/brochure_fases.html` (Estilos base y estructura)

- [ ] **Step 1: Crear el archivo `docs/brochure_fases.html` con los estilos base y maquetación de rejilla**

Escribir el siguiente contenido con la configuración CSS Grid de 12 columnas y la media de impresión apaisada:

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Ruta de Desarrollo - Ecosistema FinTech</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;500;600;700;800&display=swap');
        
        :root {
            --primary: #0A1128;
            --secondary: #4A5568;
            --accent: #D4B26F;
            --accent-dark: #B59353;
            --bg-app: #FCFBF7;
            --bg-card: #FFFFFF;
            --border-card: 1px solid rgba(212, 178, 111, 0.25);
            --text-main: #2D3748;
            --text-dark: #0A1128;
            --text-light: #718096;
        }

        @page {
            size: letter landscape;
            margin: 10mm;
        }

        body {
            font-family: 'Inter', sans-serif;
            color: var(--text-main);
            line-height: 1.4;
            margin: 0;
            padding: 0;
            background-color: var(--bg-app);
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
        }

        .bento-container {
            display: grid;
            grid-template-columns: repeat(12, 1fr);
            grid-auto-rows: minmax(auto, auto);
            gap: 15px;
            max-width: 100%;
            margin: 0 auto;
            box-sizing: border-box;
        }

        /* Tarjeta de Cabecera */
        .bento-card.header {
            grid-column: span 12;
            background: radial-gradient(135deg, #0A1128 0%, #101F42 100%);
            color: #ffffff;
            border: none;
            padding: 1.5rem 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 5px solid var(--accent);
            border-radius: 12px;
        }

        .bento-card.header h1 {
            font-family: 'Outfit', sans-serif;
            font-size: 2.2rem;
            font-weight: 800;
            margin: 0 0 0.2rem 0;
            letter-spacing: -0.02em;
        }

        .bento-card.header p {
            color: #B0C4DE;
            margin: 0;
            font-size: 1.05rem;
            font-weight: 300;
        }

        .header-meta {
            text-align: right;
            font-size: 0.9rem;
            color: #B0C4DE;
            border-left: 1px solid rgba(255, 255, 255, 0.1);
            padding-left: 2rem;
        }

        .header-meta div {
            margin-bottom: 0.2rem;
        }

        /* Tarjetas de Fases */
        .bento-card {
            background-color: var(--bg-card);
            border: var(--border-card);
            border-radius: 12px;
            padding: 1.25rem;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.01);
            display: flex;
            flex-direction: column;
            box-sizing: border-box;
        }

        .bento-card.span-4 {
            grid-column: span 4;
        }

        .bento-card.span-8 {
            grid-column: span 8;
        }

        .bento-card.span-12 {
            grid-column: span 12;
        }

        .phase-badge {
            font-family: 'Outfit', sans-serif;
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
            color: var(--accent-dark);
            background-color: rgba(212, 178, 111, 0.1);
            padding: 0.25rem 0.6rem;
            border-radius: 20px;
            width: fit-content;
            margin-bottom: 0.75rem;
            letter-spacing: 0.05em;
            border: 1px solid rgba(212, 178, 111, 0.2);
        }

        .phase-title {
            font-family: 'Outfit', sans-serif;
            font-size: 1.35rem;
            font-weight: 700;
            color: var(--primary);
            margin: 0 0 0.5rem 0;
            letter-spacing: -0.01em;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .phase-objective {
            font-size: 0.9rem;
            color: var(--secondary);
            margin: 0 0 1rem 0;
            font-style: italic;
            border-left: 2px solid var(--accent);
            padding-left: 0.6rem;
        }

        .phase-content-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 1rem;
        }

        .bento-card.span-12 .phase-content-grid {
            grid-template-columns: 1fr 1fr;
            gap: 1.5rem;
        }

        .deliverables-box h5 {
            font-family: 'Outfit', sans-serif;
            font-size: 0.95rem;
            color: var(--primary);
            margin: 0 0 0.5rem 0;
            font-weight: 600;
        }

        .deliverables-list {
            margin: 0;
            padding-left: 1.2rem;
            font-size: 0.85rem;
            color: var(--text-main);
        }

        .deliverables-list li {
            margin-bottom: 0.4rem;
        }

        /* Tarjeta de Pie / Resumen */
        .bento-card.footer {
            grid-column: span 12;
            background: #0A1128;
            color: #ffffff;
            border: none;
            padding: 1.25rem 2rem;
            border-radius: 12px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 0.85rem;
            margin-top: 10px;
        }

        .footer-summary {
            font-family: 'Outfit', sans-serif;
            font-weight: 500;
            color: var(--accent);
        }

        .footer-risks {
            color: #B0C4DE;
            font-style: italic;
            text-align: right;
            max-width: 60%;
        }

        /* Estilos de Impresión */
        @media print {
            body {
                background-color: #ffffff;
                font-size: 9pt;
            }
            .bento-container {
                gap: 12px;
            }
            .bento-card {
                page-break-inside: avoid;
            }
        }
    </style>
</head>
<body>
    <div class="bento-container">
        <!-- Contenido Bento Grid se implementa en la Tarea 2 -->
    </div>
</body>
</html>
```

- [ ] **Step 2: Commit parcial de la plantilla base**

```bash
git add docs/brochure_fases.html
git commit -m "UI design: create base HTML template with 12-column bento grid for project phases"
```

---

### Task 2: Implementación del Contenido y Detalle de las Fases (Bento Grid)

**Files:**
- Modify: `docs/brochure_fases.html` (Inserción del contenido en `.bento-container`)

- [ ] **Step 1: Escribir el contenido del Bento Grid dentro del contenedor `.bento-container`**

Reemplazar `<div class="bento-container"> ... </div>` en `docs/brochure_fases.html` con las tarjetas estructuradas para las fases 0 a 5, sin menciones a días de duración:

```html
    <div class="bento-container">
        <!-- 1. CABECERA -->
        <div class="bento-card header">
            <div>
                <h1>Ecosistema FinTech — Cuenta Club Social</h1>
                <p>Planificación Estratégica y Fases del Desarrollo de Capacidades</p>
            </div>
            <div class="header-meta">
                <div><strong>Enfoque:</strong> Planificación Modular Integrada</div>
                <div><strong>Estructura:</strong> 6 Fases Consecutivas de Trabajo</div>
            </div>
        </div>

        <!-- 2. FASE 0 (Span 4) -->
        <div class="bento-card span-4">
            <div class="phase-badge">Fase Inicial</div>
            <h2 class="phase-title">Fase 0: Cimientos y Acceso</h2>
            <p class="phase-objective">Establecer la infraestructura digital del proyecto en la nube y configurar los mecanismos de seguridad inicial.</p>
            <div class="phase-content-grid">
                <div class="deliverables-box">
                    <h5>Entregables Clave:</h5>
                    <ul class="deliverables-list">
                        <li><strong>Proyecto Web React:</strong> Estructuración base del portal y herramientas de desarrollo.</li>
                        <li><strong>Entorno Supabase:</strong> Inicialización de la base de datos base en la nube.</li>
                        <li><strong>Autenticación Segura:</strong> Login/logout integrado con la base de socios.</li>
                        <li><strong>Protección de Rutas:</strong> Restricción de acceso según el rol de la cuenta.</li>
                    </ul>
                </div>
            </div>
        </div>

        <!-- 3. FASE 1 (Span 8) -->
        <div class="bento-card span-8">
            <div class="phase-badge">Estructura Base</div>
            <h2 class="phase-title">Fase 1: Estructura de Información y Sincronización</h2>
            <p class="phase-objective">Modelar el almacenamiento financiero y automatizar la sincronización de deudas existentes desde el sistema del club.</p>
            <div class="phase-content-grid">
                <div class="deliverables-box">
                    <h5>Entregables Clave:</h5>
                    <ul class="deliverables-list">
                        <li><strong>Modelo de Negocio Financiero:</strong> Estructuración de balances, pedidos del socio, comprobantes de reportes y libro de extractos.</li>
                        <li><strong>Seguridad de Datos (RLS):</strong> Políticas estrictas en base de datos para garantizar la total privacidad de los datos de cada socio.</li>
                        <li><strong>Trazabilidad Automática:</strong> Triggers de auditoría que capturan IP y UTC en cualquier transacción.</li>
                        <li><strong>Script ETL de Sincronización:</strong> Pipeline programado para la inyección automática de socios y pedidos desde el sistema del club.</li>
                    </ul>
                </div>
            </div>
        </div>

        <!-- 4. FASE 2 (Span 12 - Grande) -->
        <div class="bento-card span-12">
            <div class="phase-badge">Hito Core - Experiencia Socio</div>
            <h2 class="phase-title">Fase 2: Portal del Socio y Automatización Cambiaria</h2>
            <p class="phase-objective">Habilitar el canal de autogestión financiera para los socios y el módulo de captura de la tasa de cambio oficial diaria.</p>
            <div class="bento-card-subgrid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
                <div class="deliverables-box">
                    <h5>Experiencia del Socio (Portal Web):</h5>
                    <ul class="deliverables-list">
                        <li><strong>Dashboard del Socio:</strong> Visualización consolidada de balance deudor, compras familiares unificadas y límite de crédito.</li>
                        <li><strong>Reporte Digital de Pagos:</strong> Formulario para reportar transferencias y Pago Móvil con indexación de tasa de cambio.</li>
                        <li><strong>Mesa de Ayuda WhatsApp:</strong> Generación automática de enlace con ticket de metadatos de pago para atención rápida de caja.</li>
                    </ul>
                </div>
                <div class="deliverables-box">
                    <h5>Captura de Tasa Oficial Cambiaria:</h5>
                    <ul class="deliverables-list">
                        <li><strong>Capturador Automatizado:</strong> Extracción diaria de la tasa oficial del Banco Central de Venezuela (BCV).</li>
                        <li><strong>Flujo de Aprobación:</strong> Registro de tasas propuestas que requieren autorización manual del Head Admin para activarse.</li>
                        <li><strong>Indexación en Tiempo Real:</strong> Recálculo inmediato de deudas en Bolívares y Dólares al activarse una tasa.</li>
                    </ul>
                </div>
            </div>
        </div>

        <!-- 5. FASE 3 (Span 12 - Grande) -->
        <div class="bento-card span-12">
            <div class="phase-badge">Hito Core - Inteligencia Financiera</div>
            <h2 class="phase-title">Fase 3: Motor de Conciliación Automática y Panel de Aprobaciones</h2>
            <p class="phase-objective">Implementar el motor inteligente de validación cruzada y el módulo administrativo para el staff de auditoría.</p>
            <div class="bento-card-subgrid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
                <div class="deliverables-box">
                    <h5>Motor de Cruce de Transacciones:</h5>
                    <ul class="deliverables-list">
                        <li><strong>Validación Atómica:</strong> Cruce automático de reportes contra extractos bancarios de acuerdo a clave única (Banco + Referencia).</li>
                        <li><strong>Reglas de Negocio Inteligentes:</strong> Tolerancia de +/-2 días en fechas bancarias y match del monto en Bolívares.</li>
                        <li><strong>Cola de Desviaciones:</strong> Derivación automática a estado "pendiente de auditoría" ante cualquier discrepancia.</li>
                    </ul>
                </div>
                <div class="deliverables-box">
                    <h5>Panel de Auditoría del Staff:</h5>
                    <ul class="deliverables-list">
                        <li><strong>Monitor de Discrepancias:</strong> Vista detallada de tickets con visualización de registros bancarios sugeridos.</li>
                        <li><strong>Carga de Extractos Bancarios:</strong> Cargador directo de extractos bancarios en CSV que dispara la auto-conciliación.</li>
                        <li><strong>Acción Correctiva:</strong> Edición de referencias por auditor y logs de aprobación/rechazo obligatorios.</li>
                    </ul>
                </div>
            </div>
        </div>

        <!-- 6. FASE 4 (Span 8) -->
        <div class="bento-card span-8">
            <div class="phase-badge">Gobernanza y Cumplimiento</div>
            <h2 class="phase-title">Fase 4: Panel Head Admin y Auditoría Completa (SUDEBAN)</h2>
            <p class="phase-objective">Ofrecer herramientas avanzadas de administración de crédito, gobernanza institucional y trazabilidad forense.</p>
            <div class="phase-content-grid">
                <div class="deliverables-box">
                    <h5>Entregables Clave:</h5>
                    <ul class="deliverables-list">
                        <li><strong>Métricas de Junta Directiva:</strong> Visualización consolidada de cartera deudora, pagos aprobados y alertas de riesgo.</li>
                        <li><strong>Gestión Flex de Límites:</strong> Modificación centralizada de límites de crédito y reasignación de roles.</li>
                        <li><strong>Bitácora Inalterable SUDEBAN:</strong> Registro forense de auditoría a nivel de base de datos protegido contra borrado o edición.</li>
                        <li><strong>Visor de Logs y IP:</strong> Seguimiento histórico detallado de acciones administrativas y direcciones IP origen.</li>
                    </ul>
                </div>
            </div>
        </div>

        <!-- 7. FASE 5 (Span 4) -->
        <div class="bento-card span-4">
            <div class="phase-badge">Despliegue y QA</div>
            <h2 class="phase-title">Fase 5: QA, Seguridad y Lanzamiento</h2>
            <p class="phase-objective">Certificar el desempeño seguro del sistema y realizar la puesta en producción final en el club.</p>
            <div class="phase-content-grid">
                <div class="deliverables-box">
                    <h5>Entregables Clave:</h5>
                    <ul class="deliverables-list">
                        <li><strong>Pruebas de Estrés:</strong> Simulación de procesamiento de más de 500 conciliaciones simultáneas.</li>
                        <li><strong>Auditoría de Seguridad Supabase:</strong> Checklist de contraseñas, RLS y rate limiting de peticiones.</li>
                        <li><strong>Producción y DNS:</strong> Despliegue en el dominio de producción del club bajo conexiones SSL.</li>
                        <li><strong>Capacitación de Staff:</strong> Manuales de operación del portal del socio y panel de caja.</li>
                    </ul>
                </div>
            </div>
        </div>

        <!-- 8. PIE DE PÁGINA -->
        <div class="bento-card footer">
            <div class="footer-summary">Ecosistema FinTech — 6 Etapas Modulares de Alto Valor</div>
            <div class="footer-risks">Planificación centrada en la reducción del riesgo operativo mediante el motor de conciliación y la tasa oficial automatizada.</div>
        </div>
    </div>
```

- [ ] **Step 2: Commit del brochure finalizado**

```bash
git add docs/brochure_fases.html
git commit -m "docs: implement bento grid content and structure for project phases brochure"
```

---

### Task 3: Compilación y Verificación

**Files:**
- Create: `Ecosistema_FinTech_Fases_Desarrollo.pdf` (Generado por comando)

- [ ] **Step 1: Compilar el brochure HTML a PDF en modo landscape**

Run:
```powershell
Start-Process "C:\Program Files\Google\Chrome\Application\chrome.exe" -ArgumentList "--headless=new", "--disable-gpu", "--no-sandbox", "--print-to-pdf=C:\Coding\PJNautico\Ecosistema_FinTech_Fases_Desarrollo.pdf", "C:\Coding\PJNautico\docs\brochure_fases.html" -Wait
```
Expected: Se crea el archivo `C:\Coding\PJNautico\Ecosistema_FinTech_Fases_Desarrollo.pdf` de forma exitosa.

- [ ] **Step 2: Verificar la existencia y tamaño del PDF generado**

Run:
```powershell
Get-ChildItem C:\Coding\PJNautico\Ecosistema_FinTech_Fases_Desarrollo.pdf
```
Expected: El archivo existe y su tamaño aproximado es de ~200-300 KB.

- [ ] **Step 3: Commit final del PDF compilado**

```bash
git add Ecosistema_FinTech_Fases_Desarrollo.pdf
git commit -m "docs: compile independent bento grid project phases brochure PDF"
```
