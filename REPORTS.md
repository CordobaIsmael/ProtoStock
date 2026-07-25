# REPORTS.md

## 1. Propósito del documento

Este documento define cómo debe funcionar el módulo de reportes del sistema de gestión para una fiambrería y almacén.

Su objetivo es establecer claramente:

- qué reportes debe ofrecer el sistema,
- qué información debe mostrar cada reporte,
- cómo deben filtrarse los datos,
- qué validaciones deben existir,
- cómo deben interpretarse los resultados,
- y qué reglas debe respetar el software para que los reportes sean confiables y útiles.

Si existe contradicción entre una implementación y este documento, este documento tiene prioridad.

---

## 2. Objetivo del módulo de reportes

El módulo de reportes debe transformar la información operativa del negocio en datos útiles para tomar decisiones.

Debe servir para:

- conocer ventas,
- revisar stock,
- medir rentabilidad,
- detectar productos críticos,
- analizar compras,
- controlar caja,
- detectar diferencias,
- identificar tendencias,
- y ayudar al dueño o encargado a entender el estado real del negocio.

Un buen reporte no solo muestra datos; también ayuda a actuar.

---

## 3. Principios del módulo

1. Los reportes deben ser confiables.
2. Los reportes deben basarse en datos reales y consistentes.
3. Deben ser claros y fáciles de interpretar.
4. Deben poder filtrarse por período, categoría, usuario, producto y otros criterios.
5. No deben mezclar datos incompatibles.
6. Deben respetar la trazabilidad histórica.
7. Deben ser rápidos de consultar.
8. Deben servir tanto para control operativo como para análisis.
9. Deben permitir exportación si el negocio lo necesita.
10. Deben conservar coherencia con ventas, compras, stock y caja.

---

## 4. Alcance del módulo

### Incluye

- reportes de ventas,
- reportes de compras,
- reportes de stock,
- reportes de caja,
- reportes de inventario,
- reportes de productos,
- reportes de proveedores,
- reportes de clientes,
- reportes de promociones,
- reportes de vencimientos,
- reportes de auditoría,
- métricas de desempeño,
- exportación de resultados,
- filtros por fecha y otros parámetros.

### No incluye por defecto

- inteligencia de negocio avanzada automatizada sin validación,
- predicciones complejas sin reglas definidas,
- integración con sistemas externos si no se definió,
- dashboards ejecutivos complejos fuera del alcance inicial,
- análisis fiscal avanzado si no está contemplado en el proyecto.

Estas funciones pueden agregarse después.

---

## 5. Definición de reporte

Un reporte es una vista estructurada de información del sistema, organizada para facilitar análisis, control y toma de decisiones.

Un reporte puede ser:

- tabular,
- resumido,
- gráfico,
- comparativo,
- detallado,
- o mixto.

El tipo de reporte depende del objetivo del análisis.

---

## 6. Tipos de reportes

### 6.1 Reportes operativos
Sirven para el control diario del negocio.

Ejemplos:

- ventas del día,
- caja diaria,
- stock actual,
- productos con bajo stock,
- compras recientes,
- productos próximos a vencer.

### 6.2 Reportes analíticos
Sirven para entender tendencias y rendimiento.

Ejemplos:

- productos más vendidos,
- categorías más rentables,
- ticket promedio,
- rotación de mercadería,
- margen estimado,
- comportamiento por horario.

### 6.3 Reportes de control
Sirven para detectar errores o inconsistencias.

Ejemplos:

- diferencias de inventario,
- diferencias de caja,
- ventas anuladas,
- ajustes manuales,
- movimientos fuera de patrón,
- productos vencidos.

### 6.4 Reportes históricos
Sirven para revisar el pasado y comparar períodos.

Ejemplos:

- ventas por mes,
- compras por período,
- evolución de precios,
- evolución de stock,
- comportamiento de caja.

---

## 7. Filtros generales del módulo

Los reportes deben poder filtrarse, según corresponda, por:

- fecha desde,
- fecha hasta,
- día,
- semana,
- mes,
- año,
- categoría,
- subcategoría,
- producto,
- proveedor,
- cliente,
- usuario,
- caja,
- turno,
- estado,
- medio de pago,
- promoción,
- sucursal si existiera.

### Reglas
- Los filtros deben ser claros.
- Los filtros deben combinarse de forma coherente.
- No deben aparecer datos fuera del rango seleccionado.
- Si un filtro no aplica a un reporte, debe ocultarse o deshabilitarse.

---

## 8. Reglas de interpretación

