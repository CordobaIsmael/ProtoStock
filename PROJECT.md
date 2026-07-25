# PROJECT.md

## 1. Nombre del proyecto

**Sistema de gestión para fiambrería y almacén**  
Nombre comercial del local: **[COMPLETAR]**  
Versión del documento: **1.0**  
Estado: **Base inicial para desarrollo asistido por IA**

---

## 2. Propósito del documento

Este archivo define la base funcional, operativa, técnica y conceptual del proyecto.  
Su objetivo es que cualquier persona o sistema de IA pueda entender:

- qué hace el negocio,
- cómo funciona el local,
- qué procesos deben respetarse,
- qué datos debe guardar el sistema,
- qué pantallas y módulos necesita,
- qué reglas de negocio no se pueden romper,
- y cómo debe evolucionar el proyecto a futuro.

Este documento debe ser la fuente principal de contexto para desarrollar el software.

---

## 3. Descripción general del negocio

El negocio es un local físico que vende principalmente **fiambres**, pero también comercializa productos de **almacén** y otros artículos de consumo cotidiano.

El sistema debe contemplar que el local no funciona como una simple fiambrería, sino como un comercio mixto con varias familias de productos, por ejemplo:

- fiambres,
- quesos,
- embutidos,
- lácteos,
- bebidas,
- almacén,
- panificados,
- congelados,
- limpieza,
- perfumería,
- snacks,
- golosinas,
- conservas,
- otros productos de consumo general.

El objetivo del sistema es centralizar la operación completa del local en una sola herramienta, evitando planillas dispersas y permitiendo controlar ventas, stock, compras, caja, vencimientos, precios, clientes, proveedores y rentabilidad.

---

## 4. Visión del proyecto

Construir un sistema de gestión moderno, claro y escalable, pensado para un comercio real, donde el control de mercadería y la agilidad en caja sean prioritarios.

El sistema debe permitir:

- vender rápido,
- controlar el stock en tiempo real,
- registrar compras y proveedores,
- administrar precios y promociones,
- controlar productos por peso y por unidad,
- gestionar vencimientos,
- tener caja diaria,
- consultar reportes y métricas,
- y dejar trazabilidad de cada movimiento.

La aplicación debe ser fácil de usar, visualmente clara, rápida y apta para personal con distintos niveles de experiencia.

---

## 5. Objetivos del proyecto

### Objetivo general

Diseñar e implementar un sistema integral de gestión para una fiambrería y almacén que permita controlar todas las operaciones del local de forma centralizada.

### Objetivos específicos

- Reemplazar planillas manuales o procesos dispersos.
- Tener control confiable del stock.
- Reducir errores en caja y en ventas.
- Mejorar el control de pérdidas, mermas y vencimientos.
- Registrar compras, proveedores y facturas.
- Saber qué productos se venden más y cuáles rotan menos.
- Mejorar la toma de decisiones del dueño o encargado.
- Preparar el sistema para crecer a futuro.
- Dejar una base sólida para que la IA ayude a desarrollar nuevas funciones.

---

## 6. Alcance del proyecto

### Dentro del alcance

El sistema debe cubrir:

- autenticación de usuarios,
- gestión de productos,
- categorías y subcategorías,
- stock,
- compras,
- ventas,
- caja,
- clientes,
- proveedores,
- promociones,
- vencimientos,
- lotes,
- auditoría,
- reportes,
- dashboard,
- y configuración general del local.

### Fuera del alcance inicial

No se considera obligatorio en la primera versión:

- venta online,
- envío a domicilio automatizado,
- app móvil nativa,
- integración fiscal compleja,
- multi sucursal completa,
- logística avanzada,
- marketplace,
- facturación electrónica avanzada si no se define desde el inicio.

Estas funciones pueden agregarse después si el proyecto lo requiere.

---

## 7. Principios de diseño del sistema

El sistema debe construirse con estos principios:

- **Simplicidad primero**: cada pantalla debe ser clara y fácil de entender.
- **Velocidad operativa**: caja y búsqueda de productos deben ser rápidas.
- **Trazabilidad**: todo movimiento importante debe quedar registrado.
- **No perder datos**: ningún dato crítico debe borrarse sin auditoría.
- **Escalabilidad**: el modelo debe permitir crecer.
- **Consistencia**: nombres, reglas y estructuras deben mantenerse estables.
- **Prioridad al negocio real**: el sistema debe adaptarse al local, no al revés.

---

## 8. Descripción del negocio y forma de trabajo

El negocio trabaja con mercadería que puede venderse:

- por unidad,
- por peso,
- por fracción,
- por paquete,
- por caja,
- por kilo,
- por litro,
- o por múltiples unidades de medida según el tipo de producto.

Hay productos que requieren control de:

- vencimiento,
- lote,
- proveedor,
- costo de compra,
- margen,
- rotación,
- y stock mínimo.

La operación del local debe contemplar:

- ventas de mostrador,
- reposición de mercadería,
- control de caja,
- compras a proveedores,
- y seguimiento de mercadería crítica.

---

## 9. Reglas del negocio

Estas reglas son obligatorias y deben respetarse en toda la aplicación.

### 9.1 Reglas generales

- No se debe permitir stock negativo salvo que el negocio lo autorice expresamente.
- Todo movimiento de stock debe quedar registrado.
- Toda venta debe descontar stock.
- Toda compra debe aumentar stock.
- Toda devolución debe generar el movimiento correspondiente.
- Toda anulación debe dejar trazabilidad.
- Ningún dato importante debe borrarse sin registro histórico.
- Toda modificación de precios debe quedar auditada.
- Toda operación sensible debe registrar usuario, fecha y hora.

### 9.2 Reglas sobre productos

- Un producto puede venderse por unidad o por peso.
- Un producto puede tener variantes.
- Un producto puede estar activo o inactivo.
- Un producto inactivo no debe venderse, pero su histórico debe conservarse.
- Los productos deben poder agruparse por categoría y subcategoría.
- Algunos productos requieren control de lote y vencimiento.

### 9.3 Reglas sobre caja

- La caja diaria debe tener apertura y cierre.
- Todo ingreso o egreso manual de dinero debe quedar registrado.
- Toda diferencia de caja debe poder explicarse.
- La caja debe poder asociarse al usuario o turno correspondiente.

### 9.4 Reglas sobre usuarios

- Cada usuario debe tener un rol definido.
- Los permisos deben limitar acciones críticas.
- No todos los usuarios deben poder borrar, editar precios o cerrar caja.
- Las acciones sensibles deben quedar auditadas.

---

## 10. Glosario del negocio

### Producto
Artículo que se vende en el local.

### Categoría
Agrupación general de productos.

### Subcategoría
Agrupación más específica dentro de una categoría.

### Stock
Cantidad disponible de un producto en el sistema.

### Merma
Pérdida de mercadería por rotura, vencimiento, error o manipulación.

### Lote
Conjunto de mercadería recibido en una misma compra o tanda.

### Vencimiento
Fecha límite de consumo o venta del producto.

### Caja
Registro de ingresos, egresos, ventas y cierres del dinero del local.

### Proveedor
Empresa o persona que vende mercadería al local.

### Cliente
Persona que compra en el local, con o sin registro.

### Promoción
Regla comercial aplicada al precio o al conjunto de productos.

### Auditoría
Registro histórico de acciones realizadas en el sistema.

---

## 11. Módulos principales del sistema

El sistema debe dividirse en módulos claramente separados.

### 11.1 Autenticación y usuarios
- inicio de sesión,
- cierre de sesión,
- recuperación de acceso si aplica,
- gestión de roles,
- permisos por acción.

### 11.2 Productos
- alta,
- edición,
- baja lógica,
- búsqueda,
- listado,
- códigos de barras,
- unidades de medida,
- precios,
- stock mínimo,
- imágenes,
- estado activo/inactivo.

### 11.3 Categorías
- crear categorías,
- editar,
- ordenar,
- activar/inactivar.

### 11.4 Subcategorías
- asociadas a una categoría,
- para organizar mejor el catálogo.

### 11.5 Stock
- entradas,
- salidas,
- ajustes,
- merma,
- inventario,
- transferencias internas si existieran.

