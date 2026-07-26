# 📋 Guía de Prueba Piloto (Paso 1) - ProtoStock POS

Guía práctica para implementar la prueba piloto de 14 días en comercios reales (fiambrerías, almacenes, kioscos).

---

## 🎯 Objetivo de la Prueba Piloto
Validar el sistema en condiciones reales de trabajo continuo en mostrador con cajeros y dueños de negocio.

---

## 📝 Checklist de Preparación antes de la Instalación

1. **Catálogo de Productos del Cliente**:
   - Descargar la plantilla CSV en la sección **[Productos & Precios](file:///d:/ProtoStock/src/app/productos/page.tsx)** (`plantilla_importacion_protostock.csv`).
   - Cargar los productos del comercio con su precio de costo, precio de venta, stock inicial y si se vende por Kilo (`KG`) o por `UNIDAD`.
   - Presionar el botón **"Importar Excel"** para cargar los 100 a 1000 productos del local en 30 segundos.

2. **Configuración de Usuarios & Roles**:
   - Crear el usuario para el dueño del local (Rol `ADMIN` o `ENCARGADO`).
   - Crear los usuarios para los cajeros de turno (Rol `CAJERO`).

3. **Verificación de Hardware en Mostrador**:
   - **Tablet / PC**: Conectar a la red Wi-Fi del comercio y abrir la URL de producción (`https://proto-stock.vercel.app`).
   - **Lector de Código de Barras**: Probar escaneo de productos de almacén/bebidas en el POS.
   - **Balanza (en fiambrería)**: Verificar uso de los accesos directos de gramaje (`+100g`, `+150g`, `+250g`, `+500g`).

---

## 🧪 Tareas de Seguimiento durante los 14 Días

- **Día 1**: Capacitación de 15 minutos al personal sobre apertura de caja, cobro en POS y cierre de turno.
- **Día 3**: Revisar arqueo de caja (efectivo contado vs esperado) y aclaración de dudas.
- **Día 7**: Evaluación intermedia de ventas, métricas por método de pago y productos más vendidos.
- **Día 14**: Reunión de cierre con el dueño, revisión de la ganancia bruta acumulada y propuesta del plan de suscripción mensual.