### 8.1 Coherencia temporal
Los reportes deben respetar el rango de fechas seleccionado y mostrar los datos dentro de ese período.

### 8.2 Estados válidos
Debe definirse si un reporte incluye o excluye registros anulados, borradores o pendientes.

### 8.3 Totales
Los totales deben calcularse de forma consistente y visible.

### 8.4 Redondeos
Los valores monetarios y de stock deben conservar la precisión definida por el sistema.

### 8.5 Trazabilidad
Cada número importante debe poder explicarse a partir de los datos de origen.

---

## 9. Reportes de ventas

### 9.1 Ventas del día
Muestra todas las ventas realizadas en la fecha actual o en la fecha seleccionada.

Debe incluir:
- fecha,
- hora,
- usuario,
- total,
- medio de pago,
- estado,
- cantidad de ítems,
- cliente si aplica.

### 9.2 Ventas por período
Muestra ventas dentro de un rango de fechas.

Debe permitir analizar:
- total vendido,
- cantidad de ventas,
- ticket promedio,
- ventas por día,
- ventas por usuario.

### 9.3 Ventas por producto
Muestra qué productos se vendieron y en qué cantidad.

Debe incluir:
- producto,
- cantidad total,
- importe total,
- frecuencia de venta,
- participación sobre el total.

### 9.4 Ventas por categoría
Muestra el rendimiento de cada familia de productos.

Debe incluir:
- categoría,
- total vendido,
- cantidad de ítems,
- ticket asociado,
- porcentaje de participación.

### 9.5 Ventas por usuario
Muestra el volumen vendido por cada usuario.

Debe incluir:
- nombre del usuario,
- cantidad de ventas,
- total vendido,
- ticket promedio,
- anulaciones si aplica.

### 9.6 Ventas por medio de pago
Muestra cómo se cobraron las ventas.

Debe incluir:
- efectivo,
- tarjeta,
- transferencia,
- QR,
- cuenta corriente,
- mixto.

### 9.7 Ventas anuladas
Muestra las ventas anuladas dentro de un período.

Debe incluir:
- motivo,
- usuario,
- fecha,
- importe,
- referencia a la venta original.

### 9.8 Descuentos aplicados
Muestra cuánto se descontó, en qué ventas y por qué.

Debe incluir:
- venta,
- producto o total,
- tipo de descuento,
- importe descontado,
- usuario si fue manual.

---

## 10. Reportes de compras

### 10.1 Compras del período
Muestra todas las compras realizadas en una fecha o rango.

Debe incluir:
- proveedor,
- fecha,
- total,
- estado,
- usuario,
- comprobante.

### 10.2 Compras por proveedor
Permite analizar cuánto se le compra a cada proveedor.

Debe incluir:
- proveedor,
- cantidad de compras,
- importe total,
- promedio por compra,
- productos más comprados.

### 10.3 Compras por producto
Permite saber qué productos ingresan más por compra.

Debe incluir:
- producto,
- cantidad total comprada,
- costo total,
- costo promedio,
- proveedor principal.

### 10.4 Compras con vencimiento próximo
Muestra compras que contienen mercadería próxima a vencer.

Debe incluir:
- producto,
- lote,
- fecha de vencimiento,
- cantidad,
- proveedor.

### 10.5 Compras anuladas
Muestra las compras anuladas dentro del período seleccionado.

Debe incluir:
- proveedor,
- fecha,
- usuario,
- motivo,
- importe total.

---

## 11. Reportes de stock

### 11.1 Stock actual
Muestra el stock disponible de cada producto.

Debe incluir:
- producto,
- categoría,
- stock actual,
- stock mínimo,
- estado,
- unidad de medida.

### 11.2 Stock bajo
Muestra productos que están en o por debajo del mínimo.

Debe incluir:
- producto,
- stock actual,
- stock mínimo,
- diferencia,
- categoría,
- prioridad.

### 11.3 Stock crítico
Muestra productos con riesgo alto de quiebre.

Debe definirse con umbral configurable.

### 11.4 Stock negativo
Si el sistema permite excepciones, este reporte debe mostrar productos con saldo negativo.

### 11.5 Productos sin movimiento
Muestra productos que no se movieron en un período definido.

Debe servir para detectar:
- productos lentos,
- posibles obsoletos,
- mercadería inmovilizada.

### 11.6 Rotación de stock
Muestra la velocidad con la que un producto entra y sale del inventario.

### 11.7 Stock por categoría
Muestra el inventario agrupado por familia de productos.

### 11.8 Stock por proveedor
Muestra inventario relacionado con cada proveedor si aplica.

