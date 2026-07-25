# BUSINESS_RULES.md

## 1. Propósito del documento

Este documento define las reglas de negocio del sistema para una fiambrería y almacén.  
Su objetivo es dejar por escrito cómo funciona el comercio, qué se permite, qué no se permite, qué debe registrarse y qué comportamiento debe respetar el software en cada módulo.

Estas reglas son la base para:

- desarrollo funcional,
- validación de datos,
- diseño de pantallas,
- flujos operativos,
- auditoría,
- automatizaciones,
- y decisiones asistidas por IA.

Si existe contradicción entre una implementación y este documento, este documento tiene prioridad.

---

## 2. Principios generales del negocio

1. El sistema debe adaptarse al negocio real y no al revés.
2. Toda operación importante debe quedar registrada.
3. Ningún dato crítico debe perderse sin dejar historial.
4. El stock debe ser confiable y consistente.
5. La caja debe reflejar la realidad operativa del local.
6. Los precios deben ser claros y trazables.
7. Los productos perecederos deben tener control de vencimiento cuando corresponda.
8. El sistema debe priorizar rapidez operativa en venta y control interno en gestión.
9. Las acciones sensibles deben estar limitadas por permisos.
10. Toda modificación importante debe poder auditase.

---

## 3. Alcance del negocio

El local comercializa principalmente fiambres, pero también vende productos de almacén y otras categorías de consumo diario.

El sistema debe contemplar productos tales como:

- fiambres,
- quesos,
- embutidos,
- lácteos,
- bebidas,
- almacén,
- panificados,
- snacks,
- golosinas,
- conservas,
- congelados,
- limpieza,
- perfumería,
- y otros artículos similares.

---

## 4. Reglas sobre productos

### 4.1 Identificación del producto

Cada producto debe tener una identidad única dentro del sistema.

Debe existir al menos uno de estos identificadores:

- código interno,
- código de barras,
- nombre normalizado,
- o combinación de atributos que evite duplicados.

No deben existir dos productos activos que representen el mismo artículo sin una justificación explícita.

### 4.2 Estado del producto

Un producto puede estar en uno de estos estados:

- activo,
- inactivo,
- suspendido,
- eliminado lógicamente.

Un producto inactivo:

- no debe poder venderse,
- no debe poder comprarse como producto principal salvo excepción manual,
- debe permanecer en historial,
- no debe borrarse físicamente si ya tuvo movimientos.

### 4.3 Tipos de venta

Un producto puede venderse:

- por unidad,
- por kilo,
- por gramo,
- por litro,
- por paquete,
- por caja,
- por fracción,
- o por cualquier otra unidad definida por configuración.

El sistema debe permitir distinguir si el producto se vende:

- con cantidad entera,
- con peso decimal,
- con múltiplos,
- o con redondeo especial.

### 4.4 Productos por peso

Cuando un producto se vende por peso:

- el sistema debe registrar el peso real,
- debe calcular el total automáticamente,
- debe permitir redondeos configurables,
- debe mostrar claramente el precio por unidad de medida.

Para productos por peso, la precisión del valor es importante y no debe perderse por errores de formato.

### 4.5 Productos perecederos

Los productos perecederos deben poder controlar:

- fecha de ingreso,
- fecha de vencimiento,
- lote,
- proveedor,
- cantidad asociada.

Si el producto tiene vencimiento obligatorio, el sistema debe exigir ese dato en compras e inventario.

### 4.6 Productos con lote

Si el negocio decide trabajar por lote:

- cada lote debe ser identificable,
- debe asociarse a una compra o ingreso,
- debe tener trazabilidad,
- y debe poder seguirse en ventas, devoluciones y mermas si aplica.

### 4.7 Duplicados y variantes

El sistema debe evitar duplicados accidentales.

Se aceptan variantes solo cuando exista diferencia real, por ejemplo:

- mismo producto en distinto formato,
- mismo producto en distinta presentación,
- mismo producto por peso y por unidad,
- mismo producto con distinta marca.

