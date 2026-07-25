# PRODUCTS.md

## 1. Propósito del documento

Este documento define cómo debe modelarse, administrarse y usarse el catálogo de productos del sistema de gestión para una fiambrería y almacén.

Su objetivo es dejar claras las reglas sobre:

- alta y edición de productos,
- clasificación,
- precios,
- stock,
- unidades de medida,
- códigos,
- variantes,
- vencimientos,
- lotes,
- imágenes,
- estados,
- y trazabilidad.

Este documento debe usarse como referencia principal para el módulo de productos y para cualquier funcionalidad que dependa del catálogo.

---

## 2. Objetivo del módulo de productos

El módulo de productos debe centralizar toda la información del catálogo comercial del negocio.

Debe servir para:

- vender correctamente,
- comprar correctamente,
- controlar stock,
- generar reportes,
- ordenar categorías,
- aplicar promociones,
- controlar vencimientos,
- y mantener coherencia entre operación y catálogo.

Un producto bien definido evita errores en ventas, compras, inventario y reportes.

---

## 3. Principios del módulo

1. Cada producto debe estar claramente identificado.
2. No deben existir duplicados innecesarios.
3. El catálogo debe ser fácil de buscar.
4. Los productos activos deben tener información suficiente.
5. Los productos perecederos deben poder controlarse.
6. Los productos por peso deben manejarse con precisión.
7. Los cambios sensibles deben quedar auditados.
8. El catálogo debe ser simple de usar en caja.
9. El sistema debe distinguir producto, variante y presentación.
10. La estructura debe crecer sin desorden.

---

## 4. Alcance del módulo

### Incluye

- alta de productos,
- edición,
- baja lógica,
- búsqueda,
- listado,
- categorización,
- códigos internos y de barras,
- unidades de medida,
- tipos de venta,
- precios,
- stock mínimo,
- imágenes,
- marcas,
- control de lotes,
- control de vencimientos,
- variantes si se usan,
- historial de cambios.

### No incluye por defecto

- compra automática,
- predicción de demanda,
- catálogo público de e-commerce,
- integración fiscal avanzada,
- automatización de precios con IA sin validación humana.

---

## 5. Definición de producto

Un producto es cualquier artículo comercializable dentro del local.

Puede tratarse de:

- un fiambre,
- un queso,
- un alimento de almacén,
- una bebida,
- un producto de limpieza,
- un snack,
- una golosina,
- o cualquier otro artículo que el local venda.

El sistema debe poder representar tanto productos simples como productos con variaciones o reglas especiales.

---

## 6. Clasificación del catálogo

### 6.1 Categorías
Los productos deben pertenecer a una categoría principal.

Ejemplos:

- Fiambres
- Quesos
- Embutidos
- Almacén
- Bebidas
- Lácteos
- Congelados
- Limpieza
- Perfumería
- Snacks
- Golosinas
- Conservas
- Panificados

### 6.2 Subcategorías
Las subcategorías son opcionales pero recomendables.

Ejemplos:

- jamones,
- salames,
- quesos blandos,
- quesos duros,
- galletitas dulces,
- galletitas saladas,
- bebidas sin alcohol,
- bebidas con gas,
- productos de higiene.

### 6.3 Reglas
- Todo producto activo debe pertenecer a una categoría.
- La subcategoría no debe romper el historial si cambia.
- La estructura debe mantenerse coherente para reportes y búsquedas.

---

## 7. Datos mínimos de un producto

Cada producto debe poder almacenar, como mínimo:

- identificador único,
- código interno,
- código de barras,
- nombre,
- descripción,
- marca,
- categoría,
- subcategoría,
- unidad de medida,
- tipo de venta,
- costo,
- precio de venta,
- stock actual,
- stock mínimo,
- proveedor principal si existe,
- estado,
- imagen opcional,
- observaciones,
- fechas de creación y modificación.

---

## 8. Identificación del producto

### 8.1 Código interno
Debe existir un código interno si el negocio lo necesita para operación rápida.

### 8.2 Código de barras
Si el producto tiene código de barras, debe poder buscarse por ese dato.

### 8.3 Nombre
El nombre debe ser claro, corto y entendible para el personal.

### 8.4 Reglas de unicidad
No deben existir productos activos duplicados sin motivo.

Debe evitarse especialmente:

- duplicar el mismo producto por error,
- crear nombres casi iguales para la misma mercadería,
- cargar varios registros para una misma presentación sin necesidad.

---

## 9. Tipos de producto

El sistema debe reconocer distintos tipos de producto según el negocio.

### 9.1 Producto por unidad
Se vende una cantidad entera de unidades.

Ejemplos:
- botella,
- paquete,
- lata,
- unidad individual.

