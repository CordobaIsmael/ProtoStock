# INVENTORY.md

## 1. Propósito del documento

Este documento define cómo debe funcionar el módulo de inventario del sistema de gestión para una fiambrería y almacén.

Su objetivo es establecer con claridad:

- cómo se controla el stock real,
- cómo se registran ajustes,
- cómo se hacen inventarios físicos,
- cómo se manejan diferencias,
- cómo se controlan mermas y pérdidas,
- cómo se vincula el inventario con compras y ventas,
- y qué reglas debe respetar el sistema para mantener consistencia.

Si existe contradicción entre una implementación y este documento, este documento tiene prioridad.

---

## 2. Objetivo del módulo de inventario

El inventario debe permitir saber con la mayor precisión posible cuánta mercadería hay realmente en el local.

Debe servir para:

- comparar stock teórico contra stock físico,
- detectar diferencias,
- corregir errores operativos,
- identificar pérdidas o mermas,
- revisar productos con baja rotación,
- controlar vencimientos,
- y asegurar que el stock del sistema refleje la realidad.

El inventario es uno de los controles más importantes del negocio.

---

## 3. Principios del módulo

1. El stock debe ser confiable.
2. Todo cambio debe dejar rastro.
3. El inventario físico debe poder compararse con el stock del sistema.
4. Las diferencias deben explicarse o justificarse.
5. No se debe perder historial de movimientos.
6. Los ajustes no deben hacerse sin motivo.
7. El sistema debe distinguir entre error, merma y corrección.
8. Los productos vencidos deben poder identificarse.
9. La trazabilidad debe conservarse siempre.
10. La simplicidad operativa no debe destruir el control.

---

## 4. Alcance del módulo

### Incluye

- consulta de stock actual,
- conteo físico,
- carga de inventarios,
- comparación teórico vs real,
- ajustes positivos y negativos,
- registro de diferencias,
- mermas,
- productos vencidos,
- productos dañados,
- productos faltantes,
- historial de movimientos,
- alertas de stock bajo,
- alertas de stock crítico,
- reportes de inventario,
- auditoría.

### No incluye por defecto

- conteo automático con IA sin validación humana,
- integración con hardware de inventario compleja si no está definida,
- sincronización multi depósito avanzada,
- optimización logística compleja,
- predicción automática de faltantes sin reglas claras.

---

## 5. Definición de inventario

En este sistema, el inventario es el proceso de registrar, comparar y corregir la cantidad real de productos disponibles en el local.

Puede realizarse:

- de forma total,
- por categoría,
- por proveedor,
- por zona,
- por pasillo,
- por grupo de productos,
- o por productos seleccionados.

El inventario no es solo un conteo: es también una herramienta de control y corrección.

---

## 6. Tipos de inventario

### 6.1 Inventario total
Se revisa todo el stock del local.

### 6.2 Inventario parcial
Se revisa solo una parte del catálogo.

### 6.3 Inventario por categoría
Se cuenta una familia de productos específica.

### 6.4 Inventario por vencimiento
Se revisan productos próximos a vencer o vencidos.

### 6.5 Inventario por control interno
Se revisa mercadería con sospecha de error, merma o desorden.

### 6.6 Inventario cíclico
Se hace por partes, de forma periódica, sin contar todo el local en una sola jornada.

---

## 7. Ciclo de vida de un inventario

Un inventario puede pasar por los siguientes estados:

- borrador,
- en conteo,
- pendiente de revisión,
- confirmado,
- cerrado,
- anulado.

### Significado

#### Borrador
El inventario se creó pero todavía no fue iniciado formalmente.

#### En conteo
Se está realizando el conteo físico.

#### Pendiente de revisión
Ya se cargaron datos, pero todavía falta validar diferencias o ajustes.

#### Confirmado
El inventario fue aprobado y las diferencias impactaron en stock si así se definió.

#### Cerrado
El inventario ya no admite cambios.

