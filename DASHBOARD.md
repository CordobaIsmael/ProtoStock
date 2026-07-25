# DASHBOARD.md

## 1. Propósito del documento

Este documento define cómo debe funcionar el dashboard principal del sistema de gestión para una fiambrería y almacén.

Su objetivo es establecer claramente:

- qué información debe mostrarse en pantalla principal,
- qué indicadores debe resumir,
- cómo deben organizarse los bloques visuales,
- qué filtros debe tener,
- qué alertas debe priorizar,
- qué comportamiento debe seguir el sistema,
- y cómo debe ayudar al dueño o encargado a tomar decisiones rápidas.

Si existe contradicción entre una implementación y este documento, este documento tiene prioridad.

---

## 2. Objetivo del dashboard

El dashboard debe ser la vista central del sistema.

Debe permitir que una persona entienda en pocos segundos:

- cómo viene la venta del día,
- cómo está la caja,
- qué stock está bajo,
- qué productos están por vencer,
- qué se vendió más,
- qué compras hubo,
- y si hay problemas que requieren atención.

El dashboard no debe ser solo decorativo. Debe ser una herramienta de control real.

---

## 3. Principios del dashboard

1. Debe ser claro.
2. Debe ser rápido.
3. Debe priorizar lo importante.
4. Debe mostrar datos confiables.
5. Debe evitar saturación visual.
6. Debe permitir acción rápida.
7. Debe resaltar alertas críticas.
8. Debe actualizarse con información real.
9. Debe servir tanto al dueño como al encargado.
10. Debe estar alineado con la operación del negocio.

---

## 4. Alcance del dashboard

### Incluye

- indicadores principales,
- ventas del día,
- ventas del mes,
- caja actual,
- stock crítico,
- productos más vendidos,
- productos próximos a vencer,
- compras recientes,
- diferencias de caja,
- alertas operativas,
- gráficos de resumen,
- accesos rápidos a módulos importantes.

### No incluye por defecto

- análisis financiero avanzado externo,
- inteligencia predictiva automática compleja,
- reportes contables formales,
- proyecciones sofisticadas sin reglas del negocio,
- panel multi sucursal avanzado si no está definido.

Estas funciones pueden agregarse más adelante.

---

## 5. Definición de dashboard

El dashboard es una vista resumida y visual que reúne la información más importante del sistema en un solo lugar.

Debe combinar:

- tarjetas de indicadores,
- gráficos,
- alertas,
- tablas resumidas,
- accesos rápidos,
- y estados generales del negocio.

No reemplaza a los reportes, pero resume lo esencial.

---

## 6. Usuarios del dashboard

El dashboard puede ser usado por distintos perfiles:

- administrador,
- encargado,
- cajero,
- compras,
- consulta.

### Reglas
- Cada usuario debe ver solo lo que le corresponde.
- Los permisos deben controlar qué indicadores aparecen.
- Un usuario operativo no necesariamente debe ver costos o márgenes si no corresponde.
- El administrador debe tener acceso completo.

---

## 7. Estructura visual sugerida

El dashboard puede organizarse en bloques:

### 7.1 Encabezado
Contiene:
- nombre del negocio,
- fecha actual,
- usuario logueado,
- estado general,
- filtros principales si aplica.

### 7.2 Tarjetas KPI
Muestran indicadores clave como:
- ventas de hoy,
- ventas del mes,
- caja actual,
- ticket promedio,
- stock crítico,
- productos por vencer,
- compras recientes,
- diferencias de caja.

### 7.3 Gráficos
Pueden mostrar:
- ventas por día,
- ventas por hora,
- ventas por categoría,
- stock por categoría,
- formas de pago,
- compras por período.

### 7.4 Alertas
Bloque destinado a resaltar:
- productos con bajo stock,
- productos vencidos,
- caja con diferencia,
- ventas anuladas,
- compras pendientes,
- errores operativos.

### 7.5 Tablas resumidas
Para mostrar:
- top productos,
- últimos movimientos,
- compras recientes,
- productos críticos,
- diferencias relevantes.

### 7.6 Accesos rápidos
Botones o accesos directos a:
- productos,
- ventas,
- compras,
- caja,
- inventario,
- reportes.

---

## 8. Indicadores principales

El dashboard debe mostrar al menos estos KPIs:

- ventas de hoy,
- ventas del mes,
- cantidad de ventas,
- ticket promedio,
- caja actual,
- diferencias de caja,
- productos con stock bajo,
- productos críticos,
- productos próximos a vencer,
- productos vencidos,
- compras del día o período,
- margen estimado si el negocio lo permite.

---

## 9. Ventas en el dashboard

### 9.1 Ventas de hoy
Debe mostrar el total vendido en el día actual.

### 9.2 Ventas del mes
Debe mostrar el acumulado mensual.

### 9.3 Cantidad de ventas
Debe mostrar cuántas operaciones hubo.

### 9.4 Ticket promedio
Debe mostrar el promedio por venta.