### 11.6 Ventas
- ticket de venta,
- carrito de productos,
- medios de pago,
- descuentos,
- devoluciones,
- anulaciones.

### 11.7 Compras
- carga de facturas de proveedores,
- ingreso de mercadería,
- costos,
- cantidades,
- control de saldo si se utiliza.

### 11.8 Caja
- apertura,
- cierre,
- resumen diario,
- retiros,
- ingresos manuales,
- diferencias.

### 11.9 Proveedores
- alta,
- edición,
- historial,
- condiciones de compra.

### 11.10 Clientes
- historial,
- cuentas corrientes si aplica,
- identificación básica.

### 11.11 Promociones
- descuentos por cantidad,
- precio especial,
- combos,
- ofertas temporales.

### 11.12 Vencimientos y lotes
- control por lote,
- alertas de vencimiento,
- productos próximos a vencer,
- trazabilidad.

### 11.13 Reportes
- ventas,
- stock,
- compras,
- caja,
- rentabilidad,
- productos críticos,
- rotación,
- vencimientos.

### 11.14 Dashboard
- indicadores principales,
- métricas del día,
- tendencias,
- alertas.

### 11.15 Auditoría
- registro de cambios,
- historial por usuario,
- historial por producto,
- historial por venta,
- historial por compra.

---

## 12. Catálogo de productos

### 12.1 Tipos de productos

El sistema debe contemplar distintos tipos de productos:

- productos por unidad,
- productos por peso,
- productos fraccionados,
- productos por caja,
- productos por pack,
- productos con volumen,
- productos con vencimiento,
- productos sin vencimiento,
- productos con lote,
- productos sin lote.

### 12.2 Datos mínimos de cada producto

Cada producto debe poder almacenar como mínimo:

- id interno,
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
- margen,
- stock actual,
- stock mínimo,
- stock máximo opcional,
- proveedor principal,
- vencimiento requerido o no,
- lote requerido o no,
- estado,
- imagen opcional,
- fecha de alta,
- fecha de última modificación.

### 12.3 Unidades de medida

El sistema debe contemplar al menos:

- unidad,
- kilogramo,
- gramo,
- litro,
- mililitro,
- paquete,
- caja,
- bandeja,
- fracción.

### 12.4 Productos de fiambrería

Ejemplos:

- jamón cocido,
- jamón crudo,
- salame,
- mortadela,
- queso cremoso,
- queso tybo,
- queso pategrás,
- queso mozzarella,
- queso azul,
- panceta,
- bondiola,
- aceitunas,
- fiambres especiales.

Estos productos suelen requerir:

- venta por peso,
- control de margen,
- control de proveedor,
- posible vencimiento,
- y trazabilidad por lote.

### 12.5 Productos de almacén

Ejemplos:

- arroz,
- fideos,
- harina,
- aceite,
- azúcar,
- yerba,
- gaseosas,
- agua,
- leche,
- galletitas,
- snacks,
- conservas,
- atún,
- salsa,
- condimentos.

Estos productos suelen venderse por unidad o envase.

---

## 13. Categorías sugeridas

Las categorías deben poder configurarse, pero el sistema debería contemplar una estructura inicial como esta:

- Fiambres
- Quesos
- Embutidos
- Lácteos
- Bebidas
- Almacén
- Panificados
- Congelados
- Limpieza
- Perfumería
- Snacks
- Golosinas
- Conservas
- Verdulería opcional
- Productos especiales
- Otros

Cada categoría puede tener subcategorías si el negocio lo necesita.

---

## 14. Proveedores

### 14.1 Datos del proveedor

Cada proveedor debe tener:

- razón social,
- nombre comercial,
- CUIT o identificador fiscal si aplica,
- teléfono,
- email,
- dirección,
- localidad,
- condición fiscal,
- observaciones,
- productos que suele vender,
- estado activo/inactivo.

### 14.2 Funciones sobre proveedores

- alta,
- edición,
- baja lógica,
- historial de compras,
- productos asociados,
- condiciones comerciales,
- contacto rápido.