#### Anulado
El inventario no se considera válido y debe conservarse solo como historial.

---

## 8. Flujo general de inventario

El flujo básico debe ser el siguiente:

1. El usuario crea un inventario nuevo.
2. El sistema define el alcance del conteo.
3. Se listan los productos a revisar.
4. Se cargan las cantidades físicas.
5. El sistema calcula diferencias.
6. Se revisan faltantes, sobrantes y ajustes.
7. Se validan los motivos.
8. Se confirma el inventario.
9. El sistema genera los ajustes correspondientes.
10. Se deja trazabilidad y auditoría.

---

## 9. Datos mínimos de un inventario

Todo inventario debe guardar, como mínimo:

- identificador único,
- fecha de inicio,
- fecha de cierre,
- usuario creador,
- usuarios que participaron si aplica,
- estado,
- alcance del conteo,
- observaciones,
- referencia a ajustes,
- historial de validación,
- auditoría asociada.

---

## 10. Detalle por producto

Cada inventario debe poder registrar por producto:

- stock teórico,
- stock contado,
- diferencia,
- tipo de diferencia,
- motivo,
- observaciones,
- lote si corresponde,
- vencimiento si corresponde,
- usuario que contó o cargó la cantidad,
- fecha y hora de carga.

### Reglas

- Un inventario sin detalle no debe confirmarse.
- Cada producto debe poder revisarse individualmente.
- La diferencia debe calcularse de forma automática.
- Los datos deben conservar precisión para productos por peso o fracción.

---

## 11. Stock teórico vs stock físico

### 11.1 Stock teórico
Es el stock que el sistema cree que existe a partir de compras, ventas, devoluciones y ajustes previos.

### 11.2 Stock físico
Es la cantidad real que se encuentra en el local al momento del conteo.

### 11.3 Diferencia
Es la brecha entre ambos valores.

### Reglas
- La diferencia puede ser positiva o negativa.
- Toda diferencia debe poder justificarse.
- Las diferencias grandes deben revisarse manualmente.
- El sistema debe mostrar claramente ambos valores para evitar errores.

---

## 12. Ajustes de inventario

### 12.1 Ajuste positivo
Se usa cuando el sistema muestra menos mercadería de la real.

Ejemplo:
- el sistema dice 10,
- en el local hay 12,
- se ajusta +2.

### 12.2 Ajuste negativo
Se usa cuando el sistema muestra más mercadería de la real.

Ejemplo:
- el sistema dice 10,
- en el local hay 8,
- se ajusta -2.

### 12.3 Reglas
- Todo ajuste debe registrar motivo.
- Todo ajuste debe registrar usuario.
- Todo ajuste debe quedar auditado.
- No se debe ajustar sin explicar la causa.
- Los ajustes deben impactar stock de forma controlada.

---

## 13. Motivos de diferencia

El sistema debe permitir guardar motivos para explicar diferencias.

### Ejemplos de motivo
- error de carga,
- venta no registrada,
- merma,
- rotura,
- vencimiento,
- robo o faltante,
- producto mal contado,
- diferencia por redondeo,
- error de recepción,
- devolución pendiente,
- ajuste manual autorizado.

### Reglas
- El motivo no debe ser opcional cuando la diferencia es significativa si el negocio así lo define.
- Debe poder repetirse un motivo estándar o agregarse uno personalizado.
- Los motivos ayudan a auditoría y análisis.

---

## 14. Mermas y pérdidas

### 14.1 Definición
La merma es la pérdida de mercadería por razones operativas o físicas.

### 14.2 Casos típicos
- vencimiento,
- rotura,
- derrame,
- daño,
- mala manipulación,
- devolución no apta para stock.

### 14.3 Reglas
- La merma debe descontar stock.
- La merma debe quedar registrada por producto.
- El motivo debe ser claro.
- La merma debe poder reportarse por fecha, usuario y categoría.

---

## 15. Productos vencidos

