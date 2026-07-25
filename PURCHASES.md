# PURCHASES.md

## 1. Propósito del documento

Este documento define cómo debe funcionar el módulo de compras del sistema de gestión para una fiambrería y almacén.

Su objetivo es dejar claramente establecido:

- cómo se registra una compra,
- qué datos debe guardar,
- cómo impacta en stock y costos,
- cómo se relaciona con proveedores,
- cómo se controlan comprobantes, lotes y vencimientos,
- qué validaciones debe respetar,
- qué permisos se necesitan,
- y qué comportamiento debe seguir el software en cada caso.

Si existe contradicción entre una implementación y este documento, este documento tiene prioridad.

---

## 2. Objetivo del módulo de compras

El módulo de compras debe permitir registrar el ingreso de mercadería al local de forma ordenada, trazable y confiable.

Debe servir para:

- actualizar stock,
- controlar costos,
- registrar proveedores,
- guardar historial de compras,
- controlar productos con vencimiento,
- asociar lotes,
- revisar precios de reposición,
- y alimentar reportes de rentabilidad y abastecimiento.

Una compra bien registrada evita errores en stock, caja, márgenes y reportes.

---

## 3. Principios del módulo

1. Toda compra debe poder rastrearse.
2. Todo ingreso de mercadería debe impactar stock.
3. Todo costo debe quedar registrado.
4. Todo proveedor debe ser identificable.
5. Toda modificación importante debe quedar auditada.
6. Las compras confirmadas no deben perderse.
7. Los productos vencibles deben registrar vencimiento cuando corresponda.
8. Los lotes deben mantenerse vinculados al ingreso de mercadería.
9. Los descuentos, recargos e impuestos deben ser claros.
10. El sistema debe priorizar control y trazabilidad por encima de la simple carga rápida.

---

## 4. Alcance del módulo

### Incluye

- alta de compras,
- edición en borrador,
- confirmación de compras,
- anulación,
- asociación con proveedor,
- detalle de productos comprados,
- ingreso de stock,
- carga de costos,
- control de vencimientos,
- control de lotes,
- descuentos y recargos,
- impuestos si se usan,
- observaciones,
- auditoría,
- reportes de compras.

### No incluye por defecto

- orden de compra automática compleja,
- integración directa con proveedor externo,
- conciliación bancaria avanzada,
- facturación fiscal avanzada si no está definida en el proyecto,
- automatización de reposición sin validación humana.

Estas funciones pueden agregarse más adelante si el negocio lo necesita.

---

## 5. Definición de compra

Una compra es el registro formal del ingreso de mercadería al local desde un proveedor.

Una compra puede representar:

- mercadería comprada al por mayor,
- mercadería para reposición,
- mercadería vencible,
- productos de almacén,
- productos de fiambrería,
- insumos del local,
- o cualquier artículo que aumente el stock del negocio.

La compra debe reflejar tanto la parte comercial como la parte operativa del ingreso de mercadería.

---

## 6. Ciclo de vida de una compra

Una compra puede pasar por estos estados:

- borrador,
- confirmada,
- anulada,
- pendiente si se usa ese flujo,
- parcialmente recibida si el negocio lo implementa.

### Significado de cada estado

#### Borrador
La compra está en proceso de carga, pero todavía no impactó stock ni contabilidad operativa.

#### Confirmada
La compra fue cerrada y debe impactar stock, costos y trazabilidad.

#### Anulada
La compra no debe considerarse válida operativamente. Debe revertir los efectos que corresponda.

#### Pendiente
La compra fue registrada pero todavía no finalizó su recepción o validación completa.

#### Parcialmente recibida
Solo una parte de la compra fue ingresada o aceptada, si el modelo lo admite.

---

## 7. Flujo general de compra

El flujo básico del módulo debe ser el siguiente:

1. El usuario abre el módulo de compras.
2. Selecciona un proveedor.
3. Carga o busca productos.
4. Ingresa cantidades, costos y datos complementarios.
5. Agrega vencimientos o lotes si corresponde.
6. Revisa subtotales y totales.
7. Confirma la operación.
8. El sistema guarda la compra.
9. Se actualiza el stock.
10. Se registra el costo histórico.
11. Se deja auditoría de la operación.
12. Se genera comprobante o registro interno.

---

## 8. Datos mínimos de una compra

Toda compra debe guardar, como mínimo:

- identificador único,
- proveedor,
- fecha y hora,
- usuario que la cargó,
- estado,
- detalle de productos,
- cantidad por producto,
- costo unitario,
- subtotal,
- descuentos,
- impuestos si aplica,
- total final,
- observaciones,
- comprobante si existe,
- referencia a lotes y vencimientos si corresponde,
- auditoría asociada.

---

## 9. Relación con proveedores

### 9.1 Proveedor obligatorio o opcional

El sistema debe permitir definir si el proveedor es obligatorio en cada compra.  
En un negocio ordenado, lo recomendable es que sí lo sea.

### 9.2 Reglas

- Toda compra debería poder asociarse a un proveedor.
- Un proveedor puede tener historial de compras.
- El proveedor no debe perder su relación histórica aunque luego se inhabilite.
- El sistema debe poder identificar al proveedor principal de un producto si se usa esa regla.

### 9.3 Datos de referencia del proveedor

Es útil guardar:

- razón social,
- nombre comercial,
- contacto,
- teléfono,
- email,
- dirección,
- condición fiscal,
- observaciones.

---

## 10. Detalle de productos comprados

Cada compra debe incluir uno o más ítems.

### Cada ítem debe guardar

- producto,
- cantidad,
- costo unitario,
- subtotal,
- descuento si aplica,
- lote si corresponde,
- vencimiento si corresponde,
- observaciones,
- referencia a presentación o unidad de medida.

### Reglas

- Una compra sin detalle no debe confirmarse.
- Cada ítem debe ser validado antes de cerrar la compra.
- El costo unitario debe ser coherente con la unidad del producto.
- La cantidad debe respetar el tipo de producto.

---

## 11. Costos

### 11.1 Costo unitario
Es el valor al que se compró cada unidad, kilo, litro o fracción según corresponda.

### 11.2 Costo total
Es la suma de los costos de todos los ítems, menos descuentos y más impuestos o recargos si existen.

### 11.3 Reglas
- El costo no puede ser negativo.
- El costo debe quedar guardado con precisión.
- El sistema debe conservar el histórico de costos si se quiere análisis posterior.
- El costo comprado no debe sobrescribirse sin dejar rastros si ya hubo impacto operativo.

### 11.4 Uso del costo
El costo sirve para:

- calcular margen,
- estimar rentabilidad,
- comparar proveedores,
- actualizar precios,
- analizar variaciones de compra.

---

## 12. Descuentos, recargos e impuestos

### 12.1 Descuentos
Una compra puede tener descuento general o por ítem.

### 12.2 Recargos
Si el negocio lo usa, la compra puede incluir recargos.

### 12.3 Impuestos
El sistema puede contemplar impuestos si el proyecto los requiere.

### 12.4 Reglas
- Todo descuento debe quedar visible.
- Todo recargo debe quedar visible.
- Todo impuesto debe ser claro y trazable.
- El total final debe poder reconstruirse desde el detalle.

---

## 13. Impacto en stock

Toda compra confirmada debe aumentar stock.

### Reglas

- Si la compra está en borrador, no debe impactar stock.
- Si la compra se confirma, el stock debe actualizarse inmediatamente.
- Si la compra se anula, el sistema debe revertir el stock si ya se había impactado.
- El cambio de stock debe quedar registrado en el historial.

### Casos especiales

- Si el producto permite stock negativo por excepción, la compra puede corregir ese saldo.
- Si el producto es perecedero, el ingreso de stock debe asociarse a lote y vencimiento cuando corresponda.

---

## 14. Relación con lotes y vencimientos