### 14.3 Reglas

- Cada compra debe poder asociarse a un proveedor.
- Debe poder identificarse el proveedor principal por producto.
- El sistema debe guardar historial de precios de compra si se define.

---

## 15. Compras

### 15.1 Objetivo

Registrar el ingreso de mercadería al local y actualizar stock, costos y trazabilidad.

### 15.2 Información mínima de una compra

- proveedor,
- fecha,
- número de comprobante,
- productos comprados,
- cantidades,
- costo unitario,
- subtotal,
- impuestos si aplican,
- total,
- observaciones,
- usuario que registró la compra.

### 15.3 Flujo general

1. Se selecciona proveedor.
2. Se carga la compra.
3. Se agregan productos y cantidades.
4. Se registran costos.
5. Se confirma la operación.
6. El stock se actualiza.
7. Se guarda la trazabilidad.

### 15.4 Reglas

- Una compra confirmada debe impactar stock.
- Debe poder editarse con trazabilidad si se permite.
- Debe registrarse el costo histórico.
- El sistema debe permitir revisar compras anteriores.

---

## 16. Ventas

### 16.1 Objetivo

Registrar ventas de forma rápida y confiable, minimizando errores de carga.

### 16.2 Tipos de venta

- venta en mostrador,
- venta de caja,
- venta al contado,
- venta con tarjeta,
- transferencia,
- QR,
- mixto,
- cuenta corriente si se habilita.

### 16.3 Información mínima de una venta

- fecha y hora,
- usuario,
- productos vendidos,
- cantidades,
- precio unitario,
- descuentos,
- impuestos si aplican,
- total,
- medio de pago,
- estado de la venta,
- observaciones.

### 16.4 Reglas de venta

- Toda venta debe descontar stock.
- Toda venta debe quedar asociada a un usuario.
- Toda venta debe dejar comprobante o ticket interno.
- Toda anulación debe quedar registrada.
- Toda devolución debe revertir el stock si corresponde.
- Los productos por peso deben registrar peso real o estimado según el caso.

### 16.5 Venta por peso

En los productos por peso el sistema debe permitir:

- cargar kilos exactos,
- redondear según regla configurada,
- calcular total automáticamente,
- registrar precio por kilo,
- mostrar subtotal con claridad.

### 16.6 Venta por unidad

El sistema debe permitir:

- agregar cantidad,
- modificar cantidad,
- aplicar descuento,
- ver total parcial y total final.

---

## 17. Caja

### 17.1 Objetivo

Controlar el dinero físico y los movimientos de efectivo del local.

### 17.2 Funciones mínimas

- apertura de caja,
- cierre de caja,
- ingresos manuales,
- retiros,
- arqueo,
- diferencia entre esperado y real,
- resumen por usuario o turno.

### 17.3 Registros de caja

- efectivo inicial,
- efectivo final,
- ventas por medio de pago,
- gastos,
- retiros,
- ingresos,
- diferencias.

### 17.4 Reglas

- La caja debe poder abrirse y cerrarse por día o turno.
- El cierre debe mostrar totales claros.
- Toda diferencia debe quedar registrada.
- Ningún movimiento de caja debe perderse.
- Los movimientos deben tener motivo.

---

## 18. Clientes

### 18.1 Tipos de cliente

- cliente ocasional,
- cliente frecuente,
- cliente registrado,
- cliente con cuenta corriente si aplica,
- cliente mayorista si aplica.

### 18.2 Datos del cliente

- nombre y apellido o razón social,
- teléfono,
- email opcional,
- dirección opcional,
- observaciones,
- estado,
- historial de compras.

### 18.3 Reglas

- El sistema no debe exigir cliente para una venta simple salvo que el negocio lo requiera.
- El cliente puede ser útil para historial, deudas o promociones.
- La cuenta corriente debe ser opcional y controlada.

---

## 19. Promociones y descuentos

### 19.1 Tipos de promociones

- descuento porcentual,
- precio fijo,
- 2x1,
- 3x2,
- combos,
- ofertas por cantidad,
- promociones por categoría,
- promociones por producto,
- promociones por día o franja horaria.

