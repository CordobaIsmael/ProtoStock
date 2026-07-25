# CASH.md

## 1. Propósito del documento

Este documento define cómo debe funcionar el módulo de caja del sistema de gestión para una fiambrería y almacén.

Su objetivo es dejar claramente establecido:

- cómo se abre y cierra una caja,
- qué movimientos de dinero se registran,
- cómo se relaciona la caja con las ventas,
- cómo se manejan ingresos, egresos y retiros,
- cómo se calculan diferencias,
- qué permisos se necesitan,
- y qué trazabilidad debe conservar el sistema.

Si existe contradicción entre una implementación y este documento, este documento tiene prioridad.

---

## 2. Objetivo del módulo de caja

El módulo de caja debe permitir controlar el dinero que entra y sale del local de forma clara, ordenada y auditable.

Debe servir para:

- registrar aperturas y cierres,
- saber cuánto dinero debería haber,
- controlar efectivo, transferencias y otros medios de cobro,
- registrar gastos o retiros,
- detectar diferencias de caja,
- y mantener consistencia entre ventas, cobros y dinero físico.

La caja es uno de los puntos más sensibles del sistema y debe ser tratada con especial cuidado.

---

## 3. Principios del módulo

1. Toda operación de caja debe quedar registrada.
2. La caja debe reflejar la realidad operativa del local.
3. Toda diferencia debe poder explicarse.
4. Ningún movimiento importante debe borrarse sin historial.
5. Las ventas deben impactar en caja cuando corresponda.
6. Los egresos deben estar justificados.
7. El cierre de caja debe ser claro y verificable.
8. Los usuarios con permisos limitados no deben poder alterar la caja libremente.
9. El sistema debe mantener trazabilidad completa.
10. La simplicidad operativa no debe destruir el control.

---

## 4. Alcance del módulo

### Incluye

- apertura de caja,
- cierre de caja,
- arqueo,
- movimientos de ingreso,
- movimientos de egreso,
- retiros de efectivo,
- gastos operativos,
- diferencias de cierre,
- relación con ventas,
- relación con medios de pago,
- auditoría,
- reportes de caja,
- historial por usuario o turno.

### No incluye por defecto

- conciliación bancaria automática compleja,
- integración con entidades financieras externas,
- cierres contables avanzados,
- forecast financiero automático,
- sincronización multi sucursal compleja si no se definió previamente.

Estas funciones pueden agregarse más adelante si el negocio lo requiere.

---

## 5. Definición de caja

La caja es el registro operativo del dinero administrado dentro del local durante un período determinado.

Puede organizarse por:

- día,
- turno,
- usuario,
- sucursal si existiera,
- o sesión de trabajo.

La caja debe permitir saber:

- cuánto dinero había al abrir,
- cuánto dinero entró,
- cuánto dinero salió,
- cuánto debería quedar al cierre,
- cuánto dinero se contó realmente,
- y si existe una diferencia.

---

## 6. Ciclo de vida de la caja

Una caja puede pasar por estos estados:

- abierta,
- en revisión,
- cerrada,
- anulada si se permite esa lógica.

### Significado

#### Abierta
La caja está en operación y acepta movimientos.

#### En revisión
El usuario está cerrando o verificando información antes del cierre definitivo.

#### Cerrada
La caja ya no debe modificarse libremente.

#### Anulada
La caja no se considera válida y debe conservarse solo como historial si el sistema lo admite.

---

## 7. Flujo general de caja

El flujo básico del módulo debe ser el siguiente:

1. El usuario abre una caja.
2. Se registra el importe inicial.
3. Durante la jornada se registran ventas y otros movimientos.
4. Se registran gastos o retiros si corresponde.
5. Al final del turno o del día se realiza el cierre.
6. El sistema calcula el dinero esperado.
7. Se ingresa el dinero contado.
8. El sistema calcula la diferencia.
9. Se guarda el cierre con trazabilidad.
10. Se generan los reportes correspondientes.