### 9.5 Reglas
- Debe poder filtrarse por fecha si el usuario lo requiere.
- Debe respetar el estado de las ventas.
- Debe ser consistente con los reportes.

---

## 10. Caja en el dashboard

### 10.1 Caja actual
Debe mostrar el estado resumido de la caja abierta o de la última caja cerrada, según el contexto.

### 10.2 Diferencia de caja
Debe resaltar si existe diferencia positiva o negativa.

### 10.3 Reglas
- La información de caja debe ser visible de forma clara.
- Si hay una diferencia importante, debe destacarse visualmente.
- El usuario debe poder entrar al detalle desde el dashboard.

---

## 11. Stock en el dashboard

### 11.1 Stock crítico
Debe mostrar productos con muy bajo stock o sin stock.

### 11.2 Stock bajo
Debe mostrar productos que están cerca del mínimo.

### 11.3 Reglas
- El dashboard debe priorizar productos con mayor urgencia.
- El usuario debe poder ingresar al detalle del producto.
- Los productos críticos deben verse antes que el resto.

---

## 12. Vencimientos en el dashboard

### 12.1 Productos por vencer
Debe mostrar mercadería con fecha próxima de vencimiento.

### 12.2 Productos vencidos
Debe mostrar productos vencidos o marcados como fuera de circulación.

### 12.3 Reglas
- Los vencimientos deben ordenarse por urgencia.
- Debe priorizarse lo más cercano a vencer.
- Debe poder accederse al detalle del lote o producto.

---

## 13. Compras en el dashboard

### 13.1 Compras recientes
Debe mostrar las últimas compras registradas.

### 13.2 Compras del día o período
Debe poder mostrar un resumen de compras por período.

### 13.3 Reglas
- Debe verse el proveedor.
- Debe verse el total.
- Debe verse el estado si aplica.
- Debe poder entrar al detalle.

---

## 14. Productos destacados

### 14.1 Más vendidos
Muestra los productos con mayor volumen o importe vendido.

### 14.2 Menos vendidos
Muestra productos con baja salida si el negocio lo necesita.

### 14.3 Más rentables
Si el sistema maneja costos, puede mostrar productos con mejor margen.

### 14.4 Reglas
- El criterio de orden debe quedar claro.
- Debe poder cambiarse el rango temporal.
- No debe confundir cantidad con importe si son métricas distintas.

---

## 15. Alertas operativas

El dashboard debe priorizar alertas importantes.

### Ejemplos
- stock bajo,
- stock crítico,
- producto vencido,
- caja con diferencia,
- venta anulada,
- compra pendiente,
- error de sincronización,
- ajuste de stock pendiente de revisión.

### Reglas
- Las alertas deben ser visibles.
- Las alertas críticas deben destacarse más que las normales.
- Las alertas deben poder abrir el detalle correspondiente.
- El sistema no debe ocultar problemas operativos.

---

## 16. Filtros del dashboard

El dashboard puede tener filtros generales según el contexto.

### Filtros posibles
- fecha desde,
- fecha hasta,
- día,
- semana,
- mes,
- categoría,
- producto,
- usuario,
- proveedor,
- estado,
- medio de pago,
- sucursal si existiera.

### Reglas
- Los filtros deben ser simples.
- Deben aplicarse de forma consistente a todo el tablero.
- Si un filtro no aplica, debe ocultarse o desactivarse.
- Los datos deben recalcularse según el filtro seleccionado.

---

## 17. Navegación rápida

El dashboard debe funcionar como punto de entrada al sistema.

### Debe incluir accesos a:
- nuevo producto,
- nueva venta,
- nueva compra,
- abrir caja,
- cerrar caja,
- inventario,
- reportes,
- alertas,
- productos críticos,
- vencimientos.

### Reglas
- Los accesos rápidos deben ser visibles.
- Deben reducir cantidad de clics.
- Deben estar organizados según el perfil del usuario.

---

## 18. Diseño visual

### 18.1 Claridad
Los bloques deben estar ordenados y fáciles de leer.

### 18.2 Jerarquía
Lo más importante debe verse primero.

### 18.3 Limpieza
No debe haber exceso de información en una sola pantalla.

### 18.4 Consistencia
Los estilos, colores e íconos deben mantener lógica visual.

### 18.5 Responsividad
El dashboard debe adaptarse a distintos tamaños de pantalla si la plataforma lo requiere.

---

## 19. Reglas de visualización de datos

### 19.1 Totales
Los totales deben mostrarse de forma destacada.

### 19.2 Tendencias
Si hay gráficos, deben ser fáciles de interpretar.

### 19.3 Comparaciones
Debe ser posible comparar:
- hoy vs ayer,
- semana actual vs semana anterior,
- mes actual vs mes anterior.

### 19.4 Alertas
Las alertas deben usar prioridad visual clara.

### 19.5 Vacíos de información
Si no hay datos, el dashboard debe mostrar mensajes claros y no errores vacíos.

---

## 20. Indicadores sugeridos por sección

