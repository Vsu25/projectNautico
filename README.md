# FineTech — projectNautico (Cuenta Club Social)

SaaS platform for financial management, credit lines allocation, and auditing for members and administrators of a social club. Designed to scale from 2,000 to 8,000+ active users.

Este proyecto ha sido desarrollado bajo el nombre **FineTech** y se denomina técnicamente **projectNautico**. Permite el pago y amortización de deudas mediante conciliación pasiva automatizada de transferencias y Pago Móvil (Venezuela), con contingencia de auditoría manual conforme a la regulación de SUDEBAN.

---

## 🚀 Características Principales / Key Features

- 💳 **Gestión de Crédito e Indexación (USD/VES):** Asignación de límites de crédito a socios, control de saldo deudor e indexación precisa utilizando la tasa oficial del Banco Central de Venezuela (BCV).
- 🔄 **Motor de Conciliación Híbrido:** Validación automática de reportes de pago móvil y transferencias mediante importación de extractos bancarios en CSV, con tolerancia de ±2 días y control de claves únicas.
- 📱 **Flujo de Soporte y Edición:** Los socios pueden corregir reportes erróneos pendientes de auditoría o iniciar un flujo de soporte directo por WhatsApp con mensajes formateados automáticamente.
- 🛡️ **Seguridad y Cumplimiento (SUDEBAN):**
  - Políticas de seguridad a nivel de fila (RLS) en Supabase para segregar permisos de Socios, Auditores y Head Admins.
  - Bitácora inalterable de auditoría (`audit_logs`) sin permisos de modificación (`UPDATE` o `DELETE`).
  - Registro forzoso de IP y marca temporal para acciones críticas.
- 🤖 **Continuidad Agente / Agentic Integration:** Este repositorio incluye de forma integral el directorio de habilidades (`.agents/skills/`) y el historial de sesiones de brainstorm (`.superpowers/`), permitiendo a agentes de IA interactuar y continuar con el desarrollo del proyecto de forma nativa.

---

## 🛠️ Stack Tecnológico / Tech Stack

- **Frontend:** React 19 + Vite + Vanilla CSS
- **Backend/Base de Datos:** Supabase (PostgreSQL con Row Level Security)
- **Pruebas:** Vitest + React Testing Library + JSDOM
- **Agentes de IA:** Habilidades y flujos bajo `.agents/` y `.superpowers/`

---

## 📁 Estructura del Proyecto / Project Structure

```
PJNautico/
├── .agents/               # Habilidades y lógica del agente de desarrollo (skills)
├── .superpowers/          # Sesiones de brainstorm del agente de IA
├── docs/                  # Documentación del proyecto (diagramas, reportes, brochure)
├── public/                # Recursos estáticos públicos
├── src/
│   ├── components/        # Componentes reutilizables
│   ├── views/             # Páginas y vistas principales (Login, Saldos, Cuentas, etc.)
│   ├── App.jsx            # Enrutador y layout principal
│   ├── index.css          # Estilos globales y tokens de diseño
│   └── main.jsx           # Punto de entrada de React
├── package.json           # Dependencias y scripts del proyecto
└── vite.config.js         # Configuración de Vite
```

---

## 💻 Instalación y Desarrollo / Installation & Development

### 1. Clonar el repositorio
```bash
git clone https://github.com/Vsu25/projectNautico.git
cd projectNautico
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Iniciar servidor de desarrollo
```bash
npm run dev
```

### 4. Ejecutar pruebas unitarias
```bash
npm run test
```

### 5. Compilar para producción
```bash
npm run build
```

---

## 👥 Roles del Sistema / System Roles

1. **Socio (User):** Consulta de saldos, pedidos pendientes y reportes de pago móvil/transferencias.
2. **Auditor (Staff Admin):** Visualización y gestión manual de la cola de pagos pendientes de conciliación.
3. **Head Admin (SuperAdmin):** Acceso total de auditoría y aprobación exclusiva de la tasa cambiaria propuesta por la Edge Function del BCV.

---

Desarrollado y mantenido bajo los lineamientos y estándares de **FineTech**.