---

## 8. Datos mínimos de una caja

Toda caja debe guardar, como mínimo:

- identificador único,
- fecha de apertura,
- fecha de cierre si existe,
- usuario que abrió,
- usuario que cerró si corresponde,
- importe inicial,
- importe esperado,
- importe contado,
- diferencia,
- estado,
- observaciones,
- referencia al turno o jornada si aplica,
- auditoría asociada.

---

## 9. Apertura de caja

### 9.1 Objetivo
La apertura de caja marca el inicio de la jornada operativa.

### 9.2 Datos mínimos
- fecha y hora de apertura,
- usuario que abre,
- importe inicial o fondo de cambio,
- observaciones si existen.

### 9.3 Reglas
- No debería existir más de una caja abierta para la misma sesión o usuario si el negocio define esa restricción.
- La apertura debe quedar registrada.
- El fondo inicial debe poder consultarse luego.
- Si la caja se abre con un monto inicial, ese monto debe quedar claro.

---

## 10. Cierre de caja

### 10.1 Objetivo
El cierre de caja resume toda la operatoria del período.

### 10.2 Datos mínimos
- fecha y hora de cierre,
- usuario que cierra,
- importe esperado,
- importe contado,
- diferencia,
- observaciones,
- motivo de diferencia si existe.

### 10.3 Reglas
- La caja no debe cerrarse sin mostrar un resumen.
- El cierre debe incluir ventas, gastos, retiros e ingresos manuales.
- La diferencia debe poder justificarse.
- Una caja cerrada no debe modificarse libremente.
- Si se requiere corrección, debe quedar auditoría.

---

## 11. Movimientos de caja

### 11.1 Tipos de movimientos

El sistema debe contemplar al menos estos tipos:

- ingreso por venta,
- ingreso manual,
- egreso por gasto,
- retiro de efectivo,
- ajuste,
- devolución,
- reintegro,
- movimiento extraordinario.

### 11.2 Reglas
- Todo movimiento debe tener fecha, usuario y monto.
- Todo movimiento debe tener un tipo claramente definido.
- Debe poder asociarse a una referencia si corresponde.
- Los movimientos deben sumar o restar según su naturaleza.

---

## 12. Relación con ventas

La caja debe integrarse con el módulo de ventas.

### Reglas

- Las ventas que se cobran en efectivo deben impactar la caja física.
- Las ventas pagadas con tarjeta, transferencia o QR deben registrarse según la política del negocio.
- Las ventas anuladas deben revertir el impacto si ya se había registrado.
- Las devoluciones pueden impactar la caja si se devuelve dinero al cliente.

### Importante
La caja debe poder distinguir lo que entra en efectivo de lo que no entra físicamente, aunque todo siga siendo un ingreso operativo.

---

## 13. Medios de pago y caja

### 13.1 Medios posibles
- efectivo,
- tarjeta de débito,
- tarjeta de crédito,
- transferencia,
- QR,
- billetera virtual,
- cuenta corriente,
- pago mixto.

### 13.2 Reglas
- El sistema debe registrar por separado el medio de pago utilizado.
- Debe quedar claro qué parte del total afecta caja física y qué parte no.
- El resumen de caja debe mostrar totales por medio de pago.
- Los cobros mixtos deben desglosarse correctamente.

---

## 14. Ingresos manuales

### 14.1 Definición
Un ingreso manual es dinero que entra a la caja sin provenir de una venta normal.

### Ejemplos
- reintegro de un gasto,
- ingreso de cambio,
- aporte de fondo,
- corrección autorizada.

### Reglas
- Todo ingreso manual debe tener motivo.
- Debe registrarse usuario y fecha.
- No debe confundirse con una venta.
- Debe quedar visible en el historial de caja.

---

## 15. Egresos y gastos

