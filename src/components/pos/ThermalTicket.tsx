"use client";

import React from "react";

interface ThermalTicketProps {
  storeName?: string;
  storeTaxId?: string;
  storeAddress?: string;
  storePhone?: string;
  ticketNumber: number | string;
  date: string;
  cashierName: string;
  customerName?: string;
  items: Array<{
    name: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
    unitType: string;
    isWeighted: boolean;
  }>;
  totalAmount: number;
  paymentMethod: string;
  cashTendered?: number;
  changeDue?: number;
  paperWidth?: "58mm" | "80mm";
  footerMessage?: string;
  isFiscal?: boolean;
  caeNumber?: string;
}

export default function ThermalTicket({
  storeName = "ProtoStock - Fiambrería & Almacén",
  storeTaxId = "30-71829384-9",
  storeAddress = "Av. San Martín 1420",
  storePhone = "+54 9 11 4567-8900",
  ticketNumber,
  date,
  cashierName,
  customerName = "Consumidor Final",
  items,
  totalAmount,
  paymentMethod,
  cashTendered = 0,
  changeDue = 0,
  paperWidth = "58mm",
  footerMessage = "¡Gracias por su compra!",
  isFiscal = false,
  caeNumber,
}: ThermalTicketProps) {
  const is58mm = paperWidth === "58mm";

  return (
    <div
      id="printable-thermal-ticket"
      className={`bg-white text-black font-mono text-xs p-2 leading-tight ${
        is58mm ? "w-[58mm] max-w-[58mm]" : "w-[80mm] max-w-[80mm]"
      } mx-auto border border-slate-300 shadow-md select-none print:shadow-none print:border-none print:m-0 print:p-0`}
    >
      {/* Encabezado del Comercio */}
      <div className="text-center space-y-0.5 border-b border-dashed border-black pb-2 mb-2">
        <h2 className="font-extrabold text-sm uppercase tracking-tighter">
          {storeName}
        </h2>
        <p className="text-[10px]">CUIT: {storeTaxId}</p>
        <p className="text-[10px]">{storeAddress}</p>
        <p className="text-[10px]">Tel: {storePhone}</p>
        <div className="mt-1 pt-1 border-t border-dotted border-black">
          <p className="font-bold text-[10px] uppercase">
            {isFiscal ? "FACTURA C - ORIGINAL" : "COMPROBANTE NO FISCAL"}
          </p>
          <p className="text-[9px] text-slate-700">
            {isFiscal ? "AFIP - CAE OTORGADO" : "CONTROL INTERNO DE CAJA"}
          </p>
        </div>
      </div>

      {/* Datos del Ticket */}
      <div className="text-[10px] space-y-0.5 border-b border-dashed border-black pb-2 mb-2">
        <div className="flex justify-between">
          <span>TICKET: #{ticketNumber}</span>
          <span>{date}</span>
        </div>
        <div className="flex justify-between">
          <span>CAJERO: {cashierName}</span>
        </div>
        <div className="flex justify-between">
          <span>CLIENTE: {customerName}</span>
        </div>
      </div>

      {/* Renglones de Productos */}
      <div className="border-b border-dashed border-black pb-2 mb-2 space-y-1">
        <div className="flex justify-between font-bold text-[10px] border-b border-dotted border-black pb-0.5">
          <span>CANT / PRODUCTO</span>
          <span>TOTAL</span>
        </div>

        {items.map((item, idx) => (
          <div key={idx} className="space-y-0.5 text-[10px]">
            <div className="font-semibold">{item.name}</div>
            <div className="flex justify-between text-[9px] text-slate-800 pl-1">
              <span>
                {item.quantity.toFixed(item.isWeighted ? 3 : 0)}{" "}
                {item.isWeighted ? "KG" : "UN"} x ${item.unitPrice.toLocaleString("es-AR")}
              </span>
              <span className="font-mono font-bold">
                ${item.subtotal.toLocaleString("es-AR")}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Totales */}
      <div className="space-y-1 border-b border-dashed border-black pb-2 mb-2">
        <div className="flex justify-between font-extrabold text-sm">
          <span>TOTAL:</span>
          <span>${totalAmount.toLocaleString("es-AR")}</span>
        </div>
        <div className="flex justify-between text-[10px]">
          <span>MÉTODO DE PAGO:</span>
          <span className="font-bold">{paymentMethod}</span>
        </div>

        {paymentMethod === "EFECTIVO" && cashTendered > 0 && (
          <>
            <div className="flex justify-between text-[10px]">
              <span>PAGÓ CON:</span>
              <span>${cashTendered.toLocaleString("es-AR")}</span>
            </div>
            <div className="flex justify-between text-[10px] font-bold">
              <span>SU VUELTO:</span>
              <span>${changeDue.toLocaleString("es-AR")}</span>
            </div>
          </>
        )}
      </div>

      {/* Pie del Ticket & Leyendas */}
      <div className="text-center space-y-1 pt-1">
        <p className="font-bold text-[10px]">{footerMessage}</p>
        {isFiscal && caeNumber ? (
          <div className="text-[9px] font-mono border-t border-dotted border-black pt-1">
            <p>CAE N°: {caeNumber}</p>
            <p>VTO. CAE: 10/08/2026</p>
          </div>
        ) : (
          <p className="text-[8px] text-slate-600 uppercase">
            *** DOCUMENTO NO VÁLIDO COMO FACTURA ***
          </p>
        )}
      </div>
    </div>
  );
}
