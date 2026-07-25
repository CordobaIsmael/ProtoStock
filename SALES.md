# SALES.md

## 1. Propósito del documento

Este documento define cómo debe funcionar el módulo de ventas del sistema de gestión para una fiambrería y almacén.

Su objetivo es dejar claramente establecido:

- cómo se arma una venta,
- qué datos debe guardar,
- qué validaciones debe respetar,
- cómo impacta en stock y caja,
- cómo se manejan descuentos, devoluciones y anulaciones,
- qué permisos se necesitan,
- y qué comportamiento debe seguir el software en cada caso.

Si existe contradicción entre una implementación y este documento, este documento tiene prioridad.

---

## 2. Objetivo del módulo de ventas

El módulo de ventas debe permitir operar la caja del local de forma rápida, clara y confiable, sin perder control sobre:

- stock,
- precios,
- medios de pago,
- caja diaria,
- cliente,
- descuentos,
- historial de operaciones,
- y trazabilidad de cada movimiento.

La venta debe ser veloz para el cajero, pero también precisa para el control del negocio.

---

## 3. Principios del módulo

1. La carga de una venta debe ser rápida.
2. Toda venta confirmada debe quedar registrada.
3. Toda venta debe impactar el stock.
4. Todo pago debe poder identificarse.
5. Toda anulación debe dejar historial.
6. Toda devolución debe evaluarse antes de reintegrar stock.
7. Toda venta debe quedar asociada al usuario que la realizó.
8. Los descuentos deben ser visibles y auditables.
9. La caja debe reflejar correctamente el resultado de la venta.
10. El sistema debe priorizar la operación real del local.

---

## 4. Alcance del módulo

### Incluye

- creación de ventas,
- búsqueda de productos,
- carga rápida de ítems,
- cálculo automático de totales,
- aplicación de descuentos,
- selección de medio de pago,
- ventas mixtas,
- asociación con cliente si aplica,
- impresión o generación de comprobante,
- anulación,
- devolución,
- control de stock,
- impacto en caja,
- auditoría.

### No incluye por defecto

- venta online,
- carrito web público,
- delivery automatizado,
- pasarela de pago externa compleja,
- facturación fiscal avanzada si no está definida en el proyecto,
- pedidos programados.

Estas funciones pueden agregarse más adelante.

---

## 5. Ciclo de vida de una venta

Una venta puede pasar por estos estados:

- borrador,
- confirmada,
- anulada,
- devuelta,
- parcialmente devuelta si el modelo lo admite.

### Significado de cada estado

#### Borrador
La venta se está cargando, pero todavía no impactó stock ni caja.

#### Confirmada
La venta ya fue cerrada. Debe descontar stock y quedar registrada de forma definitiva.

#### Anulada
La venta no debe considerarse válida operativamente. Debe revertir los efectos que corresponda según la política del sistema.

#### Devuelta
Todo o parte de la venta fue devuelta. Puede implicar reintegro de stock, caja o ambos, según el caso.

---

## 6. Flujo general de venta

El flujo básico debe ser el siguiente:

1. El usuario abre el módulo de ventas.
2. Busca un producto por nombre, código interno o código de barras.
3. Agrega el producto al ticket.
4. Ingresa cantidad, peso o fracción según corresponda.
5. El sistema calcula subtotal y total.
6. Se aplican descuentos si existen.
7. Se selecciona el medio o medios de pago.
8. Se confirma la operación.
9. El sistema guarda la venta.
10. Se descuenta el stock.
11. Se registra el impacto en caja si corresponde.
12. Se genera comprobante o ticket.

---

## 7. Datos mínimos de una venta

Toda venta debe guardar, como mínimo:

- identificador único,
- fecha y hora,
- usuario que la realizó,
- cliente si aplica,
- estado,
- detalle de productos,
- cantidades,
- precios unitarios,
- descuentos,
- total bruto,
- total neto,
- medio de pago,
- observaciones,
- referencia a caja si aplica,
- auditoría asociada.

---

## 8. Búsqueda de productos en venta

La búsqueda de productos debe ser rápida y tolerante al uso diario.

Debe permitir buscar por:

- nombre,
- código interno,
- código de barras,
- categoría,
- marca,
- atajo rápido si se define.

### Reglas

- No debe obligar al usuario a navegar por múltiples pantallas para vender.
- Los productos más usados deberían poder encontrarse rápido.
- El sistema debe evitar confusiones entre productos con nombres parecidos.
- Si existen productos similares, debe mostrarse información suficiente para diferenciarlos.

---

## 9. Tipos de venta

El sistema debe contemplar distintos tipos de venta según el negocio.

### 9.1 Venta por unidad
Se carga una cantidad entera de unidades.

Ejemplo:
- 2 paquetes de galletitas,
- 1 botella de agua,
- 3 latas de conservas.

### 9.2 Venta por peso
Se carga un peso decimal o un valor medido.

Ejemplo:
- 0,250 kg de jamón,
- 0,180 kg de queso,
- 0,400 kg de salame.