### 19.2 Reglas

- Toda promoción debe poder configurarse con fecha de inicio y fin.
- Debe poder activarse o desactivarse.
- El sistema debe mostrar claramente cuándo una promoción está aplicada.
- Las promociones no deben romper el stock ni el cálculo de caja.

---

## 20. Stock e inventario

### 20.1 Objetivo

Tener control exacto de la mercadería disponible.

### 20.2 Movimientos de stock

- ingreso por compra,
- salida por venta,
- ajuste positivo,
- ajuste negativo,
- merma,
- vencimiento,
- devolución,
- inventario físico.

### 20.3 Reglas de stock

- Todo movimiento debe guardar fecha, usuario y motivo.
- El stock actual debe ser confiable.
- Debe existir historial de cambios.
- El sistema debe poder mostrar stock mínimo y alertas.
- Debe ser posible revisar productos sin rotación.

### 20.4 Inventario físico

El sistema debe permitir comparar:

- stock teórico,
- stock contado,
- diferencia,
- motivo de ajuste,
- usuario responsable.

---

## 21. Vencimientos y lotes

### 21.1 Objetivo

Controlar productos perecederos y evitar pérdidas.

### 21.2 Datos mínimos

- lote,
- fecha de ingreso,
- fecha de vencimiento,
- proveedor,
- cantidad,
- ubicación opcional,
- observaciones.

### 21.3 Reglas

- Los productos vencibles deben poder configurarse con control obligatorio de vencimiento.
- El sistema debe poder mostrar productos próximos a vencer.
- Debe poder filtrar por vencimiento.
- Debe poder marcar productos vencidos.
- Debe poder registrar merma por vencimiento.

---

## 22. Balanza y productos por peso

### 22.1 Objetivo

Soportar venta de productos que se pesan en el momento.

### 22.2 Funcionalidad esperada

- cargar peso manualmente,
- compatibilidad futura con balanza,
- cálculo automático del total,
- impresión de etiqueta si aplica,
- identificación del producto por código o nombre.

### 22.3 Reglas

- El sistema debe contemplar redondeos.
- Debe poder trabajar con gramos o kilos según configuración.
- Debe poder registrar el precio por kilo o por unidad equivalente.

---

## 23. Caja y medios de pago

### 23.1 Medios de pago posibles

- efectivo,
- tarjeta de débito,
- tarjeta de crédito,
- transferencia,
- QR,
- billetera virtual,
- cuenta corriente,
- mixto.

### 23.2 Reglas

- Cada medio de pago debe quedar registrado.
- El sistema debe poder sumar por forma de cobro.
- Debe ser posible conocer el mix de pagos del día.
- Debe quedar claro cuánto dinero entra a caja física y cuánto no.

---

## 24. Reportes

El sistema debe generar reportes útiles para decidir mejor.

### 24.1 Reportes básicos

- ventas del día,
- ventas del mes,
- ventas por rango de fechas,
- stock actual,
- productos con bajo stock,
- productos próximos a vencer,
- compras por proveedor,
- caja diaria,
- diferencias de caja,
- productos más vendidos,
- productos menos vendidos.

### 24.2 Reportes analíticos

- margen bruto,
- rentabilidad estimada,
- productos de mayor rotación,
- productos de baja rotación,
- familias más rentables,
- comportamiento por día de la semana,
- horarios de mayor venta,
- ticket promedio,
- cantidad promedio por venta,
- medios de pago más usados.

### 24.3 Reportes operativos

- listado de precios,
- stock por categoría,
- movimientos de mercadería,
- inventario físico,
- historial de cambios,
- auditoría de usuarios.

---

## 25. Dashboard principal

El dashboard debe resumir la situación del negocio en una sola pantalla.

### 25.1 Indicadores sugeridos

- ventas de hoy,
- ventas del mes,
- cantidad de tickets,
- ticket promedio,
- ganancia estimada,
- caja actual,
- stock crítico,
- productos próximos a vencer,
- top productos,
- top categorías,
- alertas importantes.

### 25.2 Objetivo del dashboard

Que el dueño o encargado pueda entender en segundos:

- cómo está el negocio,
- qué se vendió,
- qué falta reponer,
- qué está por vencer,
- y si la caja está en orden.

---

## 26. Usuarios y permisos

### 26.1 Roles sugeridos

- administrador,
- encargado,
- cajero,
- repositor,
- compras,
- consulta,
- soporte técnico si aplica.

### 26.2 Permisos posibles

- ver productos,
- crear productos,
- editar productos,
- borrar lógicamente productos,
- ver stock,
- ajustar stock,
- registrar ventas,
- anular ventas,
- abrir/cerrar caja,
- registrar compras,
- administrar usuarios,
- ver reportes,
- exportar datos,
- acceder a auditoría.

### 26.3 Reglas

- El administrador tiene acceso total.
- Los demás usuarios deben ver solo lo necesario.
- Las acciones críticas deben quedar registradas con usuario.

---

## 27. Auditoría y trazabilidad

### 27.1 Qué debe auditarse

- cambios de precios,
- cambios en stock,
- ventas,
- anulaciones,
- devoluciones,
- compras,
- ajustes manuales,
- cambios de usuario,
- cambios de rol,
- cierres de caja,
- modificaciones de productos.

### 27.2 Datos mínimos de auditoría

- usuario,
- fecha,
- hora,
- acción realizada,
- entidad afectada,
- valor anterior,
- valor nuevo,
- motivo si aplica.

---

## 28. Requisitos funcionales

El sistema debe permitir:

- iniciar y cerrar sesión,
- administrar productos,
- administrar categorías,
- administrar proveedores,
- administrar clientes,
- registrar compras,
- registrar ventas,
- controlar caja,
- controlar stock,
- controlar vencimientos,
- gestionar promociones,
- consultar reportes,
- exportar información,
- y conservar historial.

---

## 29. Requisitos no funcionales

### 29.1 Usabilidad
El sistema debe ser fácil de aprender y rápido de usar.

### 29.2 Rendimiento
La búsqueda de productos y la carga de ventas deben ser ágiles.

### 29.3 Seguridad
Los permisos deben limitar acciones sensibles y proteger la información.

### 29.4 Escalabilidad
La arquitectura debe permitir crecer sin rehacer el sistema desde cero.

### 29.5 Mantenibilidad
El código y la documentación deben mantenerse claros y ordenados.

### 29.6 Confiabilidad
Los datos no deben perderse y deben poder respaldarse.

---

## 30. Base de datos

La base de datos debe modelarse de forma relacional y normalizada.

### Entidades principales sugeridas

- usuarios,
- roles,
- permisos,
- productos,
- categorías,
- subcategorías,
- proveedores,
- clientes,
- compras,
- compras_detalle,
- ventas,
- ventas_detalle,
- caja,
- caja_movimientos,
- stock_movimientos,
- lotes,
- vencimientos,
- promociones,
- auditoria,
- configuraciones.

### Reglas generales de modelado

- usar identificadores únicos,
- evitar duplicación innecesaria,
- guardar fechas de creación y actualización,
- conservar histórico de cambios,
- usar relaciones claras entre tablas.

---

## 31. Arquitectura sugerida

### Frontend
Aplicación web responsive.

### Backend
API central para lógica de negocio.

### Base de datos
Base relacional para integridad y trazabilidad.

### Capas lógicas
- presentación,
- servicios,
- reglas de negocio,
- acceso a datos,
- auditoría,
- reportes.

### Consideraciones
El sistema debe estar preparado para:
- crecer por módulos,
- agregar nuevas pantallas,
- sumar integraciones futuras,
- y mantener orden en el código.

---

## 32. Tecnologías sugeridas

La selección final puede variar, pero una base razonable sería:

### Backend
- Node.js
- Express o NestJS
- Prisma u ORM equivalente

### Frontend
- React
- Next.js o Vite
- Tailwind CSS
- componentes reutilizables

### Base de datos
- PostgreSQL

### Otros
- autenticación por token,
- exportación a Excel,
- gráficos y paneles,
- logs y auditoría,
- backups automáticos.

---

## 33. Convenciones del proyecto