### Ventas
- total vendido hoy,
- total vendido en el mes,
- cantidad de operaciones,
- ticket promedio.

### Caja
- efectivo esperado,
- efectivo contado,
- diferencia,
- ventas por medio de pago.

### Stock
- cantidad de productos bajo mínimo,
- productos críticos,
- productos sin stock.

### Vencimientos
- próximos a vencer,
- vencidos,
- lote más urgente.

### Compras
- compras recientes,
- total del período,
- proveedor principal del día.

### Operación
- últimos movimientos,
- ventas anuladas,
- ajustes recientes.

---

## 21. Tablas resumidas recomendadas

El dashboard puede mostrar tablas cortas para información más útil.

### Ejemplos
- top 5 productos vendidos,
- top 5 productos con stock bajo,
- top 5 vencimientos urgentes,
- últimas 5 ventas,
- últimas 5 compras,
- últimas 5 alertas.

### Reglas
- Las tablas deben ser cortas y resumidas.
- Debe poder accederse al detalle desde ellas.
- No deben sustituir los reportes completos.

---

## 22. Comportamiento por rol

### 22.1 Administrador
Debe ver todo.

### 22.2 Encargado
Debe ver operación, caja, stock, compras y alertas.

### 22.3 Cajero
Debe ver ventas, caja y alertas operativas básicas.

### 22.4 Compras
Debe ver stock, productos críticos, vencimientos y compras recientes.

### 22.5 Consulta
Debe ver solo información permitida por el negocio.

---

## 23. Actualización de datos

### Reglas
- El dashboard debe mostrar información actualizada.
- La frecuencia de actualización debe ser definida por el sistema.
- No debe mostrar datos obsoletos sin advertencia.
- Si hay error de actualización, debe informarse claramente.

---

## 24. Estados y mensajes vacíos

### 24.1 Sin datos
Si un bloque no tiene datos, debe mostrar un mensaje claro como:
- no hay ventas registradas,
- no hay stock crítico,
- no hay vencimientos próximos.

### 24.2 Error
Si un bloque falla, debe mostrar:
- mensaje de error claro,
- posibilidad de reintentar,
- sin romper el resto del dashboard.

---

## 25. Reglas de negocio del dashboard

1. El dashboard no debe inventar datos.
2. El dashboard debe usar datos reales del sistema.
3. Los indicadores deben ser coherentes con reportes y módulos.
4. Las métricas deben respetar el período filtrado.
5. Las alertas deben priorizar urgencia operativa.
6. El dashboard debe ayudar a decidir, no solo a decorar.
7. El dueño debe poder entenderlo rápidamente.
8. Los datos sensibles deben depender de permisos.
9. El dashboard no debe reemplazar el detalle, solo resumirlo.
10. El diseño debe favorecer uso diario.

---

## 26. Integridad de datos

Los datos mostrados en el dashboard deben provenir de fuentes confiables y consistentes.

### Reglas
- No duplicar conteos.
- No mezclar períodos.
- No sumar registros anulados si no corresponde.
- No ocultar diferencias.
- No reinterpretar datos sin criterio definido.

---

## 27. Exportación y acceso

Si el proyecto lo define, el dashboard puede:

- exportarse,
- imprimirse,
- guardarse como imagen,
- abrir reportes asociados.

### Reglas
- La exportación debe mantener la información visible.
- Debe respetar el filtro activo.
- Debe ser entendible fuera del sistema.

---

## 28. Permisos del dashboard

### Posibles permisos
- ver dashboard general,
- ver indicadores financieros,
- ver alertas de stock,
- ver alertas de caja,
- ver métricas de rentabilidad,
- ver panel ejecutivo,
- exportar resumen.

### Reglas
- Los permisos deben limitar la visibilidad de datos sensibles.
- Los usuarios operativos no necesariamente deben ver todo.
- El administrador debe poder ver el panel completo.

---

## 29. Reglas para IA al trabajar con el dashboard

La IA que genere o modifique este módulo debe:

1. respetar las fuentes reales de datos,
2. no crear métricas sin definición,
3. no confundir ventas con compras,
4. no mezclar caja con ingresos no operativos,
5. no ocultar alertas importantes,
6. no saturar la vista con demasiados bloques,
7. no romper permisos,
8. no inventar cálculos ambiguos,
9. no desalinear el dashboard con los reportes,
10. no convertirlo en una pantalla decorativa sin valor operativo.

---

## 30. Criterios de aceptación

El dashboard se considera correcto si:

- resume el estado del negocio de forma clara,
- muestra lo urgente primero,
- refleja ventas, caja, stock y vencimientos,
- se adapta al rol del usuario,
- permite acceder rápido al detalle,
- y ayuda a tomar decisiones diarias.

---

## 31. Cierre

El dashboard es la cara visible del sistema.

Si está bien hecho, ordena, orienta y acelera la operación.  
Si está mal hecho, confunde y oculta información importante.

Por eso debe ser simple, útil, claro y consistente con todo el resto del proyecto.

**Fin del documento.**