### 9.3 Venta por fracción
Si el negocio trabaja con fracciones predefinidas, el sistema debe permitirlo.

Ejemplo:
- medio kg,
- cuarto kg,
- porciones específicas.

### 9.4 Venta mixta
Una misma venta puede incluir productos por unidad y por peso al mismo tiempo.

---

## 10. Reglas de cálculo

### 10.1 Subtotal por ítem
Cada ítem debe calcularse con la fórmula correspondiente según su modo de venta.

### 10.2 Total de la venta
El total general debe ser la suma de los subtotales menos descuentos más recargos si existieran.

### 10.3 Redondeo
Debe existir una regla clara para redondeos monetarios y, si corresponde, para pesos o fracciones.

### 10.4 Precisión
No se deben perder decimales importantes en productos por peso ni en importes de venta.

---

## 11. Descuentos

### 11.1 Tipos de descuentos

El sistema puede manejar, según configuración:

- descuento manual,
- descuento porcentual,
- descuento fijo,
- promoción automática,
- descuento por cantidad,
- descuento por producto,
- descuento por categoría,
- descuento por cliente,
- descuento por campaña.

### 11.2 Reglas

- Todo descuento debe quedar visible en el detalle de la venta.
- El descuento no debe ocultarse dentro del precio final sin trazabilidad.
- Los descuentos importantes deben registrar usuario y motivo.
- Si se aplican múltiples descuentos, debe definirse prioridad o combinación.

### 11.3 Validaciones

- Un descuento no puede dejar una venta en valores incoherentes.
- No se debe permitir un descuento que rompa las reglas del negocio sin autorización.
- Los descuentos pueden estar limitados por permisos.

---

## 12. Medios de pago

### 12.1 Medios posibles

- efectivo,
- débito,
- crédito,
- transferencia,
- QR,
- billetera virtual,
- cuenta corriente,
- pago mixto.

### 12.2 Reglas generales

- Toda venta debe registrar uno o más medios de pago.
- Si el pago es mixto, debe quedar el detalle de cada parte.
- El sistema debe distinguir lo que ingresa a caja física de lo que no.
- La suma de pagos debe coincidir con el total de la venta salvo redondeo o saldo pendiente autorizado.

### 12.3 Pago pendiente
Si el negocio lo permite, puede existir un saldo pendiente o cuenta corriente.  
En ese caso debe quedar:

- el monto pendiente,
- el cliente responsable,
- la fecha,
- y la autorización correspondiente.

---

## 13. Relación con la caja

La venta debe impactar en caja según el medio de pago.

### Impacto esperado

- efectivo: impacta caja física,
- tarjeta: impacta en registro financiero, no necesariamente en efectivo,
- transferencia: impacta como cobro no efectivo,
- QR: depende de la política del negocio,
- cuenta corriente: no ingresa a caja inmediata.

### Reglas

- La caja debe reflejar las ventas cobradas.
- Las ventas anuladas deben revertir el impacto correspondiente.
- El sistema debe poder resumir ventas por forma de cobro.

---

## 14. Relación con stock

Toda venta confirmada debe descontar stock.

### Reglas

- No debe confirmarse una venta si el stock no es suficiente, salvo autorización especial.
- El stock descontado debe quedar asociado al producto vendido.
- Si la venta se anula, debe evaluarse si el stock vuelve o no según el estado del producto y la política del negocio.
- Los productos por peso deben descontarse en la unidad de medida configurada.

### Casos especiales

- Si el negocio permite stock negativo, debe quedar auditado.
- Si una venta se carga en borrador, no debe descontar stock hasta confirmación.

---

## 15. Clientes en ventas

### 15.1 Cliente opcional
En una venta simple, el cliente puede ser opcional.

### 15.2 Cliente obligatorio
El cliente puede ser obligatorio cuando:

- la venta es a cuenta corriente,
- hay crédito,
- hay factura asociada,
- o el negocio lo exige.

### 15.3 Datos del cliente en la venta
Si se selecciona un cliente, la venta debe conservar esa relación para:

- historial,
- reportes,
- saldos,
- promociones,
- devoluciones,
- análisis comercial.

---

## 16. Comprobante de venta

Cada venta confirmada debe poder generar un comprobante o ticket.

### Debe incluir al menos:

- nombre del negocio,
- fecha,
- hora,
- número de venta,
- productos vendidos,
- cantidades,
- precios,
- descuentos,
- total,
- forma de pago,
- usuario,
- observaciones si aplica.

### Reglas

- El formato debe ser claro y legible.
- Debe poder imprimirse o exportarse según la configuración del sistema.
- No debe alterarse el contenido de la venta ya confirmada.

---

## 17. Anulación de ventas

### 17.1 Objetivo
Permitir corregir operaciones incorrectas sin perder trazabilidad.

### 17.2 Reglas

- Una venta anulada no debe desaparecer.
- Debe quedar visible en el historial.
- Debe registrar quién la anuló, cuándo y por qué.
- Debe revertir stock si ya impactó.
- Debe revertir caja si corresponde.