### 14.1 Cuándo aplicar lote
Si el producto requiere lote, la compra debe registrar lote o referencia equivalente.

### 14.2 Cuándo aplicar vencimiento
Si el producto requiere vencimiento, la compra debe registrar fecha de vencimiento.

### 14.3 Reglas
- La compra no debe confirmarse sin vencimiento si el producto lo exige.
- El lote y el vencimiento deben poder consultarse luego.
- Los productos próximos a vencer deben poder identificarse desde la compra.
- La trazabilidad debe permitir saber de dónde salió cada mercadería.

---

## 15. Compra por peso, unidad o presentación

La compra debe respetar la unidad de medida del producto.

### Ejemplos

- unidades,
- kilos,
- gramos,
- litros,
- cajas,
- packs,
- fracciones.

### Reglas

- No mezclar unidades sin conversión definida.
- No permitir cantidades incoherentes con el tipo de producto.
- El costo debe calcularse según la unidad correcta.

---

## 16. Edición de compras

### 16.1 Compra en borrador
Una compra en borrador puede editarse libremente mientras no impacte stock ni cierres.

### 16.2 Compra confirmada
Una compra confirmada puede permitir edición solo si el negocio lo autoriza y siempre con trazabilidad.

### 16.3 Reglas
- Toda edición importante debe quedar auditada.
- Si una compra ya impactó stock, la edición debe recalcular el efecto correspondiente.
- No deben perderse los datos originales.
- Los cambios deben ser reversibles o al menos auditables.

---

## 17. Anulación de compras

### 17.1 Objetivo
Permitir corregir compras cargadas por error sin borrar el historial.

### 17.2 Reglas
- Una compra anulada no debe desaparecer.
- Debe quedar visible en el historial.
- Debe registrar quién la anuló, cuándo y por qué.
- Debe revertir el stock si ya había impactado.
- Debe revertir el costo histórico si corresponde según la lógica del negocio.

### 17.3 Restricciones
- No todos los usuarios deben poder anular compras.
- La anulación puede requerir motivo obligatorio.
- El sistema puede exigir confirmación adicional.

---

## 18. Recepción parcial

Si el negocio trabaja con recepción parcial, el sistema puede permitir que una compra quede parcialmente ingresada.

### Reglas

- Debe distinguirse lo recibido de lo pendiente.
- El stock solo debe actualizarse sobre lo efectivamente recibido.
- Debe quedar claro qué falta recibir.
- El estado de la compra debe reflejar el avance real.

---

## 19. Compras y precios de venta

El módulo de compras no solo ingresa mercadería, también ayuda a decidir el precio de venta.

### Reglas

- El sistema puede sugerir precios en función del costo.
- El negocio puede definir un margen objetivo.
- Se pueden mantener históricos para análisis posterior.
- Los cambios de costo pueden activar revisión de precios de venta.

### Importante
La actualización automática de precios de venta debe ser opcional y validada por el negocio, no una obligación.

---

## 20. Datos históricos que deben conservarse

La compra debe dejar historial de:

- proveedor,
- fecha,
- productos,
- cantidades,
- costos,
- lotes,
- vencimientos,
- descuentos,
- impuestos,
- usuario que cargó la operación,
- cambios posteriores,
- anulaciones.

La trazabilidad histórica es fundamental para análisis de rentabilidad y control interno.

---

## 21. Permisos asociados al módulo de compras

No todos los usuarios deben poder hacer lo mismo.

### Permisos posibles
- crear compra,
- editar compra en borrador,
- confirmar compra,
- anular compra,
- ver historial de compras,
- ver costos,
- editar costos,
- registrar lotes y vencimientos,
- importar compras,
- exportar compras.

### Reglas
- Las acciones sensibles deben estar restringidas.
- El administrador o encargado puede tener permisos ampliados.
- El área de compras puede tener acceso limitado a su función.

---

## 22. Validaciones obligatorias

Antes de confirmar una compra, el sistema debe validar como mínimo:

- que exista proveedor si es obligatorio,
- que haya al menos un producto,
- que las cantidades sean válidas,
- que los costos no sean negativos,
- que los productos estén activos o al menos habilitados para compra,
- que los vencimientos estén completos si corresponde,
- que el lote esté definido si corresponde,
- que el total sea coherente,
- que el usuario tenga permisos,
- que el estado de la compra permita confirmar.

---

## 23. Errores y casos de excepción

El sistema debe manejar correctamente estos casos:

- proveedor inexistente o inactivo,
- producto inactivo,
- costo inválido,
- cantidad inválida,
- vencimiento faltante,
- lote faltante,
- compra duplicada,
- compra ya confirmada,
- compra ya anulada,
- error de guardado o de sincronización.

En todos los casos debe mostrarse un mensaje claro y no perderse la operación en curso.

---

## 24. Reportes derivados de compras

El módulo de compras debe alimentar reportes como:

- compras por fecha,
- compras por proveedor,
- compras por producto,
- compras por categoría,
- compras con mayor costo,
- compras con mayores variaciones,
- compras con vencimiento próximo,
- compras anuladas,
- compras pendientes,
- costo promedio por producto,
- variación de costos por período.

---

## 25. Relación con stock mínimo y reposición

Las compras son una herramienta clave para reponer stock.

### Reglas

- Si un producto está por debajo del mínimo, puede marcarse como prioritario de compra.
- El sistema puede ayudar a detectar qué productos deberían reponerse.
- Debe poder visualizarse qué mercadería se compra con más frecuencia.
- El negocio puede usar el histórico de compras para planificar reposición.

---

## 26. Importación de compras

El sistema puede permitir importar compras desde planillas o archivos si el negocio lo necesita.

### Reglas
- Debe validar productos existentes.
- Debe validar proveedores.
- Debe revisar unidades y costos.
- No debe duplicar una compra ya cargada.
- Debe generar errores claros para corrección manual.

---

## 27. Exportación de compras

El sistema debe poder exportar información de compras para análisis, control o respaldo.

### Posibles exportaciones
- listado completo,
- por rango de fechas,
- por proveedor,
- por producto,
- por estado,
- por vencimiento,
- por usuario.

---

## 28. Auditoría

Toda acción sensible sobre compras debe quedar registrada.

### Se audita especialmente:
- alta,
- edición,
- confirmación,
- anulación,
- cambios de costo,
- cambios de cantidades,
- cambios de proveedor,
- cambios en lotes,
- cambios en vencimientos.

### Datos mínimos
- usuario,
- fecha,
- hora,
- acción,
- campo modificado,
- valor anterior,
- valor nuevo,
- motivo si corresponde.

---

## 29. Reglas para IA al trabajar con compras

La IA que genere o modifique este módulo debe:

1. respetar el vínculo con stock,
2. no romper el vínculo con proveedores,
3. no ocultar costos ni descuentos,
4. no omitir auditoría,
5. no usar floats para importes,
6. no simplificar tanto que se pierda trazabilidad,
7. no inventar reglas de negocio no definidas,
8. no borrar historial operativo,
9. no desalinear la compra del stock real,
10. no convertir una compra en un objeto sin impacto funcional.

---

## 30. Criterios de aceptación

El módulo de compras se considera correcto si:

- permite registrar compras de forma ordenada,
- actualiza stock correctamente,
- conserva costos y trazabilidad,
- relaciona bien los proveedores,
- soporta lotes y vencimientos,
- permite anular o corregir sin perder historial,
- y ayuda al negocio a controlar reposición y rentabilidad.

---

## 31. Cierre

El módulo de compras es una pieza central del sistema, porque conecta proveedores, stock, costos y rentabilidad.

Si se diseña bien, el negocio gana control.  
Si se diseña mal, aparecen errores en stock, márgenes, vencimientos y reportes.

Por eso este módulo debe tratarse con especial cuidado.

**Fin del documento.**