### 15.1 Definición
Un egreso es dinero que sale de la caja por un motivo operativo.

### Ejemplos
- pago de insumos,
- gastos menores,
- retiro de dinero,
- reposición de caja chica,
- pago puntual autorizado.

### Reglas
- Todo egreso debe tener motivo.
- Debe registrarse monto, usuario y fecha.
- Debe poder asociarse a una referencia o comprobante si existe.
- Los egresos no deben ocultarse dentro de otros movimientos.

---

## 16. Retiros de efectivo

### 16.1 Definición
Un retiro es dinero sacado de la caja física, normalmente por decisión operativa o administrativa.

### 16.2 Reglas
- El retiro debe registrarse claramente.
- Debe dejar saldo actualizado.
- Debe indicar quién lo hizo y por qué.
- No todos los usuarios deben poder hacerlo.
- Si el negocio lo define, puede requerir autorización adicional.

---

## 17. Diferencias de caja

### 17.1 Definición
La diferencia de caja aparece cuando el dinero esperado no coincide con el dinero contado.

### 17.2 Tipos
- diferencia positiva,
- diferencia negativa,
- sin diferencia.

### 17.3 Reglas
- Toda diferencia debe quedar visible.
- Debe registrarse la causa si se conoce.
- Debe poder analizarse por usuario, turno o fecha.
- Las diferencias recurrentes deben ser detectables en reportes.

### 17.4 Posibles causas
- error de carga,
- cambio mal entregado,
- movimiento no registrado,
- venta anulada mal procesada,
- retiro sin justificar,
- error humano,
- redondeo,
- diferencia operativa.

---

## 18. Arqueo de caja

### 18.1 Definición
El arqueo es la verificación del dinero existente frente a lo esperado.

### 18.2 Reglas
- Debe poder hacerse al cierre o en cualquier momento autorizado.
- El arqueo debe mostrar los totales desglosados.
- Debe dejar evidencia del resultado.
- El arqueo puede usarse para control interno sin cerrar definitivamente la caja.

---

## 19. Resumen de caja

El sistema debe poder mostrar un resumen claro con, al menos:

- importe inicial,
- ventas cobradas,
- ingresos manuales,
- egresos,
- retiros,
- importe esperado,
- importe contado,
- diferencia,
- totales por medio de pago.

El resumen debe servir para que el encargado o dueño entienda la situación de la jornada en segundos.

---

## 20. Relación con usuarios

### 20.1 Usuario que abre
Debe quedar guardado quién abrió la caja.

### 20.2 Usuario que opera
Las ventas y movimientos deben poder vincularse al usuario que los realizó.

### 20.3 Usuario que cierra
Debe quedar guardado quién cerró la caja.

### 20.4 Reglas
- Las acciones de caja siempre deben quedar asociadas a un usuario.
- Si se usa un turno compartido, debe definirse con claridad quién es responsable.
- El historial de caja debe permitir ver qué hizo cada usuario.

---

## 21. Caja por turno o por día

El sistema puede trabajar con caja diaria, por turno o por jornada extendida.

### Reglas
- Debe definirse un criterio único.
- No debe haber ambigüedad sobre qué período controla cada caja.
- Si hay varios turnos, cada uno debe poder cerrarse por separado si el negocio lo requiere.
- Los totales no deben mezclarse entre jornadas distintas sin control.

---

## 22. Caja múltiple o futura multi sucursal

Si el negocio crece, el modelo debe poder soportar:

- más de una caja abierta por sucursal,
- más de una sucursal,
- más de un usuario por jornada,
- cajas independientes por punto de venta.

### Reglas
- Cada caja debe poder identificarse claramente.
- No deben mezclarse los datos de sucursales distintas.
- Las cajas deben quedar separadas por contexto operativo.

---

## 23. Historial de caja

El sistema debe permitir consultar histórico de cajas cerradas.