---

## 12. Reportes de inventario

### 12.1 Diferencias de inventario
Muestra comparación entre stock teórico y stock físico.

Debe incluir:
- producto,
- stock teórico,
- stock contado,
- diferencia,
- motivo,
- usuario,
- fecha.

### 12.2 Ajustes de inventario
Muestra todos los ajustes realizados.

Debe incluir:
- producto,
- cantidad ajustada,
- tipo de ajuste,
- motivo,
- usuario,
- fecha.

### 12.3 Mermas
Muestra pérdidas por rotura, vencimiento o daño.

Debe incluir:
- producto,
- cantidad,
- motivo,
- fecha,
- usuario.

### 12.4 Conteos físicos
Muestra inventarios realizados y su resultado.

Debe incluir:
- fecha,
- responsable,
- productos contados,
- diferencias,
- estado.

---

## 13. Reportes de caja

### 13.1 Caja diaria
Muestra el resumen del día o turno.

Debe incluir:
- apertura,
- cierre,
- efectivo inicial,
- total esperado,
- total contado,
- diferencia,
- movimientos,
- usuario responsable.

### 13.2 Ingresos de caja
Muestra los ingresos manuales y operativos.

### 13.3 Egresos de caja
Muestra gastos, retiros y salidas de dinero.

### 13.4 Diferencias de caja
Muestra diferencias positivas o negativas.

Debe incluir:
- caja,
- usuario,
- fecha,
- diferencia,
- motivo si existe.

### 13.5 Caja por usuario
Muestra cómo operó cada usuario en caja.

### 13.6 Caja por medio de pago
Muestra la distribución de ingresos por forma de cobro.

---

## 14. Reportes de productos

### 14.1 Productos más vendidos
Muestra los productos con mayor cantidad o importe vendido.

### 14.2 Productos menos vendidos
Permite detectar productos de baja salida.

### 14.3 Productos más rentables
Muestra los artículos con mayor margen o ganancia estimada.

### 14.4 Productos con mayor costo
Permite revisar artículos caros o sensibles.

### 14.5 Productos vencidos
Muestra mercadería vencida o próxima a vencer.

### 14.6 Productos por categoría
Permite revisar el catálogo ordenado por familia.

### 14.7 Productos sin stock
Muestra los artículos agotados.

### 14.8 Productos con stock irregular
Muestra productos con comportamiento fuera de lo esperado, si el sistema lo detecta.

---

## 15. Reportes de clientes

### 15.1 Historial de compras por cliente
Muestra qué compró cada cliente y cuándo.

### 15.2 Clientes con saldo pendiente
Si existe cuenta corriente, este reporte es fundamental.

### 15.3 Clientes más frecuentes
Permite ver recurrencia de compra.

### 15.4 Clientes con mayor volumen
Muestra clientes que compran más en dinero o cantidad.

---

## 16. Reportes de proveedores

### 16.1 Historial de compras por proveedor
Muestra todo lo comprado a cada proveedor.

### 16.2 Proveedores más usados
Permite ver dependencia operativa.

### 16.3 Proveedores con mayor volumen
Muestra quién concentra más compras.

### 16.4 Productos por proveedor
Relaciona catálogo y abastecimiento.

---

## 17. Reportes de promociones

### 17.1 Promociones activas
Muestra promociones vigentes.

### 17.2 Promociones vencidas
Muestra promociones ya finalizadas.

### 17.3 Impacto de promociones
Muestra cuánto influyeron en ventas o descuentos.

### 17.4 Productos con promoción aplicada
Ayuda a controlar qué se está vendiendo bajo oferta.

---

## 18. Reportes de auditoría

### 18.1 Acciones por usuario
Muestra qué hizo cada usuario en el sistema.

### 18.2 Cambios de precios
Permite revisar modificaciones sensibles.

### 18.3 Cambios de stock
Muestra movimientos manuales o críticos.

### 18.4 Anulaciones
Muestra ventas, compras o cajas anuladas.

### 18.5 Historial general
Permite revisar trazabilidad completa por entidad.

---

## 19. Indicadores clave

El módulo debe poder alimentar indicadores como:

- ventas del día,
- ventas acumuladas,
- ticket promedio,
- margen estimado,
- stock crítico,
- productos más vendidos,
- productos sin rotación,
- diferencias de caja,
- mermas,
- compras del período,
- rentabilidad aproximada.

---

## 20. Reglas de cálculo

### 20.1 Total vendido
Suma de ventas confirmadas dentro del rango definido.