Debe mantenerse una convención clara para no duplicar lo que es igual.

---

## 5. Reglas sobre categorías y subcategorías

1. Todo producto debe pertenecer a una categoría.
2. Una subcategoría es opcional, pero recomendada para ordenar mejor el catálogo.
3. Las categorías deben poder modificarse sin romper la trazabilidad de los productos ya cargados.
4. El cambio de categoría no debe borrar el historial del producto.
5. Un producto mal categorizado debe poder corregirse.
6. Las categorías deben ser simples, claras y útiles para operación diaria y reportes.

Ejemplos de categorías válidas:

- Fiambres,
- Quesos,
- Embutidos,
- Almacén,
- Bebidas,
- Congelados,
- Lácteos,
- Limpieza,
- Perfumería,
- Snacks,
- Golosinas,
- Conservas,
- Panificados.

---

## 6. Reglas sobre precios

### 6.1 Tipos de precio

El sistema puede manejar, según la configuración del negocio:

- precio de compra,
- precio de venta,
- precio mayorista,
- precio promocional,
- precio por lista,
- precio especial por cliente,
- precio con descuento,
- precio por combo.

### 6.2 Regla de trazabilidad

Cada cambio de precio debe quedar registrado con:

- fecha,
- usuario,
- valor anterior,
- valor nuevo,
- motivo si existe.

### 6.3 Reglas de actualización

El sistema debe permitir:

- actualizar un precio manualmente,
- actualizar por porcentaje,
- actualizar por costo,
- actualizar por lista externa,
- actualizar por categoría,
- actualizar por proveedor si se define.

### 6.4 Reglas de consistencia

- No se deben guardar precios vacíos en productos activos.
- El precio de venta no debe ser negativo.
- El precio de compra tampoco debe ser negativo.
- Los valores monetarios deben conservar precisión suficiente para evitar redondeos erróneos.
- El sistema debe mostrar de forma clara la moneda utilizada.

---

## 7. Reglas sobre stock

### 7.1 Principio general

El stock debe ser un reflejo confiable del inventario real del negocio.

### 7.2 Movimientos válidos de stock

Son movimientos válidos:

- compra,
- venta,
- devolución,
- ajuste positivo,
- ajuste negativo,
- merma,
- vencimiento,
- inventario físico,
- corrección autorizada.

### 7.3 Reglas fundamentales

1. Toda compra aumenta stock.
2. Toda venta disminuye stock.
3. Toda devolución puede aumentar stock, si el producto vuelve a estar apto.
4. Toda merma disminuye stock.
5. Todo ajuste debe registrar motivo.
6. Todo movimiento debe registrar usuario, fecha y hora.
7. No debe ocultarse el historial de stock.

### 7.4 Stock negativo

Por defecto, no debe permitirse stock negativo.

Solo puede permitirse si:

- el negocio lo autoriza expresamente,
- el rol del usuario lo permite,
- y el sistema guarda la justificación.

### 7.5 Stock mínimo

Cada producto puede tener un stock mínimo.

Cuando el stock actual llegue al mínimo o por debajo:

- el sistema debe poder alertar,
- el dashboard puede marcarlo,
- el reporte debe destacarlo.

### 7.6 Inventario físico

El inventario físico debe comparar:

- stock teórico,
- stock contado,
- diferencia,
- causa,
- usuario responsable.

Toda diferencia entre stock teórico y real debe quedar registrada.

---

## 8. Reglas sobre compras

### 8.1 Registro de compra

Cada compra debe poder registrar:

- proveedor,
- fecha,
- comprobante,
- productos,
- cantidades,
- costo unitario,
- total,
- impuestos si aplica,
- observaciones.

### 8.2 Impacto en stock

Una compra confirmada debe aumentar el stock correspondiente.

No debe actualizar stock si la compra quedó en estado borrador, salvo que el negocio defina lo contrario.

### 8.3 Trazabilidad

Cada compra debe quedar asociada a:

- proveedor,
- usuario que la cargó,
- fecha y hora,
- ítems comprados,
- costo histórico.

### 8.4 Edición de compras

Si una compra ya fue confirmada y luego editada:

- debe quedar registrado el cambio,
- debe recalcularse stock si corresponde,
- debe preservarse el histórico.

### 8.5 Eliminación de compras

No se recomienda eliminar compras con impacto de stock.

En su lugar se debe usar:

- anulación,
- baja lógica,
- o corrección auditada.

---

## 9. Reglas sobre ventas

### 9.1 Registro de venta

Cada venta debe registrar:

- fecha,
- hora,
- usuario,
- productos vendidos,
- cantidades,
- precios,
- descuentos,
- medios de pago,
- total final,
- estado de la operación.

### 9.2 Impacto en stock

Toda venta confirmada debe descontar stock inmediatamente.

### 9.3 Medios de pago

El sistema debe contemplar al menos:

- efectivo,
- tarjeta de débito,
- tarjeta de crédito,
- transferencia,
- QR,
- cuenta corriente,
- pago mixto.

### 9.4 Ventas mixtas

Una venta puede dividirse en más de un medio de pago.

El sistema debe guardar el detalle de cada parte del pago.

### 9.5 Anulación de ventas

Una venta anulada debe:

- quedar registrada como anulada,
- no desaparecer del historial,
- revertir stock si corresponde,
- revertir caja si aplica,
- registrar usuario y motivo.

### 9.6 Devoluciones

Una devolución debe evaluar si el producto vuelve o no al stock.

Si el producto se devuelve en condiciones aptas, el stock puede reingresar.  
Si no está apto, debe registrarse como merma o pérdida.

### 9.7 Descuentos

Todo descuento debe poder quedar visible en la operación.

Los descuentos pueden ser:

- manuales,
- promocionales,
- por cantidad,
- por cliente,
- por campaña.

Los descuentos importantes deben quedar auditados.

### 9.8 Rapidez operativa

La venta debe ser rápida.

El flujo de caja no debe exigir pasos innecesarios, pero sí debe mantener control y trazabilidad.

---

## 10. Reglas sobre caja

### 10.1 Apertura y cierre

La caja debe poder abrirse y cerrarse por:

- día,
- turno,
- usuario,
- o sucursal si existiera.

### 10.2 Registro de movimientos

La caja debe contemplar:

- ingresos por ventas,
- egresos por gastos,
- retiros de efectivo,
- ingresos manuales,
- ajustes,
- diferencias de cierre.

### 10.3 Cierre de caja

El cierre debe mostrar al menos:

- efectivo esperado,
- efectivo contado,
- diferencia,
- ventas por medio de pago,
- gastos del día,
- retiros,
- observaciones.

### 10.4 Diferencias de caja

Toda diferencia debe quedar registrada.

Debe poder identificarse:

- quién cerró,
- cuánto debería haber,
- cuánto había realmente,
- y por qué hubo diferencia si se conoce.

### 10.5 Inalterabilidad

Una caja cerrada no debería modificarse libremente.

Si se requiere una corrección, debe quedar auditoría.

---

## 11. Reglas sobre clientes

### 11.1 Tipos de cliente

El sistema puede manejar:

- cliente ocasional,
- cliente frecuente,
- cliente registrado,
- cliente con cuenta corriente,
- cliente mayorista si se habilita.

### 11.2 Datos mínimos

Si el negocio decide registrar clientes, se recomienda guardar:

- nombre o razón social,
- teléfono,
- email opcional,
- dirección opcional,
- observaciones,
- estado.

### 11.3 Cuenta corriente

Si se habilita cuenta corriente:

- debe quedar saldo pendiente,
- debe registrar cada movimiento,
- debe quedar claro quién autorizó la deuda,
- debe poder consultar historial.

### 11.4 Reglas de crédito

No todos los usuarios deben poder vender a cuenta corriente.

Debe existir control por permiso o por política comercial.

---

## 12. Reglas sobre proveedores

### 12.1 Datos mínimos del proveedor

