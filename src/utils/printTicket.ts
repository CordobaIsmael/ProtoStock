/**
 * Utilidad de Impresión de Tickets Térmicos para ProtoStock
 * Soporta impresión del navegador (Desktop / Móvil) e impresión directa por Bluetooth con RawBT (Android)
 */

export function printThermalTicketElement(elementId: string = "printable-thermal-ticket") {
  const ticketElement = document.getElementById(elementId);
  if (!ticketElement) {
    console.error(`Elemento #${elementId} no encontrado para impresión.`);
    window.print();
    return;
  }

  // Detectar si estamos en un dispositivo móvil
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  if (isMobile) {
    // En móviles, window.open sufre bloqueo de popups por el navegador.
    // Usamos window.print() directamente sobre la ventana principal aprovechando los estilos @media print de globals.css
    window.print();
  } else {
    // En PC / Desktop, abrimos la ventana de impresión dedicada
    const printWindow = window.open("", "_blank", "width=400,height=600");
    if (!printWindow) {
      window.print();
      return;
    }

    const ticketHtml = ticketElement.outerHTML;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="es">
        <head>
          <meta charset="utf-8" />
          <title>Impresión de Ticket - ProtoStock</title>
          <style>
            @page {
              size: auto;
              margin: 0;
            }
            *, *:before, *:after {
              box-sizing: border-box;
            }
            body {
              margin: 0;
              padding: 4px;
              background: #ffffff !important;
              color: #000000 !important;
              font-family: monospace, 'Courier New', Courier;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            header, footer {
              display: none !important;
            }
          </style>
        </head>
        <body>
          ${ticketHtml}
          <script>
            window.onload = function() {
              window.focus();
              window.print();
              setTimeout(function() {
                window.close();
              }, 300);
            };
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
  }
}

interface RawBTTicketData {
  storeName?: string;
  storeTaxId?: string;
  storeAddress?: string;
  storePhone?: string;
  ticketNumber: string | number;
  date: string;
  cashierName: string;
  customerName?: string;
  items: Array<{
    name: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
    unitType?: string;
    isWeighted?: boolean;
  }>;
  totalAmount: number;
  paymentMethod: string;
  cashTendered?: number;
  changeDue?: number;
  isFiscal?: boolean;
  caeNumber?: string;
}

/**
 * Envía el ticket directamente a la app RawBT por Intent en Android (Bluetooth Térmico)
 */
export function printThermalTicketRawBT(data: RawBTTicketData) {
  const storeName = data.storeName || "ProtoStock - Fiambrería & Almacén";
  const storeTaxId = data.storeTaxId || "30-71829384-9";
  const storeAddress = data.storeAddress || "Av. San Martín 1420";
  const storePhone = data.storePhone || "+54 9 11 4567-8900";

  let lines: string[] = [];

  lines.push("================================");
  lines.push(storeName.toUpperCase());
  lines.push(`CUIT: ${storeTaxId}`);
  lines.push(storeAddress);
  lines.push(`Tel: ${storePhone}`);
  lines.push("--------------------------------");
  lines.push(data.isFiscal ? "FACTURA C - ORIGINAL" : "COMPROBANTE NO FISCAL");
  lines.push(data.isFiscal ? "AFIP - CAE OTORGADO" : "CONTROL INTERNO DE CAJA");
  lines.push("--------------------------------");
  lines.push(`TICKET #: ${data.ticketNumber}`);
  lines.push(`FECHA: ${data.date}`);
  lines.push(`CAJERO: ${data.cashierName}`);
  lines.push(`CLIENTE: ${data.customerName || "Consumidor Final"}`);
  lines.push("--------------------------------");
  lines.push("CANT / PRODUCTO            TOTAL");
  lines.push("--------------------------------");

  data.items.forEach((item) => {
    lines.push(item.name);
    const qtyStr = `${item.quantity.toFixed(item.isWeighted ? 3 : 0)} ${item.isWeighted ? "KG" : "UN"} x $${item.unitPrice.toLocaleString("es-AR")}`;
    const subStr = `$${item.subtotal.toLocaleString("es-AR")}`;
    const padding = Math.max(1, 32 - (qtyStr.length + subStr.length));
    lines.push(qtyStr + " ".repeat(padding) + subStr);
  });

  lines.push("--------------------------------");
  lines.push(`TOTAL: $${data.totalAmount.toLocaleString("es-AR")}`);
  lines.push(`FORMA PAGO: ${data.paymentMethod}`);

  if (data.paymentMethod === "EFECTIVO" && (data.cashTendered || 0) > 0) {
    lines.push(`PAGO CON: $${(data.cashTendered || 0).toLocaleString("es-AR")}`);
    lines.push(`VUELTO:   $${(data.changeDue || 0).toLocaleString("es-AR")}`);
  }

  lines.push("--------------------------------");
  lines.push("   ¡Gracias por su compra!   ");
  lines.push("================================");
  lines.push("\n\n\n");

  const fullText = lines.join("\n");

  try {
    // Codificar a UTF-8 Base64 para RawBT Intent
    const base64Data = btoa(unescape(encodeURIComponent(fullText)));
    const intentUrl = `intent:data:text/plain;base64,${base64Data}#Intent;scheme=rawbt;package=ru.a404.rawbt;end;`;
    window.location.href = intentUrl;
  } catch (err) {
    console.error("Error al enviar Intent a RawBT:", err);
    // Fallback a impresión estándar del navegador
    printThermalTicketElement();
  }
}