### 20.2 Ticket promedio
Total vendido dividido por cantidad de ventas válidas.

### 20.3 Margen estimado
Diferencia entre precio de venta y costo, multiplicado por la cantidad vendida o comprada.

### 20.4 Rotación
Relación entre entrada y salida de mercadería en un período.

### 20.5 Diferencia de inventario
Stock físico menos stock teórico o viceversa según la fórmula definida por el negocio.

### Reglas
- Las fórmulas deben ser consistentes.
- Debe quedar claro qué se está midiendo.
- No debe haber ambigüedad entre importe bruto, neto o total final.

---

## 21. Formato de presentación

Los reportes pueden mostrarse de distintas formas:

- tabla,
- gráfico de barras,
- gráfico de líneas,
- gráfico circular,
- resumen KPI,
- listado detallado,
- tarjetas de indicadores.

### Reglas
- La forma visual debe ayudar a entender el dato.
- Los datos importantes no deben quedar ocultos.
- Los totales deben verse con claridad.
- Los filtros deben ser accesibles.

---

## 22. Exportación

Los reportes deben poder exportarse, según lo que defina el proyecto.

### Formatos posibles
- PDF,
- Excel,
- CSV,
- imagen,
- vista imprimible.

### Reglas
- La exportación debe respetar los filtros aplicados.
- El archivo exportado debe coincidir con lo que el usuario ve.
- Los totales deben conservarse.

---

## 23. Permisos sobre reportes

No todos los usuarios deben ver todo.

### Permisos posibles
- ver reportes de ventas,
- ver reportes de compras,
- ver reportes de stock,
- ver reportes de caja,
- ver reportes de auditoría,
- exportar reportes,
- ver reportes financieros,
- ver costos y márgenes.

### Reglas
- Los reportes sensibles deben estar protegidos.
- El administrador puede tener acceso ampliado.
- El cajero no necesariamente debe ver costos o márgenes si no corresponde.

---

## 24. Validaciones obligatorias

Antes de generar un reporte, el sistema debe validar:

- que el rango de fechas sea coherente,
- que el filtro no esté vacío si el reporte lo exige,
- que el usuario tenga permisos,
- que el tipo de reporte tenga datos disponibles,
- que no se mezclen estados incompatibles si no corresponde.

---

## 25. Casos de excepción

El sistema debe manejar correctamente estos casos:

- rango de fechas inválido,
- filtros sin resultados,
- usuario sin permiso,
- datos inconsistentes,
- registros anulados,
- entidades faltantes,
- error al exportar,
- error al calcular totales.

En todos los casos debe mostrarse un mensaje claro y útil.

---

## 26. Historial de consultas

Si el proyecto lo requiere, puede ser útil registrar:

- qué reportes consultó cada usuario,
- cuándo los consultó,
- qué filtros usó,
- qué exportó.

Esto puede servir para auditoría o análisis interno.

---

## 27. Reglas de integridad

Los reportes deben construirse a partir de datos reales y consistentes.

### Reglas
- No inventar números.
- No mezclar estados incompatibles sin definirlo.
- No omitir anulaciones si el reporte debe mostrarlas.
- No sumar registros duplicados.
- No perder precisión monetaria.
- No alterar datos de origen para “hacer cuadrar” un reporte.

---

## 28. Reglas para IA al trabajar con reportes

La IA que genere o modifique este módulo debe:

1. respetar el origen real de los datos,
2. no inventar fórmulas sin contexto,
3. no mezclar ventas con compras,
4. no ocultar anulaciones ni diferencias,
5. no usar valores aproximados cuando se requiera exactitud,
6. no simplificar tanto que el reporte pierda utilidad,
7. no romper los filtros ni los totales,
8. no omitir permisos,
9. no generar gráficos que confundan más de lo que ayudan,
10. no cambiar la semántica de los indicadores sin avisar.

---

## 29. Criterios de aceptación

El módulo de reportes se considera correcto si:

- muestra información clara y confiable,
- permite filtrar con precisión,
- ayuda a tomar decisiones,
- refleja ventas, compras, stock y caja correctamente,
- conserva trazabilidad,
- y permite exportar o consultar resultados sin perder consistencia.

---

## 30. Cierre

El módulo de reportes convierte los datos operativos en información útil.

Si se diseña bien, el negocio entiende qué pasa, qué conviene reponer, qué se vende, qué se pierde y dónde hay problemas.  
Si se diseña mal, solo genera números confusos.

Por eso este módulo debe ser claro, consistente y alineado con el negocio real.

**Fin del documento.**