/**
 * Utilidad para impresión limpia de tickets térmicos sin elementos de la página web
 */
export function printThermalTicketElement(elementId: string = "printable-thermal-ticket") {
  const ticketElement = document.getElementById(elementId);
  if (!ticketElement) {
    console.error(`Elemento #${elementId} no encontrado para impresión.`);
    window.print();
    return;
  }

  const printWindow = window.open("", "_blank", "width=400,height=600");
  if (!printWindow) {
    // Si los popups están bloqueados, fallback al window.print estándar
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
          /* Ocultar encabezados y pies de página predeterminados del navegador */
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