### Debe poder filtrarse por:
- fecha,
- usuario,
- estado,
- sucursal,
- turno,
- diferencia,
- medio de pago.

### Reglas
- El historial no debe borrarse libremente.
- Las cajas anuladas o corregidas deben seguir apareciendo.
- Debe poder auditarse la evolución de cada caja.

---

## 24. Permisos asociados al módulo de caja

No todos los usuarios deben poder hacer lo mismo.

### Permisos posibles
- abrir caja,
- cerrar caja,
- ver resumen,
- registrar ingreso manual,
- registrar egreso,
- registrar retiro,
- corregir diferencia,
- anular caja,
- consultar histórico,
- exportar caja.

### Reglas
- Las acciones sensibles deben estar restringidas.
- El administrador o encargado puede tener permisos ampliados.
- El cajero debe operar con agilidad, pero dentro de límites claros.

---

## 25. Validaciones obligatorias

Antes de abrir o cerrar caja, el sistema debe validar como mínimo:

- que el usuario tenga permisos,
- que el estado permita la acción,
- que no exista conflicto con otra caja activa si la política lo exige,
- que los importes sean válidos,
- que el cierre tenga resumen completo,
- que las diferencias estén justificadas si corresponde.

---

## 26. Errores y casos de excepción

El sistema debe manejar correctamente estos casos:

- caja ya abierta,
- caja ya cerrada,
- usuario sin permiso,
- importe inválido,
- cierre sin arqueo,
- diferencia sin motivo si es obligatoria,
- venta cargada en caja equivocada,
- movimiento duplicado,
- error de guardado o sincronización.

En todos los casos debe mostrarse un mensaje claro y no perderse la operación realizada.

---

## 27. Reportes derivados de caja

El módulo debe alimentar reportes como:

- cajas abiertas y cerradas,
- resumen diario,
- diferencias por período,
- ingresos por medio de pago,
- egresos por período,
- retiros de efectivo,
- arqueos,
- caja por usuario,
- caja por turno,
- historial de movimientos.

---

## 28. Auditoría de caja

Toda operación importante debe quedar registrada.

### Se audita especialmente:
- apertura,
- cierre,
- ingresos manuales,
- egresos,
- retiros,
- ajustes,
- correcciones,
- anulaciones,
- cambios de estado.

### Datos mínimos
- usuario,
- fecha,
- hora,
- acción,
- monto,
- valor anterior,
- valor nuevo,
- motivo si corresponde.

---

## 29. Integridad de datos

El módulo de caja debe garantizar:

- no perder movimientos,
- no mezclar jornadas,
- no ocultar diferencias,
- no borrar cierres históricos,
- no permitir estados inconsistentes,
- no mover dinero sin registro.

---

## 30. Reglas para IA al trabajar con caja

La IA que genere o modifique este módulo debe:

1. respetar el vínculo con ventas,
2. no ocultar movimientos,
3. no confundir efectivo con otros medios de pago,
4. no usar valores imprecisos,
5. no omitir auditoría,
6. no simplificar tanto que se pierda control,
7. no romper el cierre de caja,
8. no inventar reglas de negocio no definidas,
9. no borrar historial,
10. no mezclar dinero operativo con ajustes sin explicación.

---

## 31. Criterios de aceptación

El módulo de caja se considera correcto si:

- permite abrir y cerrar la caja sin errores,
- registra ingresos y egresos de forma clara,
- refleja correctamente ventas y medios de pago,
- muestra diferencias cuando existen,
- conserva histórico,
- soporta auditoría,
- y ayuda al negocio a controlar el dinero real.

---

## 32. Cierre

La caja es uno de los puntos más delicados del sistema porque conecta ventas, cobros y control de dinero.

Si se diseña bien, da confianza y orden.  
Si se diseña mal, aparecen diferencias, discusiones y pérdida de control.

Por eso este módulo debe ser preciso, claro y totalmente auditable.

**Fin del documento.**