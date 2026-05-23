# Especificación de Diseño de Frontend: Paleta y Temas del Portal
**Fecha:** 2026-05-23
**Estado:** Propuesto (Para revisión de usuario)
**Autor:** Antigravity (AI Pair Programmer)

---

## 1. Introducción y Requerimientos Visuales

Esta especificación detalla el diseño de la interfaz del Portal del Socio de la Cuenta Club Social (Club Náutico de Maracaibo). El diseño debe ser minimalista pero de alto impacto visual, adaptable (totalmente responsivo) para teléfonos móviles y computadoras de escritorio, y enfocado en una usabilidad sin fricciones.

Como parte del MVP, implementamos una arquitectura multi-tema con un selector interactivo que permitirá comparar en tiempo real tres direcciones estéticas distintas:
1.  **Glassmorphism (Modern Yacht Club):** Estética futurista de alta gama que combina gradientes marinos profundos con paneles esmerilados y bordes dorados delgados.
2.  **Flat Minimalist (Sleek & Clean):** Diseño tradicional de alto contraste, bloques planos y foco absoluto en el contenido y legibilidad.
3.  **Neo-Brutalist Maritime (Bold & Dynamic):** Estilo geométrico contemporáneo con bordes negros gruesos, sombras de bloque desplazadas y animaciones con rebote.

---

## 2. Tipografías y Colores Base

El portal cargará fuentes desde Google Fonts para adaptar la personalidad tipográfica según el tema seleccionado.

### 2.1. Paleta de Colores por Defecto (Classic Yacht Club)
*   **Azul Marino Principal:** `#0F2C59` (RGB: `15, 44, 89`) - Denota seriedad, prestigio y herencia marítima.
*   **Dorado de Acento:** `#C5A880` (RGB: `197, 168, 128`) - Evoca metales pulidos, arena de playa y exclusividad.
*   **Fondo Claro:** `#F8F9FA` - Gris perla/blanco hielo limpio para legibilidad.
*   **Fondo Oscuro:** `#0A1128` - Azul noche profundo para el tema Glassmorphic.

### 2.2. Emparejamiento de Fuentes
*   **Glassmorphism:** *Outfit* (Títulos y Números) + *Inter* (Cuerpo de texto). Moderno, redondo y sofisticado.
*   **Flat Minimalist:** *Inter* (Todo el sistema). Limpio, altamente legible en pantallas pequeñas y neutro.
*   **Neo-Brutalist:** *Space Grotesk* (Títulos y Botones) + *Rubik* (Cuerpo de texto). Monoespaciado parcial, audaz y geométrico.

---

## 3. Arquitectura del Selector de Temas

El frontend (React + Vite) controlará el tema activo mediante un estado local sincronizado con `localStorage` y aplicado como un atributo `data-theme` en el contenedor raíz de la aplicación.

```jsx
// React Component snippet para aplicar el tema
import React, { useState, useEffect } from 'react';

export function App() {
  const [theme, setTheme] = useState(localStorage.getItem('portal-theme') || 'glass');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('portal-theme', theme);
  }, [theme]);

  return (
    <div className="app-container">
      {/* El selector de tema estará disponible en la navegación sidebar/navbar */}
      <ThemeSwitcher currentTheme={theme} onChangeTheme={setTheme} />
      <PortalLayout />
    </div>
  );
}
```

En `index.css`, se definirán las variables CSS de forma estructurada para cada tema:

```css
/* index.css - Estructura de Variables CSS */

/* Variables compartidas e inicialización (Glassmorphic por defecto) */
:root, [data-theme="glass"] {
  --font-title: 'Outfit', sans-serif;
  --font-body: 'Inter', sans-serif;
  
  --bg-app: radial-gradient(135deg, #0A1128 0%, #101F42 100%);
  --bg-card: rgba(255, 255, 255, 0.05);
  --border-card: 1px solid rgba(197, 168, 128, 0.25);
  --box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  --backdrop-blur: blur(12px);
  
  --color-text-primary: #FFFFFF;
  --color-text-secondary: #B0C4DE;
  --color-accent: #E5C583;
  --color-accent-hover: #D4B26F;
  --color-danger: #FF6B6B;
  --color-success: #51CF66;
  --color-warning: #FCC419;
  
  --transition-speed: 0.4s;
  --transition-easing: cubic-bezier(0.25, 0.8, 0.25, 1);
  --border-radius: 16px;
  --btn-shadow: none;
}

/* Tema Flat Minimalist */
[data-theme="flat"] {
  --font-title: 'Inter', sans-serif;
  --font-body: 'Inter', sans-serif;
  
  --bg-app: #F8F9FA;
  --bg-card: #FFFFFF;
  --border-card: 1px solid #E9ECEF;
  --box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  --backdrop-blur: none;
  
  --color-text-primary: #0F2C59;
  --color-text-secondary: #495057;
  --color-accent: #C5A880;
  --color-accent-hover: #B2956D;
  --color-danger: #DC3545;
  --color-success: #198754;
  --color-warning: #FFC107;
  
  --transition-speed: 0.15s;
  --transition-easing: ease-in-out;
  --border-radius: 8px;
  --btn-shadow: none;
}

/* Tema Neo-Brutalist */
[data-theme="brutalist"] {
  --font-title: 'Space Grotesk', sans-serif;
  --font-body: 'Rubik', sans-serif;
  
  --bg-app: #FFFDF0;
  --bg-card: #FFFFFF;
  --border-card: 3px solid #0F2C59;
  --box-shadow: 6px 6px 0px #0F2C59;
  --backdrop-blur: none;
  
  --color-text-primary: #0F2C59;
  --color-text-secondary: #343A40;
  --color-accent: #FFD93D;
  --color-accent-hover: #F4C400;
  --color-danger: #FF6B6B;
  --color-success: #6BCB77;
  --color-warning: #FFA500;
  
  --transition-speed: 0.2s;
  --transition-easing: cubic-bezier(0.175, 0.885, 0.32, 1.275);
  --border-radius: 0px;
  --btn-shadow: 3px 3px 0px #0F2C59;
}
```

---

## 4. Estructura Responsiva (Mobile vs Desktop)

La aplicación implementa una navegación adaptativa sin duplicación de código en el DOM:

### 4.1. Layout Mobile (Pantallas < 768px)
*   **Header Superior:** Barra minimalista fija con el logotipo del club estilizado, la tasa BCV activa del día y el botón del Selector de Temas.
*   **Bottom Navigation Bar:** Menú de pestañas fijo en la parte inferior de la pantalla con botones grandes adaptados al tacto:
    *   **Saldos** (Icono de Billetera/Dashboard)
    *   **Cuentas** (Icono de Recibo/Factura)
    *   **Historial** (Icono de Historial/Reloj)
*   **Contenedor de Contenido:** Altura completa con scroll interno y padding inferior para evitar colisión con la barra de navegación.

### 4.2. Layout Desktop (Pantallas >= 768px)
*   **Sidebar Izquierdo Fijo:** Ocupa el 20% del ancho de pantalla. Contiene:
    *   Logotipo CNM (Club Náutico de Maracaibo).
    *   Avatar y nombre del socio.
    *   Navegación vertical clásica con hover states fluidos.
    *   Control del Selector de Temas de tres posiciones (botones tipo "radio tab" estilizados).
*   **Panel de Contenido Central:** Ocupa el 80% restante, estructurado en un grid limpio que muestra la información de la pestaña activa con espaciados generosos.

---

## 5. Diseño Detallado de Vistas (Socio)

### 5.1. Vista de Saldos (Dashboard)
*   **Widget de Tarjeta de Crédito:** Un bloque destacado que simula la tarjeta física del socio.
    *   Muestra el número de membresía y el nombre del socio en el frente.
    *   Presenta de forma legible: **Límite Total Autorizado (USD)** y **Balance Consumido (USD)**.
*   **Detalle Cambiario:** Bloque inferior que desglosa el cálculo en bolívares (VES):
    *   `Fórmula: Deuda USD * Tasa BCV = Deuda VES`.
    *   Muestra la tasa BCV oficial activa utilizada para el cálculo.