### 15.1 Objetivo
Evitar que productos vencidos sigan circulando o se vendan por error.

### 15.2 Reglas
- El inventario debe poder detectar productos vencidos.
- Los productos vencidos deben excluirse de venta salvo regla excepcional.
- Deben poder marcarse como pérdida o merma.
- Debe quedar histórico del vencimiento y del tratamiento aplicado.

### 15.3 Alertas
El sistema puede mostrar:

- próximos a vencer,
- vencidos,
- vencidos sin tratar,
- vencidos ya dados de baja.

---

## 16. Conteo físico

### 16.1 Definición
El conteo físico es la acción de revisar manualmente cuánta mercadería existe realmente.

### 16.2 Reglas
- El conteo debe poder hacerse por sectores o en total.
- El conteo debe registrar usuario y fecha.
- El sistema debe permitir guardar parcialidades si el inventario no se completa de una sola vez.
- El conteo debe evitar duplicaciones o sobreescrituras accidentales.

### 16.3 Recomendaciones
- Contar por categoría.
- Separar productos por peso de los productos por unidad.
- Revisar primero productos de mayor rotación.
- Validar vencidos y productos críticos.

---

## 17. Inventario parcial

### 17.1 Definición
Un inventario parcial revisa solo una parte del stock.

### 17.2 Ejemplos
- solo fiambres,
- solo quesos,
- solo bebidas,
- solo productos con stock crítico,
- solo productos de alto valor.

### 17.3 Reglas
- Debe poder cerrarse sin revisar todo el catálogo.
- Las diferencias deben aplicarse solo sobre los productos incluidos.
- No debe afectar productos que no formaron parte del conteo.

---

## 18. Inventario total

### 18.1 Definición
Es el conteo general de toda la mercadería del local.

### 18.2 Reglas
- Debe reflejar el estado más completo posible del stock.
- Requiere más control y tiempo.
- Debe dejar el inventario y el stock alineados al cierre.

### 18.3 Uso
Se recomienda para cierres mensuales, auditorías internas o controles de fondo.

---

## 19. Inventario cíclico

### 19.1 Definición
Es un método de control continuo en el que se cuentan grupos de productos en distintos momentos.

### 19.2 Beneficios
- reduce interrupciones,
- ayuda a detectar errores gradualmente,
- facilita control constante.

### 19.3 Reglas
- Debe poder planificarse por categoría o prioridad.
- Debe guardar histórico por ciclos.
- No debe perder el contexto de los conteos previos.

---

## 20. Relación con ventas y compras

El inventario debe entender que el stock se mueve por:

- compras,
- ventas,
- devoluciones,
- ajustes,
- mermas,
- vencimientos,
- correcciones manuales.

### Reglas
- El inventario no debe ignorar movimientos previos.
- El cálculo del stock teórico debe surgir del historial.
- El ajuste final debe respetar trazabilidad.

---

## 21. Relación con lotes y vencimientos

### 21.1 Lotes
Si el negocio trabaja con lotes, el inventario debe respetarlos.

### 21.2 Vencimientos
Si el producto vence, el inventario debe poder revisar cantidad por fecha de vencimiento.

### 21.3 Reglas
- Los productos vencibles deben poder segmentarse por lote.
- El inventario debe mostrar qué lote está siendo contado.
- Si un lote se venció, debe tratarse según la política definida.

---

## 22. Productos por peso

Los productos por peso requieren especial cuidado en inventario.

### Reglas
- Deben contarse con precisión decimal.
- El sistema debe mantener coherencia de unidades.
- Debe evitarse redondear de forma agresiva.
- El inventario debe registrar el formato exacto del producto.

### Ejemplos
- 0,250 kg,
- 0,500 kg,
- 1,250 kg.

---

## 23. Productos por unidad

### Reglas
- El conteo debe ser entero salvo que el producto permita fracciones.
- La cantidad física debe coincidir con la unidad de venta.
- El sistema debe evitar que se mezclen unidades distintas en un mismo producto.

