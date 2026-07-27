# 📖 Manual Oficial e Instructivo de Uso - ProtoStock POS

¡Bienvenido al **Manual Oficial de ProtoStock**! Este documento detalla cada una de las funcionalidades, módulos, roles de usuario y flujos de trabajo de tu sistema de gestión comercial.

---

## 📌 Índice de Módulos
1. [Visión General & Compatibilidad](#1-visión-general--compatibilidad)
2. [Roles de Usuario & Seguridad (RBAC)](#2-roles-de-usuario--seguridad-rbac)
3. [Módulo POS: Punto de Venta & Cobro](#3-módulo-pos-punto-de-venta--cobro)
4. [Módulo Impresión de Ticket Térmico (58mm / 80mm)](#4-módulo-impresión-de-ticket-térmico-58mm--80mm)
5. [Módulo Productos, Precios & Importación desde Excel](#5-módulo-productos-precios--importación-desde-excel)
6. [Módulo Turnos & Caja Diaria](#6-módulo-turnos--caja-diaria)
7. [Módulo Compras, Lotes & Proveedores Frecuentes](#7-módulo-compras-lotes--proveedores-frecuentes)
8. [Módulo Reportes & Métricas de Ganancia](#8-módulo-reportes--métricas-de-ganancia)
9. [Centro de Notificaciones Inteligentes por Rol](#9-centro-de-notificaciones-inteligentes-por-rol)

---

## 1. Visión General & Compatibilidad

**ProtoStock** es un sistema web integral diseñado específicamente para el ritmo de trabajo de **fiambrerías, almacenes, kioscos y mini-mercados**.

- **📱 Multidispositivo**: Funciona en computadoras de escritorio, tablets (Android / iPad) y teléfonos celulares.
- **🔌 Periféricos Soportados**:
  - Pistolas Lectoras de Código de Barras (USB / Bluetooth).
  - Balanzas electrónicas (venta fraccionada por Kilo/Gramos).
  - Impresoras Térmicas de Tickets (formato 58mm y 80mm).
- **📺 Modo App Pantalla Completa (PWA)**: Se instala directamente desde el navegador Chrome como una App fija sin bordes ni pestañas.

---

## 2. Roles de Usuario & Seguridad (RBAC)

El sistema protege la información de tu negocio separando los permisos en **3 Niveles de Acceso**:

### 👑 ADMINISTRADOR (`ADMIN`)
- **Permisos Totales**: Acceso completo a todas las pantallas.
- **Gestión de Contraseñas**: Puede ver y modificar la contraseña o PIN de cualquier usuario del sistema (incluida la suya propia).
- **Auditoría de Caja**: Puede visualizar los egresos/retiros de caja realizados por los empleados y ver las métricas de ganancia bruta.
- **Creación de Usuarios**: Único rol facultado para dar de alta o baja empleados.

### 👔 ENCARGADO (`ENCARGADO`)
- **Supervisión Operativa**: Acceso a Dashboard, Ventas (POS), Caja, Productos, Compras y Reportes.
- **Gestión de Catálogo & Precios**: Puede cambiar precios, dar de baja productos por vencimiento y cargar lotes de compras.
- **Ver Usuarios (Modo Lectura)**: Puede ver la lista de personal del local, sin acceso a ver sus contraseñas ni facultad para crear usuarios nuevos.

### 💵 CAJERO (`CAJERO`)
- **Acceso Exclusivo de Mostrador**: Acceso enfocado a **Ventas / POS**, **Apertura y Cierre de Caja** y consulta de precios de productos en modo lectura.
- **Seguridad**: Bloqueado para ver ganancias, crear productos, ver contraseñas o modificar reportes del negocio.

---

## 3. Módulo POS: Punto de Venta & Cobro

La pantalla de **Ventas / POS** está optimizada para la máxima velocidad de cobro en mostrador.

### 🔍 Buscador & Pistola Lectora
- Presiona la tecla **`F2`** o haz clic en la barra para buscar por código de barras, SKU o nombre.
- Si usas pistola lectora, el código escaneado se agrega automáticamente al ticket en milisegundos.

### 📱 Modo Tablet (Sin Teclado Virtual Emergente)
- Botón superior: **`📱 Modo Tablet (Sin Teclado)`**.
- Al activarse, la tablet no abre el molesto teclado táctil de Android/iPadOS que tapa la pantalla, permitiendo escanear o tocar productos de forma fluida.

### ⚖️ Venta Fraccionada por Peso (Fiambrería)
- Al hacer clic en un producto por kilo (ej: *Queso Tybo*, *Jamón Cocido*), se abre el modal de peso.
- **Botones de Selección Rápida**: `100g`, `150g`, `200g`, `250g`, `300g`, `500g`, `750g`, `1 kg`.
- Muestra en tiempo real el cálculo automático del importe a cobrar.

### 💳 Proceso de Cobro & Calculadora de Vuelto
1. Haz clic en **`COBRAR`**.
2. Selecciona el **Método de Pago**:
   - 💵 **Efectivo**
   - 💳 **Tarjeta de Débito**
   - 💳 **Tarjeta de Crédito**
   - 📲 **Mercado Pago / Transferencia**
3. **Billetes Rápidos en Efectivo**: Toca los botones de billetes (`$1.000`, `$2.000`, `$5.000`, `$10.000`, `$20.000`, `$50.000` o `Exacto`) y el sistema calcula inmediatamente el **Vuelto a entregar**.

---

## 4. Módulo Impresión de Ticket Térmico (58mm / 80mm)

Al finalizar la venta, el sistema genera la plantilla de ticket térmico profesional:

- **Ancho Seleccionable**:
  - **`58mm (Mini)`**: Para tickoteras portátiles Bluetooth o de comanda.
  - **`80mm (Estándar)`**: Para tickoteras fijas de escritorio USB/Red.
- **Tipo de Comprobante**:
  - **`Control Interno (No Fiscal)`**: Lleva la leyenda legal `Comprobante de Control Interno / Documento No Válido como Factura`.
  - **`Vista AFIP (Factura C)`**: Muestra la estructura preparada con CAE, vencimiento e información impositiva.
- **Impresión Limpia**: Al presionar **`Imprimir Ticket`**, abre una ventana aislada que envía únicamente la tira de papel sin imprimir la web de fondo.

---

## 5. Módulo Productos, Precios & Importación desde Excel

La pantalla de **Productos & Precios** administra el catálogo general:

- **📥 Importación Masiva desde Excel / CSV**:
  - Descarga la **Plantilla de Ejemplo (.csv)**.
  - Pega o sube la lista de 500 productos de tu cliente y en 30 segundos se crean las categorías, precios de costo, venta y stock inicial.
- **📤 Exportar Catálogo**: Descarga todo tu inventario en un archivo `.csv`.
- **✏️ Edición de Precios & Estado**: Cambia precios de venta o activa/desactiva productos (los inactivos se ocultan del POS y del dashboard).
- **📉 Baja por Merma / Vencimiento**: Registra reducciones de stock indicando el motivo (*Mercadería Vencida*, *Devolución a Proveedor*, *Rotura / Falla de Frío*, *Consumo Interno*).

---

## 6. Módulo Turnos & Caja Diaria

La pantalla de **Turnos & Caja** controla el dinero físico en efectivo:

1. **Apertura de Turno**: Iniciar la jornada ingresando el dinero de cambio inicial (ej: `$10.000`).
2. **Egresos / Retiros de Caja**: Registrar salidas de dinero para pago a proveedores o gastos menores con su concepto descriptivo.
3. **Cierre de Turno & Arqueo**:
   - Al finalizar el turno, el cajero o encargado cuenta el dinero físico de la caja.
   - El sistema compara el **Efectivo Esperado** (Apertura + Ventas Efectivo - Retiros) contra el **Dinero Contado**.
   - Calcula automáticamente si hay **Sobrante** o **Faltante de caja**.

---

## 7. Módulo Compras, Lotes & Proveedores Frecuentes

La pantalla de **Compras & Lotes** gestiona el reabastecimiento:

- **Proveedores Frecuentes**: Alta de proveedores con CUIT, teléfono y dirección.
- **Carga Rápida de Lotes (`+ Cargar Lote`)**:
  - Permite ingresar compras masivas indicando fecha de vencimiento del lote y costo unitario.
- **Escáner de Productos Integrado**: Incluye buscador con lectora de barras dentro de la ventana de compras para ingresar ítems al lote escaneando el empaque.

---

## 8. Módulo Reportes & Métricas de Ganancia

La pantalla de **Reportes & Métricas** brinda inteligencia de negocios:

- **Desglose de Métodos de Pago**:
  - Visualización en barras y porcentajes independientes para **Efectivo**, **Tarjeta de Débito**, **Tarjeta de Crédito** y **Mercado Pago / Transferencia**.
- **Ganancia Bruta Acumulada**: Cálculo real de `Ventas Totales - Costo de Productos`.
- **Top Productos Más Vendidos**: Ranking de artículos con mayor salida en el local.

---

## 9. Centro de Notificaciones Inteligentes por Rol

Al hacer clic en el icono de la **Campanita (🔔)** en la barra superior, el sistema consulta en tiempo real las alertas según el rol del usuario logueado:

| Tipo de Alerta | Icono | Destinatarios | Descripción |
| :--- | :---: | :--- | :--- |
| **⚠️ Stock Mínimo** | ⚠️ | Admin, Encargado, Cajero | Aviso de productos por agotarse (`stock <= minStock`). |
| **⏳ Lotes a Vencer** | ⏳ | Admin, Encargado, Cajero | Aviso de lotes que vencen en los próximos 30 días. |
| **⏰ Recordatorio de Arqueo** | ⏰ | Admin, Encargado, Cajero | Alerta si la caja lleva más de 8 horas abierta. |
| **💸 Retiros de Caja** | 💸 | **Solo ADMINISTRADOR** | Registro de salidas de dinero para proveedores. |
| **🏆 Hito de Facturación** | 🏆 | **Solo ADMINISTRADOR** | Alerta al superar metas diarias de ventas. |

---

### 🚀 Listo para Usar & Demostraciones
Este manual sirve como documento oficial de capacitación para el personal de tus clientes o para presentar **ProtoStock** en demostraciones comerciales.