### 9.2 Producto por peso
Se vende por peso decimal o fraccionado.

Ejemplos:
- 0,250 kg de jamón,
- 0,180 kg de queso,
- 0,500 kg de salame.

### 9.3 Producto por volumen
Puede aplicarse a bebidas u otros artículos según la configuración.

### 9.4 Producto fraccionado
Se vende en fracciones definidas por el negocio.

### 9.5 Producto por caja o pack
Se administra como unidad de venta mayor.

### 9.6 Producto perecedero
Tiene vencimiento y/o lote.

### 9.7 Producto no perecedero
No necesita vencimiento, pero igual puede tener stock y precio.

---

## 10. Unidades de medida

El sistema debe contemplar al menos estas unidades:

- unidad,
- kilogramo,
- gramo,
- litro,
- mililitro,
- pack,
- caja,
- bandeja,
- fracción.

### Reglas
- Cada producto debe tener una unidad principal coherente.
- La unidad debe ser compatible con el tipo de venta.
- Los productos por peso deben usar una unidad de masa clara.
- El sistema debe evitar mezclar unidades sin conversión definida.

---

## 11. Formas de venta

### 11.1 Venta por unidad
Producto vendido por cantidad entera.

### 11.2 Venta por peso
Producto vendido por peso decimal.

### 11.3 Venta mixta
Producto que puede venderse de más de una forma, si el negocio lo permite.

### 11.4 Reglas
- La forma de venta debe quedar claramente definida.
- El sistema no debe permitir usar una forma incompatible con el producto.
- La forma de venta debe ser visible para el cajero y para compras/inventario.

---

## 12. Precio de los productos

### 12.1 Precio de compra
Costo al que el negocio compra el producto.

### 12.2 Precio de venta
Valor al que se vende al cliente.

### 12.3 Precio promocional
Valor temporal por oferta o promoción.

### 12.4 Precio mayorista o especial
Si el negocio lo usa, debe poder definirse como precio alternativo.

### 12.5 Reglas
- Los precios no deben ser negativos.
- El precio de venta debe ser visible en productos activos.
- Todo cambio de precio debe quedar auditado.
- El sistema debe conservar histórico de cambios si se define esa política.

---

## 13. Stock de productos

### 13.1 Stock actual
Cantidad disponible para vender o utilizar.

### 13.2 Stock mínimo
Cantidad que activa una alerta o señal de reposición.

### 13.3 Stock máximo
Opcional, útil para control interno.

### 13.4 Reglas
- El stock debe actualizarse por ventas, compras, ajustes y mermas.
- El stock actual debe ser confiable.
- El sistema debe mostrar alertas si el producto está bajo o crítico.
- Los movimientos de stock deben quedar registrados en historial.

---

## 14. Vencimientos y lotes

### 14.1 Productos con vencimiento
El sistema debe permitir marcar si el producto requiere vencimiento.

### 14.2 Productos con lote
Debe poder indicarse si el producto trabaja con lote.

### 14.3 Datos posibles
- número de lote,
- fecha de ingreso,
- fecha de vencimiento,
- proveedor de origen,
- cantidad asociada.

### 14.4 Reglas
- Si el producto requiere vencimiento, el sistema debe exigirlo en compras o ingresos.
- Si el producto requiere lote, el sistema debe exigirlo.
- Los productos vencidos deben poder identificarse y excluirse de venta si corresponde.
- Los productos próximos a vencer deben poder detectarse.

---

## 15. Marcas

El sistema debe permitir registrar marca cuando tenga sentido comercial.

### Reglas
- La marca puede ser opcional.
- Debe servir para búsquedas, reportes y orden del catálogo.
- No debe usarse como sustituto de la categoría.

---

## 16. Descripción y observaciones

### 16.1 Descripción
Sirve para aportar detalles útiles del producto.

### 16.2 Observaciones
Sirven para notas internas como:

- aclaraciones de uso,
- datos de proveedor,
- particularidades de venta,
- compatibilidad con balanza,
- o cualquier información operativa útil.

### Reglas
- La descripción no debe ser obligatoria salvo que el negocio lo defina.
- Las observaciones no deben afectar la lógica de venta.

---

## 17. Imagen del producto

### Objetivo
Facilitar identificación visual en búsquedas y pantallas.

### Reglas
- La imagen es opcional.
- El sistema debe soportar productos sin imagen.
- La imagen no debe ser requisito para operar.
- Debe poder actualizarse o reemplazarse sin perder el historial del producto.

---

## 18. Estado del producto

Cada producto debe poder tener estado.

### Estados sugeridos
- activo,
- inactivo,
- suspendido,
- eliminado lógicamente.