---

## 24. Inventario y permisos

No todos los usuarios deben poder hacer lo mismo.

### Permisos posibles
- crear inventario,
- cargar conteo,
- editar conteo,
- validar diferencias,
- confirmar inventario,
- anular inventario,
- ver histórico,
- exportar inventario,
- aplicar ajustes.

### Reglas
- El ajuste final puede requerir permisos especiales.
- El inventario cerrado no debe modificarse libremente.
- El administrador o encargado puede tener permisos ampliados.

---

## 25. Validaciones obligatorias

Antes de confirmar un inventario, el sistema debe validar como mínimo:

- que exista inventario creado,
- que haya productos cargados,
- que las cantidades sean válidas,
- que no existan duplicados en el mismo conteo,
- que los motivos estén completos si hay diferencias,
- que el usuario tenga permisos,
- que el estado permita confirmar,
- que el ajuste final no rompa reglas del negocio.

---

## 26. Errores y casos de excepción

El sistema debe manejar correctamente estos casos:

- producto inexistente,
- producto inactivo,
- stock teórico incongruente,
- conteo duplicado,
- cantidad inválida,
- lote faltante si es obligatorio,
- vencimiento faltante si es obligatorio,
- inventario ya cerrado,
- ajuste no autorizado,
- error al guardar o sincronizar.

En todos los casos debe mostrarse un mensaje claro y no perderse el trabajo realizado.

---

## 27. Reportes derivados del inventario

El módulo debe alimentar reportes como:

- diferencias por inventario,
- productos con más ajustes,
- productos con más faltantes,
- productos con sobrantes,
- mermas por período,
- vencimientos por período,
- diferencias por usuario,
- diferencias por categoría,
- ajustes positivos y negativos,
- historial de inventarios,
- productos con recuento frecuente.

---

## 28. Auditoría del inventario

Toda acción importante debe quedar registrada.

### Se audita especialmente:
- creación de inventario,
- inicio de conteo,
- carga de cantidades,
- cambios en cantidades,
- confirmación,
- anulación,
- ajustes finales,
- motivos de diferencia,
- cambios manuales sobre productos del inventario.

### Datos mínimos
- usuario,
- fecha,
- hora,
- acción,
- producto afectado,
- valor anterior,
- valor nuevo,
- motivo si corresponde.

---

## 29. Integridad de datos

El módulo de inventario debe garantizar:

- no perder conteos,
- no mezclar inventarios distintos,
- no aplicar ajustes sin trazabilidad,
- no borrar diferencias históricas,
- no permitir estados inconsistentes,
- no alterar el stock sin motivo registrado.

---

## 30. Reglas para IA al trabajar con inventario

La IA que genere o modifique este módulo debe:

1. respetar el vínculo con stock,
2. no borrar diferencias históricas,
3. no ocultar ajustes,
4. no usar valores imprecisos para productos por peso,
5. no omitir auditoría,
6. no simplificar demasiado el conteo físico,
7. no romper el flujo entre inventario, ventas y compras,
8. no inventar reglas que el negocio no definió,
9. no eliminar la trazabilidad,
10. no mezclar merma con ajuste sin explicación.

---

## 31. Criterios de aceptación

El módulo de inventario se considera correcto si:

- permite comparar stock real y teórico,
- registra diferencias con claridad,
- corrige stock de forma trazable,
- conserva históricos,
- soporta mermas y vencimientos,
- permite inventarios parciales y totales,
- y ayuda al negocio a controlar pérdidas y orden interno.

---

## 32. Cierre

El inventario es el puente entre lo que el sistema cree y lo que realmente existe en el local.

Si está bien diseñado, el negocio gana control, detecta errores y mejora su rentabilidad.  
Si está mal diseñado, todo el sistema pierde confiabilidad.

Por eso este módulo debe ser preciso, claro y auditable.

**Fin del documento.**