### 17.3 Restricciones

- No todos los usuarios deben poder anular ventas.
- La anulación puede requerir motivo obligatorio.
- El sistema puede exigir confirmación adicional.

---

## 18. Devoluciones

### 18.1 Objetivo
Permitir que el negocio registre devoluciones totales o parciales.

### 18.2 Reglas

- La devolución debe asociarse a una venta original.
- Debe registrarse el motivo.
- Debe evaluarse si el producto vuelve al stock.
- Si el producto no está apto para volver, debe ir a merma o pérdida.
- El impacto en caja debe evaluarse según la política comercial.

### 18.3 Tipos de devolución

- devolución total,
- devolución parcial,
- devolución con reintegro de stock,
- devolución sin reintegro por daño o vencimiento.

---

## 19. Productos por peso dentro de la venta

Los productos por peso son especialmente importantes en una fiambrería.

### Reglas

- Debe permitirse cargar peso decimal.
- Debe poder mostrarse el precio por kilo.
- El cálculo total debe ser automático.
- Debe registrarse el valor exacto usado en la operación.
- El producto debe venderse con la unidad correcta.

### Ejemplo de uso

- 0,325 kg de jamón cocido,
- 0,210 kg de queso,
- 0,480 kg de salame.

---

## 20. Promociones aplicadas en venta

### 20.1 Reglas
Las promociones aplicadas deben ser transparentes.

### 20.2 Debe poder verse:
- qué promoción se aplicó,
- a qué producto o categoría,
- cuánto descuento generó,
- y por qué se aplicó.

### 20.3 Prioridad
Si una venta tiene varias reglas posibles, el sistema debe definir una prioridad consistente.

---

## 21. Permisos asociados al módulo de ventas

No todos los usuarios deben poder hacer lo mismo.

### Permisos posibles
- crear venta,
- editar venta en borrador,
- confirmar venta,
- anular venta,
- devolver venta,
- aplicar descuentos,
- cobrar a cuenta corriente,
- ver historial,
- reimprimir comprobante.

### Reglas
- Las acciones sensibles deben estar restringidas.
- El administrador o encargado puede tener permisos ampliados.
- El cajero debe operar rápido, pero dentro de límites claros.

---

## 22. Validaciones obligatorias

Antes de confirmar una venta, el sistema debe validar como mínimo:

- que haya al menos un producto,
- que las cantidades sean válidas,
- que el precio no sea negativo,
- que el total sea coherente,
- que el stock alcance si la política lo exige,
- que el estado de los productos permita venderlos,
- que el usuario tenga permisos,
- que la caja o turno estén habilitados si corresponde.

---

## 23. Errores y casos de excepción

El sistema debe manejar correctamente estos casos:

- producto sin stock suficiente,
- producto inactivo,
- producto vencido,
- descuento no permitido,
- medio de pago inválido,
- venta duplicada,
- caja cerrada,
- usuario sin permiso,
- error de red o de guardado.

En todos los casos debe mostrarse un mensaje claro y no perderse la operación en curso.

---

## 24. Reportes derivados de ventas

El módulo de ventas debe alimentar reportes como:

- ventas por día,
- ventas por mes,
- ventas por usuario,
- ventas por medio de pago,
- ventas por categoría,
- ventas por producto,
- ticket promedio,
- productos más vendidos,
- horas pico,
- devoluciones,
- anulaciones,
- descuentos aplicados.

---

## 25. Historial de ventas

El sistema debe permitir consultar ventas anteriores por:

- fecha,
- número de venta,
- usuario,
- cliente,
- producto,
- medio de pago,
- estado.

### Reglas
- El historial debe ser confiable.
- Las ventas anuladas deben seguir apareciendo.
- Las devoluciones deben poder rastrearse.

---

## 26. Reglas de auditoría

Toda venta debe dejar trazabilidad de:

- usuario,
- fecha,
- hora,
- productos,
- importes,
- descuentos,
- medio de pago,
- anulaciones,
- devoluciones,
- reimpresiones o ediciones si existieran.

---

## 27. Reglas para IA al trabajar con ventas

Cuando una IA genere o modifique código de este módulo debe:

1. respetar el flujo real de caja,
2. no romper el impacto en stock,
3. no ocultar descuentos,
4. no omitir auditoría,
5. no simplificar tanto que se pierda trazabilidad,
6. no permitir estados inválidos,
7. no asumir reglas no definidas.

---

## 28. Criterios de aceptación

El módulo de ventas se considera correcto si:

- permite vender rápido,
- registra todo de forma clara,
- descuenta stock correctamente,
- impacta caja adecuadamente,
- conserva historial,
- maneja devoluciones y anulaciones,
- y no genera inconsistencias entre venta, stock y dinero.

---

## 29. Cierre

El módulo de ventas es uno de los más críticos del sistema porque conecta operación, stock y caja.

Su diseño debe priorizar:

- velocidad,
- claridad,
- trazabilidad,
- y confiabilidad.

**Fin del documento.**