### Nombres
- usar nombres consistentes,
- evitar siglas confusas,
- mantener un idioma principal en el código y en la documentación.

### Fechas
- guardar fecha y hora en formato estándar,
- usar zona horaria definida.

### Precios
- guardar los valores numéricos con precisión,
- evitar errores de redondeo.

### Estados
Cada entidad importante debe poder tener estado:
- activo,
- inactivo,
- eliminado lógicamente,
- vencido,
- pendiente,
- confirmado,
- anulado.

---

## 34. Reglas para trabajar con IA

Este proyecto está pensado para ser desarrollado con ayuda intensiva de IA.  
Por eso, la IA debe seguir estas reglas:

### 34.1 Entender el contexto antes de generar código
Antes de escribir o modificar una parte del sistema, la IA debe revisar:
- el objetivo del módulo,
- las reglas de negocio,
- las entidades involucradas,
- y el impacto en otras partes del proyecto.

### 34.2 No inventar reglas
Si una regla de negocio no está definida, la IA debe:
- proponer una opción,
- dejar constancia de la suposición,
- y no asumir que es obligatoria.

### 34.3 No romper compatibilidad
Si ya existe una estructura, la IA debe:
- respetarla,
- ampliarla,
- y no destruir lo que ya está funcionando.

### 34.4 Priorizar claridad
El código generado debe ser:
- legible,
- mantenible,
- modular,
- y fácil de entender.

### 34.5 Documentar cambios
Cada cambio importante debe dejar:
- resumen,
- motivo,
- archivos afectados,
- posibles impactos.

---

## 35. Roadmap del proyecto

### Fase 1
- login,
- productos,
- categorías,
- stock básico,
- ventas simples,
- caja básica.

### Fase 2
- compras,
- proveedores,
- clientes,
- reportes básicos,
- auditoría.

### Fase 3
- promociones,
- vencimientos,
- lotes,
- inventario físico,
- dashboard avanzado.

### Fase 4
- optimización,
- exportaciones,
- mejoras visuales,
- automatizaciones,
- futuras integraciones.

### Fase 5
- multi sucursal,
- integración con balanza,
- integración fiscal,
- app móvil,
- analítica avanzada.

---

## 36. Casos de uso clave

### Caso de uso: vender un producto
1. El usuario busca el producto.
2. El sistema muestra precio y stock.
3. El usuario agrega cantidad.
4. El sistema calcula total.
5. Se confirma el medio de pago.
6. Se guarda la venta.
7. Se descuenta stock.
8. Se registra auditoría.

### Caso de uso: cargar una compra
1. El usuario selecciona proveedor.
2. Carga productos y cantidades.
3. Registra costos.
4. Confirma la compra.
5. El stock se actualiza.
6. Se guarda el historial.

### Caso de uso: cierre de caja
1. El usuario abre el módulo de caja.
2. El sistema muestra totales del día.
3. Se ingresa efectivo real.
4. Se comparan valores.
5. Se registra diferencia si existe.
6. Se cierra la caja.

---

## 37. Criterios de calidad esperados

El sistema debe ser considerado correcto si:

- permite operar el local de forma real,
- no complica el trabajo diario,
- mantiene los datos ordenados,
- controla el stock correctamente,
- refleja ventas y caja de forma confiable,
- y ayuda a tomar mejores decisiones.

---

## 38. Siguiente paso recomendado

Este `PROJECT.md` debe ser la base para crear luego documentos más específicos:

- `BUSINESS_RULES.md`
- `DATABASE.md`
- `PRODUCTS.md`
- `SALES.md`
- `PURCHASES.md`
- `INVENTORY.md`
- `ROLES_PERMISSIONS.md`
- `UI_GUIDE.md`
- `ROADMAP.md`

Cada uno puede profundizar una parte del negocio sin perder contexto.

---

## 39. Cierre

Este proyecto busca convertir la operación diaria de una fiambrería y almacén en un sistema organizado, claro y escalable.

La prioridad no es solo “hacer que funcione”, sino construir una base sólida para que el negocio pueda crecer con orden, control y trazabilidad.

**Fin del documento base.**