Cada proveedor debe poder registrar:

- razón social,
- nombre comercial,
- teléfono,
- email,
- dirección,
- condición fiscal,
- observaciones,
- estado.

### 12.2 Compras asociadas

Toda compra debe poder asociarse a un proveedor.

### 12.3 Precio de referencia

El sistema puede guardar:

- último precio de compra,
- costo promedio,
- costo histórico,
- lista de precios del proveedor si se usa.

### 12.4 Historial

Debe poder consultarse el historial de compras por proveedor.

---

## 13. Reglas sobre promociones y ofertas

### 13.1 Tipos permitidos

Las promociones pueden ser:

- descuento porcentual,
- descuento fijo,
- precio promocional,
- 2x1,
- 3x2,
- combo,
- precio especial por categoría,
- oferta por cantidad.

### 13.2 Vigencia

Toda promoción debe tener:

- fecha de inicio,
- fecha de fin,
- estado activo/inactivo.

### 13.3 Prioridad

Si un producto tiene varios precios posibles:

- debe definirse qué precio prevalece,
- y el sistema debe aplicar la lógica de forma consistente.

### 13.4 Auditoría

Toda promoción aplicada debe quedar visible en la venta.

---

## 14. Reglas sobre vencimientos

### 14.1 Control obligatorio

Los productos que vencen deben poder configurarse con vencimiento obligatorio.

### 14.2 Alertas

El sistema debe detectar:

- productos próximos a vencer,
- productos vencidos,
- productos con rotación lenta que podrían vencer antes de salir.

### 14.3 Tratamiento de vencidos

Un producto vencido:

- no debería venderse,
- debe quedar marcado,
- puede pasar a merma o baja,
- debe conservar el registro histórico.

### 14.4 Trazabilidad

Cada salida por vencimiento debe registrar:

- fecha,
- usuario,
- cantidad,
- motivo,
- lote si aplica.

---

## 15. Reglas sobre mermas y pérdidas

### 15.1 Qué se considera merma

Se considera merma toda pérdida de mercadería por:

- rotura,
- vencimiento,
- manipulación,
- error,
- daño,
- devolución no recuperable.

### 15.2 Registro obligatorio

Toda merma debe quedar registrada con motivo.

### 15.3 Efecto en stock

La merma debe disminuir stock.

### 15.4 Reporte

El sistema debe poder mostrar pérdidas acumuladas por:

- producto,
- categoría,
- período,
- usuario,
- motivo.

---

## 16. Reglas sobre auditoría

### 16.1 Qué se audita

Se debe auditar, como mínimo:

- cambios de precio,
- cambios de stock,
- ventas,
- anulaciones,
- devoluciones,
- compras,
- cierres de caja,
- ajustes manuales,
- cambios de permisos,
- altas y bajas lógicas,
- ediciones sensibles.

### 16.2 Datos mínimos

Cada evento auditado debe incluir:

- usuario,
- fecha,
- hora,
- acción,
- entidad afectada,
- valor anterior,
- valor nuevo,
- motivo si aplica.

### 16.3 Inmutabilidad

Los registros de auditoría no deben editarse ni eliminarse libremente.

---

## 17. Reglas sobre permisos y roles

### 17.1 Principio de mínimo privilegio

Cada usuario debe tener solo los permisos necesarios para su trabajo.

### 17.2 Acciones sensibles

Acciones como estas deben poder restringirse:

- editar precios,
- anular ventas,
- borrar productos,
- ajustar stock,
- cerrar caja,
- eliminar compras,
- administrar usuarios,
- ver reportes financieros.

### 17.3 Superusuario

Debe existir al menos un rol de administración total, protegido y controlado.

---

## 18. Reglas sobre reportes

### 18.1 Reportes operativos

El sistema debe permitir ver:

- ventas del día,
- ventas del mes,
- stock actual,
- stock crítico,
- productos por vencer,
- compras recientes,
- caja diaria.

### 18.2 Reportes analíticos

El sistema debe permitir analizar:

- productos más vendidos,
- productos menos vendidos,
- categoría con más movimiento,
- ticket promedio,
- margen estimado,
- rotación de mercadería,
- comportamiento por horario.

### 18.3 Exportación

Los reportes deben poder exportarse en formatos útiles, según definición del proyecto.

---

## 19. Reglas sobre integridad de datos

1. No duplicar registros sin motivo.
2. No perder el historial de operaciones importantes.
3. No borrar movimientos de stock ni de caja sin auditoría.
4. No permitir estados inconsistentes.
5. No permitir relaciones rotas entre compra, stock y producto.
6. No permitir venta sin detalle.
7. No permitir caja cerrada sin resumen.
8. No permitir precios vacíos en productos activos.

---

## 20. Reglas sobre estados

Las entidades importantes deben manejar estados claros.

### Productos
- activo,
- inactivo.

### Ventas
- borrador,
- confirmada,
- anulada,
- devuelta.

### Compras
- borrador,
- confirmada,
- anulada.

### Caja
- abierta,
- cerrada,
- en revisión.

### Promociones
- activa,
- inactiva,
- vencida.

### Stock
- normal,
- bajo,
- crítico,
- negativo si se permite por excepción.

---

## 21. Reglas sobre edición y eliminación

### 21.1 Edición

Se puede editar información, pero no se debe perder trazabilidad.

### 21.2 Eliminación lógica

Los registros importantes deben eliminarse lógicamente, no físicamente.

### 21.3 Eliminación física

Solo debería aplicarse en casos técnicos especiales y nunca a movimientos históricos críticos.

---

## 22. Reglas sobre documentación y mantenimiento

1. Toda nueva regla de negocio debe documentarse.
2. Todo cambio importante debe reflejarse en este archivo o en uno relacionado.
3. Cuando el negocio cambie, el documento debe actualizarse.
4. La IA debe usar siempre la versión vigente como referencia.
5. Si una regla está incompleta, debe complementarse antes de programar lógica sensible.

---

## 23. Reglas específicas para trabajo asistido por IA

Este proyecto está pensado para ser desarrollado con IA de forma intensiva.

La IA debe:

- respetar estas reglas antes de proponer código,
- preguntar cuando una regla sea ambigua,
- no inventar procesos que el negocio no definió,
- priorizar consistencia,
- evitar contradicciones entre módulos,
- y conservar compatibilidad con decisiones previas.

La IA no debe asumir que una práctica estándar es válida si no encaja con el negocio real del local.

---

## 24. Casos especiales

### 24.1 Productos equivalentes
Si el negocio trabaja con equivalencias, deben definirse explícitamente para evitar errores de stock.

### 24.2 Productos fraccionados
Si un producto puede dividirse en unidades menores, el sistema debe controlar correctamente la conversión.

### 24.3 Cambios de formato
Si un producto cambia de presentación, debe registrarse como variante o nuevo producto según corresponda.

### 24.4 Correciones manuales
Las correcciones manuales de stock, precio o caja deben exigir motivo y usuario responsable.

---

## 25. Prioridades del negocio

Cuando haya conflicto entre facilidad de uso y control, la prioridad será:

1. no perder datos,
2. mantener stock confiable,
3. mantener caja confiable,
4. conservar auditoría,
5. luego optimizar velocidad,
6. y finalmente mejorar estética o comodidad.

---

## 26. Criterio de aceptación

Una funcionalidad se considera correcta si:

- respeta las reglas de negocio,
- no rompe datos existentes,
- deja historial,
- permite operar el local sin fricciones,
- y devuelve información útil y confiable.

---

## 27. Resumen ejecutivo

Este negocio necesita un sistema que controle:

- productos,
- stock,
- compras,
- ventas,
- caja,
- vencimientos,
- clientes,
- proveedores,
- promociones,
- reportes,
- y auditoría.

La base del éxito no es solo registrar operaciones, sino hacerlo de forma ordenada, trazable y consistente.

**Fin del documento.**