### Reglas
- Un producto activo puede usarse en ventas.
- Un producto inactivo no debe venderse.
- Un producto con historial no debe borrarse físicamente.
- El estado debe ser visible para usuarios autorizados.

---

## 19. Proveedor principal

Cada producto puede tener un proveedor principal o de referencia.

### Utilidad
- compras,
- reposición,
- historial,
- comparativa de precios,
- control operativo.

### Reglas
- El proveedor puede ser opcional.
- Si existe, debe poder actualizarse.
- Cambiar proveedor no debe borrar historial anterior.

---

## 20. Variantes de producto

En algunos casos, un producto puede tener variantes.

Ejemplos:
- misma familia con distinto gramaje,
- misma marca con distinto sabor,
- mismo producto con distinta presentación.

### Reglas
- Las variantes deben ser claramente diferenciables.
- No deben duplicar por error productos equivalentes.
- Debe definirse si la variante es producto independiente o submodelo, según el diseño del sistema.

---

## 21. Productos compuestos o combos

Si el negocio usa combos o packs, el sistema puede contemplarlo.

### Ejemplos
- combo de fiambres,
- combo de almacén,
- promoción de galletitas y bebida.

### Reglas
- Debe quedar claro si el combo descuenta stock de los componentes o si funciona como producto independiente.
- El modelo debe evitar confusiones en inventario.

---

## 22. Productos de uso interno

Puede haber productos que no se venden al público pero sí se usan internamente.

Ejemplos:
- insumos,
- bolsas,
- consumibles,
- etiquetas.

### Reglas
- Deben poder existir si el negocio los necesita.
- Debe diferenciarse claramente entre artículo vendible y artículo interno.

---

## 23. Búsqueda de productos

La búsqueda debe ser rápida y útil en el día a día.

Debe permitir buscar por:

- nombre,
- código interno,
- código de barras,
- categoría,
- marca,
- proveedor,
- estado.

### Reglas
- La búsqueda debe ser tolerante a nombres parecidos.
- Deben mostrarse datos suficientes para evitar errores.
- Los productos más usados deberían aparecer rápidamente.

---

## 24. Edición de productos

### 24.1 Qué se puede editar
- nombre,
- descripción,
- categoría,
- subcategoría,
- marca,
- precio,
- stock mínimo,
- proveedor,
- imagen,
- estado,
- observaciones.

### 24.2 Reglas
- Toda edición importante debe quedar auditada.
- Cambios en precio y stock deben registrarse especialmente.
- Cambiar el producto no debe borrar su historial.

---

## 25. Baja lógica

### Objetivo
Evitar la pérdida de información histórica.

### Reglas
- No se recomienda borrar productos físicamente.
- Debe usarse baja lógica o estado inactivo.
- Los productos con ventas o compras históricas deben conservarse siempre.

---

## 26. Importación y carga masiva

El sistema puede permitir importar productos desde planillas o archivos.

### Reglas
- Debe validar duplicados.
- Debe revisar campos obligatorios.
- Debe generar errores claros para corrección.
- No debe sobreescribir datos críticos sin confirmación.

---

## 27. Exportación de productos

El sistema debe poder exportar el catálogo para análisis, respaldo o revisión.

### Posibles exportaciones
- listado completo,
- por categoría,
- por proveedor,
- por stock mínimo,
- por vencimiento,
- por estado.

---

## 28. Reglas de auditoría

Toda acción sensible sobre productos debe quedar registrada.

### Se audita especialmente:
- alta,
- edición,
- cambio de precio,
- cambio de stock,
- cambio de estado,
- cambio de proveedor,
- baja lógica,
- importación masiva,
- actualización de imagen.

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

## 29. Reglas para IA al trabajar con productos

La IA que genere o modifique este módulo debe:

1. respetar el modelo de identificación,
2. no duplicar productos sin motivo,
3. no romper relaciones de categoría y stock,
4. no usar floats para valores monetarios,
5. no omitir auditoría,
6. no simplificar tanto que se pierda control operativo,
7. no inventar reglas de negocio no definidas.

---

## 30. Criterios de aceptación

El módulo de productos se considera correcto si:

- permite cargar y mantener el catálogo sin errores,
- organiza bien los productos,
- facilita ventas y compras,
- controla stock y vencimientos,
- mantiene historial,
- y se adapta al negocio real del local.

---

## 31. Cierre

El catálogo de productos es la base de todo el sistema.

Si el producto está bien modelado, ventas, stock, compras, reportes y caja funcionarán mejor.  
Si está mal modelado, el sistema entero se vuelve confuso.

Por eso este módulo debe cuidarse con especial atención.

**Fin del documento.**