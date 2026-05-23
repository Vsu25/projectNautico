import React from 'react';
import './InfoView.css';

export function InfoView() {
  return (
    <div className="view-content-active">
      <h1 className="view-title">Guía de Pago</h1>
      <p className="info-subtitle">Sigue estos pasos para realizar y reportar tus pagos correctamente.</p>
      
      <div className="steps-container">
        <div className="step-card card">
          <div className="step-number">1</div>
          <div className="step-content">
            <h3>Depositar o Transferir</h3>
            <p>Realiza el pago a cualquiera de las cuentas del Club Náutico:</p>
            <div className="bank-details">
              <div className="bank-item">
                <strong>Pago Móvil</strong>
                <span>Banco Banesco (0134)</span>
                <span>RIF: J-00000000-0</span>
                <span>Tel: 0414-0000000</span>
              </div>
              <div className="bank-item">
                <strong>Zelle</strong>
                <span>pagos@nautico.com.ve</span>
              </div>
            </div>
          </div>
        </div>

        <div className="step-card card">
          <div className="step-number">2</div>
          <div className="step-content">
            <h3>Reportar el Pago</h3>
            <p>Una vez realizado el pago, dirígete a la pestaña <strong>Cuentas</strong>.</p>
            <ul>
              <li>Selecciona la factura que deseas pagar (o usa "Pagar Todas").</li>
              <li>Ingresa el número de referencia y el monto.</li>
              <li>Adjunta el comprobante (opcional) y envía el reporte.</li>
            </ul>
          </div>
        </div>

        <div className="step-card card">
          <div className="step-number">3</div>
          <div className="step-content">
            <h3>Validación</h3>
            <p>El departamento de caja revisará tu pago en un plazo de 24 horas.</p>
            <ul>
              <li>Si es <strong>Aprobado</strong>, la factura desaparecerá de Cuentas y se reflejará en tu Historial.</li>
              <li>Si es <strong>Rechazado</strong>, verás una alerta en el Historial indicando el motivo.</li>
            </ul>
            <div className="support-box">
              <p>¿Problemas con un pago rechazado?</p>
              <button className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
                Contactar a Caja por WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
