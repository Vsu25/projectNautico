# Flujo de Facturas Pendientes y Motivo de Facturación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mostrar de manera clara y explícita el por qué se factura cada cuenta pendiente en el panel de socios, reflejando el monto en dólares con la etiqueta "REF" y mostrando la conversión a bolívares (VES) a la tasa actual únicamente cuando se accede al flujo de reporte de transferencia bancaria.

**Architecture:** Modificar `CuentasView.jsx`, `CuentasView.css` y `CreditPaymentModal.jsx` para agregar la caja de motivo de facturación unificada. Ajustar las etiquetas de precio para mostrar "$ [monto] REF" y mostrar la conversión de tasa actual prominentemente en `PaymentModal.jsx`.

**Tech Stack:** React (JSX), CSS, Vitest.

---

## Proposed Changes

### Component: CuentasView & Styling
Map of files to modify:
* [CuentasView.jsx](file:///c:/Coding/PJNautico/src/views/CuentasView.jsx)
* [CuentasView.css](file:///c:/Coding/PJNautico/src/views/CuentasView.css)

### Component: CreditPaymentModal
Map of files to modify:
* [CreditPaymentModal.jsx](file:///c:/Coding/PJNautico/src/components/CreditPaymentModal.jsx)

### Component: PaymentModal
Map of files to modify:
* [PaymentModal.jsx](file:///c:/Coding/PJNautico/src/components/PaymentModal.jsx)

### Tests
Map of files to modify/run:
* [CuentasView.test.jsx](file:///c:/Coding/PJNautico/src/views/CuentasView.test.jsx)
* [CreditPaymentModal.test.jsx](file:///c:/Coding/PJNautico/src/components/CreditPaymentModal.test.jsx)

---

### Task 1: Actualizar CuentasView con Motivo Destacado y Formato REF

**Files:**
* Modify: [CuentasView.jsx](file:///c:/Coding/PJNautico/src/views/CuentasView.jsx)
* Modify: [CuentasView.css](file:///c:/Coding/PJNautico/src/views/CuentasView.css)
* Test: [CuentasView.test.jsx](file:///c:/Coding/PJNautico/src/views/CuentasView.test.jsx)

- [ ] **Step 1: Modificar `CuentasView.jsx`**
  Modificar la lista de facturas para:
  1. Insertar el bloque de motivo `.bill-reason-box` debajo de la cabecera de la factura.
  2. Cambiar la visualización del monto en USD por `$ {bill.amountUsd.toFixed(2)} REF`.
  3. Quitar la visualización directa del monto en bolívares (VES) del listado principal de facturas pendientes, ya que el cambio a tasa actual solo debe mostrarse al acceder al pago por transferencia/pago móvil.
  
  Código a insertar para el motivo:
  ```jsx
  <div className="bill-reason-box">
    <span className="reason-label">Motivo de Facturación / Concepto</span>
    <strong className="reason-text">{bill.description}</strong>
  </div>
  ```

  Código de cambio en los montos:
  ```jsx
  <div className="bill-amounts">
    <span className="bill-usd">${bill.amountUsd.toFixed(2)} REF</span>
  </div>
  ```

- [ ] **Step 2: Modificar `CuentasView.css`**
  Agregar las clases para el diseño premium de la caja de motivos:
  ```css
  .bill-reason-box {
    background: rgba(197, 168, 128, 0.08);
    border-left: 3px solid var(--color-accent);
    border-radius: 0 var(--border-radius) var(--border-radius) 0;
    padding: 0.8rem 1rem;
    margin-bottom: 0.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }

  [data-theme="flat"] .bill-reason-box {
    background: #F8F9FA;
    border-left: 3px solid #0056b3;
  }

  [data-theme="brutalist"] .bill-reason-box {
    background: transparent;
    border: 2px solid #0F2C59;
    border-left: 6px solid #0F2C59;
  }

  .reason-label {
    font-size: 0.75rem;
    color: var(--color-text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .reason-text {
    font-size: 1.05rem;
    color: var(--color-accent);
    font-weight: 700;
  }

  [data-theme="flat"] .reason-text {
    color: #212529;
  }

  [data-theme="brutalist"] .reason-text {
    color: #0F2C59;
  }
  ```

- [ ] **Step 3: Actualizar `CuentasView.test.jsx`**
  Modificar la prueba para validar el nuevo texto `$45.00 REF` y verificar que el texto `Bs. ` no esté presente de forma predeterminada en el listado de facturas.
  
  ```javascript
  // Modificar línea en CuentasView.test.jsx
  expect(screen.getByText('$45.00 REF')).toBeInTheDocument();
  expect(screen.queryByText('Bs.')).not.toBeInTheDocument();
  ```

- [ ] **Step 4: Ejecutar pruebas unitarias**
  Correr: `npx vitest run src/views/CuentasView.test.jsx`
  Expected: PASS

- [ ] **Step 5: Realizar Commit**
  Ejecutar:
  ```bash
  git add src/views/CuentasView.jsx src/views/CuentasView.css src/views/CuentasView.test.jsx
  git commit -m "UI design: add pending bills reason card and format USD amount with REF tag"
  ```

---

### Task 2: Actualizar CreditPaymentModal para incluir Motivo de Facturación y Tag REF

**Files:**
* Modify: [CreditPaymentModal.jsx](file:///c:/Coding/PJNautico/src/components/CreditPaymentModal.jsx)
* Test: [CreditPaymentModal.test.jsx](file:///c:/Coding/PJNautico/src/components/CreditPaymentModal.test.jsx)

- [ ] **Step 1: Modificar `CreditPaymentModal.jsx`**
  1. Insertar el bloque de motivo unificado en el Paso 1, arriba de la tabla.
  2. Ajustar los montos totales mostrados en la tabla para incluir la etiqueta `REF`.
  
  Código a insertar en `Step 1` (alrededor de la línea 31):
  ```jsx
  <div className="bill-reason-box" style={{ marginBottom: '1.25rem' }}>
    <span className="reason-label">Motivo de Facturación / Concepto</span>
    <strong className="reason-text">{bill.description}</strong>
  </div>
  ```

  Código de montos en la tabla:
  ```jsx
  <tr style={{ fontWeight: 'bold', borderTop: '2px solid var(--color-border)' }}>
    <td colSpan="3">Total a Pagar</td>
    <td style={{ textAlign: 'right' }}>${bill.amountUsd.toFixed(2)} REF</td>
  </tr>
  ```

- [ ] **Step 2: Actualizar `CreditPaymentModal.test.jsx`**
  Ajustar las aserciones de prueba para reflejar la etiqueta `REF` y verificar que el motivo del cargo se muestre en pantalla.
  
  ```javascript
  // En CreditPaymentModal.test.jsx
  expect(screen.getByText('Motivo de Facturación / Concepto')).toBeInTheDocument();
  expect(screen.getByText('$100.00 REF')).toBeInTheDocument();
  ```

- [ ] **Step 3: Ejecutar pruebas unitarias**
  Correr: `npx vitest run src/components/CreditPaymentModal.test.jsx`
  Expected: PASS

- [ ] **Step 4: Realizar Commit**
  Ejecutar:
  ```bash
  git add src/components/CreditPaymentModal.jsx src/components/CreditPaymentModal.test.jsx
  git commit -m "UI design: include pending reason box in Step 1 of credit payment modal and add REF tags"
  ```

---

### Task 3: Ajustar PaymentModal para destacar la conversión de tasa actual (BCV)

**Files:**
* Modify: [PaymentModal.jsx](file:///c:/Coding/PJNautico/src/components/PaymentModal.jsx)

- [ ] **Step 1: Modificar `PaymentModal.jsx`**
  1. Asegurar que en el Paso 1 se muestre la etiqueta `REF` al lado del total en USD.
  2. En el Paso 2 (formulario de reporte), resaltar de forma muy llamativa la tasa actual BCV y la conversión a bolívares para guiar al socio de manera efectiva.
  
  Código de montos en la tabla del Paso 1:
  ```jsx
  <tr style={{ fontWeight: 'bold', borderTop: '2px solid var(--color-border)' }}>
    <td colSpan="3" style={{ padding: '0.6rem' }}>Total USD</td>
    <td style={{ padding: '0.6rem', textAlign: 'right' }}>${bill.amountUsd.toFixed(2)} REF</td>
  </tr>
  ```

  Código de destaque en el Paso 2:
  ```jsx
  <div className="bcv-rate-highlight" style={{ background: 'rgba(197, 168, 128, 0.1)', border: '1px solid var(--color-accent)', padding: '0.8rem 1rem', borderRadius: '8px', marginBottom: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
      <span>Monto de Referencia:</span>
      <strong>${bill.amountUsd.toFixed(2)} REF</strong>
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
      <span>Tasa Oficial BCV actual:</span>
      <strong>Bs. {bcvRate.toFixed(2)}</strong>
    </div>
    <hr style={{ border: '0', borderTop: '1px solid rgba(197, 168, 128, 0.2)', margin: '0.4rem 0' }} />
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', fontWeight: 'bold' }}>
      <span>Monto Equivalente a Transferir:</span>
      <span style={{ color: 'var(--color-accent)' }}>Bs. {(bill.amountUsd * bcvRate).toLocaleString('es-VE', { minimumFractionDigits: 2 })}</span>
    </div>
  </div>
  ```

- [ ] **Step 2: Ejecutar todas las pruebas unitarias**
  Correr: `npx vitest run`
  Expected: PASS

- [ ] **Step 3: Realizar Commit**
  Ejecutar:
  ```bash
  git add src/components/PaymentModal.jsx
  git commit -m "UI design: enhance bank transfer modal step 2 to emphasize BCV exchange rate and VES conversion"
  ```