*   **Animación destacada (Glassmorphism):** Un efecto de brillo lineal en diagonal que recorre la tarjeta lentamente cada 6 segundos (`@keyframes shimmer`).

### 5.2. Vista de Cuentas (Consumos Pendientes)
*   Muestra una tabla (en escritorio) o tarjetas de feed (en móvil) de facturas importadas en estado `'pending'`.
*   Cada consumo incluye un botón principal de acción:
    *   **Botón "Pagar con Crédito":** Ejecuta una llamada de confirmación inmediata y reduce la deuda disponible de la tarjeta digital con un efecto de conteo numérico en retroceso.
    *   **Botón "Reportar Pago Banco":** Abre un modal central con el formulario de reporte de pago.

### 5.3. Formulario de Reporte de Pago (Modal)
*   **Campos Requeridos:**
    *   Método de Pago (`mobile_payment` o `transfer`).
    *   Banco de Origen (Dropdown con lista de bancos venezolanos y sus códigos).
    *   Número de Referencia Bancaria (Validación estricta de solo números).
    *   Fecha de Pago (Selector de calendario limitado a ±2 días respecto al día de hoy).
    *   Monto en Bolívares (VES).
*   **Cálculo en Tiempo Real:** A medida que el socio escribe el monto en VES, el formulario muestra un indicador dinámico con el equivalente en USD aplicando la tasa activa actual.

### 5.4. Vista de Historial (Tickets Reportados)
*   Lista cronológica de los reportes enviados.
*   Cada ticket muestra su estado con un badge de color distintivo:
    *   `auto_approved` (Cruce exitoso en motor): Verde.
    *   `pending_audit` (Discrepancia de monto/fecha o no se encuentra en el extracto): Amarillo.
    *   `rejected` (Rechazado manualmente por el auditor): Rojo.
*   **Botón WhatsApp Link:** Si un ticket tiene estado `pending_audit` o `rejected`, aparece un botón con el icono de WhatsApp que dice *"Contactar Caja"*. Este abre un chat de soporte con el mensaje pre-formateado con los detalles del reporte para agilizar la conciliación humana en taquilla.

---

## 6. Animaciones y Transiciones de UI

Las transiciones están centralizadas en el archivo de estilos y se activan según la duración definida por el token `--transition-speed`.

### 6.1. Efecto Brutalista "Press State"
En el tema `brutalist`, los botones tienen un borde negro grueso y no tienen transición de opacidad. En su lugar, el efecto de presionado se define así:

```css
[data-theme="brutalist"] .btn-primary {
  transform: translate(0, 0);
  box-shadow: 4px 4px 0px #0F2C59;
}
[data-theme="brutalist"] .btn-primary:hover {
  transform: translate(-2px, -2px);
  box-shadow: 6px 6px 0px #0F2C59;
}
[data-theme="brutalist"] .btn-primary:active {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0px #0F2C59;
}
```

### 6.2. Efecto de Cambio de Pestañas (Fades & Slides)
El contenido de cada vista se renderizará con una animación de entrada fluida:

```css
@keyframes slideUpFade {
  from {
    opacity: 0;
    transform: translateY(12px);
    filter: blur(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0);
  }
}

.view-content-active {
  animation: slideUpFade var(--transition-speed) var(--transition-easing) forwards;
}
```
*(Nota: En el tema `flat`, el filtro `blur` y el desplazamiento vertical se desactivan asignando variables alternativas para mantener el diseño limpio y rápido).*

---

## 7. Plan de Verificación Visual

1.  **Verificación Responsiva:** Probar la aplicación reduciendo el ancho del navegador en Chrome DevTools a dispositivos iPhone SE (375px), iPhone 12 Pro (390px) y iPad (768px). Asegurar que la barra inferior no colisione con el contenido.
2.  **Verificación de Desempeño de Animación:** Medir la tasa de refresco (FPS) durante las transiciones del tema Glassmorphism en un dispositivo móvil de gama media. Las animaciones deben mantenerse por encima de los 55 FPS.
3.  **Consistencia de Controles:** Validar que al cambiar de tema, el selector permanezca visible y accesible en las tres interfaces gráficas.
