# USERS_ROLES.md

## 1. Propósito del documento

Este documento define cómo debe funcionar el módulo de usuarios, roles y permisos del sistema de gestión para una fiambrería y almacén.

Su objetivo es establecer claramente:

- quién puede acceder al sistema,
- qué puede hacer cada usuario,
- cómo se administran los roles,
- cómo se asignan permisos,
- qué información debe guardarse,
- cómo se protege la operación,
- y qué trazabilidad debe conservar el sistema.

Si existe contradicción entre una implementación y este documento, este documento tiene prioridad.

---

## 2. Objetivo del módulo

El módulo de usuarios, roles y permisos debe garantizar que cada persona que use el sistema tenga acceso solo a lo que necesita para trabajar.

Debe servir para:

- controlar el acceso al sistema,
- limitar acciones sensibles,
- proteger datos críticos,
- asignar responsabilidades,
- auditar acciones,
- y mantener orden operativo.

Un buen control de usuarios evita errores, pérdidas de información y manipulaciones indebidas.

---

## 3. Principios del módulo

1. Cada usuario debe estar identificado de forma única.
2. Cada usuario debe tener un rol claro.
3. Los permisos deben seguir el principio de mínimo privilegio.
4. Toda acción sensible debe quedar auditada.
5. No todos los usuarios deben poder ver o hacer lo mismo.
6. El acceso debe ser simple para operar, pero seguro para administrar.
7. Las credenciales deben protegerse correctamente.
8. Los usuarios inactivos no deben poder iniciar sesión.
9. Los cambios de permisos deben quedar registrados.
10. El sistema debe poder crecer sin perder control.

---

## 4. Alcance del módulo

### Incluye

- alta de usuarios,
- edición de usuarios,
- baja lógica o desactivación,
- inicio y cierre de sesión,
- cambio de contraseña,
- asignación de rol,
- asignación de permisos,
- control de acceso,
- auditoría de acciones,
- recuperación de acceso si se define,
- bloqueo o suspensión de usuarios.

### No incluye por defecto

- identidad federada compleja,
- login con múltiples proveedores externos,
- autenticación biométrica,
- single sign-on empresarial si no está definido,
- administración avanzada de directorio corporativo.

Estas funciones pueden agregarse más adelante si el proyecto lo requiere.

---

## 5. Definición de usuario

Un usuario es una persona autorizada para entrar al sistema y realizar acciones según su rol.

Puede ser, por ejemplo:

- administrador,
- encargado,
- cajero,
- repositor,
- compras,
- consulta,
- soporte técnico si se define.

Cada usuario debe tener una identidad única y una relación clara con las funciones que puede hacer dentro del sistema.

---

## 6. Definición de rol

Un rol es un conjunto de permisos que define qué puede hacer un usuario.

El rol sirve para simplificar la administración.

Ejemplo:
- un cajero no necesita permisos de administración completa,
- un encargado puede ver más información y hacer más acciones,
- un administrador puede manejar todo el sistema.

Los roles ayudan a ordenar accesos sin tener que configurar permiso por permiso para cada persona desde cero.

---

## 7. Definición de permiso

Un permiso es una autorización concreta sobre una acción o módulo específico.

Ejemplos:

- crear producto,
- editar producto,
- eliminar producto,
- crear venta,
- anular venta,
- abrir caja,
- cerrar caja,
- ajustar stock,
- ver reportes,
- administrar usuarios.

Los permisos son la capa más precisa del control de acceso.

---

## 8. Relación entre usuarios, roles y permisos

La relación general debe ser:

- un usuario tiene un rol principal,
- un rol agrupa varios permisos,
- un permiso define una acción concreta,
- el sistema verifica permisos antes de permitir una operación.

### Reglas
- Un usuario no debe poder ejecutar una acción si no tiene permiso.
- El rol debe simplificar la administración.
- Los permisos deben permitir ajustes finos si se necesita más control.
- El administrador puede tener permisos amplios o totales.

---

## 9. Datos mínimos de un usuario

Cada usuario debe guardar, como mínimo:

- identificador único,
- nombre y apellido,
- nombre de usuario,
- email si se usa,
- contraseña hasheada,
- rol principal,
- estado,
- fecha de creación,
- fecha de última modificación,
- último inicio de sesión,
- observaciones opcionales.

### Reglas
- La contraseña nunca debe guardarse en texto plano.
- El nombre de usuario debe ser único.
- El usuario debe poder estar activo o inactivo.
- Un usuario inactivo no debe ingresar al sistema.

---

## 10. Estados de usuario

Un usuario puede tener distintos estados según el diseño del sistema.

### Estados sugeridos
- activo,
- inactivo,
- suspendido,
- bloqueado,
- eliminado lógicamente.

### Significado

#### Activo
Puede iniciar sesión y operar según sus permisos.

#### Inactivo
No puede iniciar sesión.

#### Suspendido
Acceso temporalmente restringido.

#### Bloqueado
Acceso impedido por seguridad, error o política interna.

#### Eliminado lógicamente
El registro queda conservado, pero no se usa operativamente.

---

## 11. Alta de usuarios

### Objetivo
Crear usuarios nuevos para que puedan operar el sistema.

### Reglas
- Todo usuario debe tener nombre claro.
- El nombre de usuario debe ser único.
- Debe asignarse un rol.
- Debe definirse un estado inicial.
- Debe generarse una contraseña segura o proceso de asignación inicial.
- Debe quedar registro de quién creó el usuario.

### Validaciones
- No duplicar nombres de usuario.
- No permitir campos obligatorios vacíos.
- No asignar un rol inexistente.
- No habilitar usuarios sin configuración mínima.

---

## 12. Edición de usuarios

### Se puede editar
- nombre y apellido,
- email,
- rol,
- estado,
- observaciones,
- datos complementarios permitidos.

### Reglas
- Los cambios importantes deben quedar auditados.
- Cambiar el rol puede cambiar permisos automáticamente.
- No se debe perder el historial de acciones previas.
- El sistema debe evitar ediciones inconsistentes.

---

## 13. Baja lógica de usuarios

### Objetivo
Evitar pérdida de trazabilidad.

### Reglas
- No se recomienda eliminar usuarios físicamente.
- Debe usarse desactivación o baja lógica.
- Los usuarios con historial de operaciones deben conservarse.
- Las acciones históricas deben seguir asociadas al usuario original.

---

## 14. Inicio de sesión

### Objetivo
Permitir que el usuario ingrese al sistema de forma segura.

### Reglas
- El usuario debe autenticarse con credenciales válidas.
- Si el usuario está inactivo, no debe entrar.
- Si la contraseña es incorrecta, se debe negar acceso.
- Los intentos fallidos pueden registrarse si el sistema lo define.
- El acceso debe abrir solo las funciones permitidas por su rol.

### Seguridad
- La contraseña debe guardarse con hash seguro.
- Deben evitarse mecanismos inseguros.
- El sistema debe proteger la sesión activa.

---

## 15. Cierre de sesión

### Objetivo
Finalizar la sesión de forma ordenada y segura.

### Reglas
- El cierre debe invalidar la sesión actual.
- Debe registrarse la acción si el sistema lo define.
- El usuario no debe poder seguir usando la sesión cerrada.
- La información temporal no debe quedar expuesta.

---

## 16. Cambio de contraseña

### Objetivo
Permitir renovar credenciales de forma segura.

### Reglas
- La nueva contraseña debe cumplir criterios mínimos de seguridad.
- La contraseña anterior no debe mantenerse visible.
- El cambio debe quedar auditado si corresponde.
- Un usuario no debe poder usar una contraseña insegura si la política del sistema lo impide.

### Recomendaciones
- exigir longitud mínima,
- evitar contraseñas obvias,
- guardar hash seguro,
- permitir recuperación controlada.

---

## 17. Recuperación de acceso

Si el sistema lo contempla, debe existir un proceso seguro de recuperación de contraseña o acceso.

### Reglas
- Debe validar identidad del usuario.
- No debe permitir acceso no autorizado.
- Debe registrarse el proceso si aplica.
- La recuperación debe ser controlada por el negocio o por un mecanismo seguro definido.

---

## 18. Roles sugeridos

El sistema puede contemplar, como base, estos roles:

### 18.1 Administrador
Tiene acceso total o casi total al sistema.

Puede:
- administrar usuarios,
- cambiar roles,
- ver reportes completos,
- modificar configuraciones,
- gestionar productos,
- compras,
- ventas,
- caja,
- inventario,
- auditoría.

### 18.2 Encargado
Tiene acceso amplio de operación y control.

Puede:
- supervisar ventas,
- revisar caja,
- controlar stock,
- ver reportes,
- validar diferencias,
- revisar compras,
- gestionar productos según permisos.

### 18.3 Cajero
Opera ventas y caja de forma limitada.

Puede:
- crear ventas,
- cobrar,
- ver productos necesarios para venta,
- consultar stock básico si se habilita,
- registrar cobros y cierres según permiso.

No debería:
- editar usuarios,
- modificar precios libremente,
- ajustar stock sin permiso,
- borrar datos críticos.

### 18.4 Repositor
Se enfoca en stock, reposición e inventario operativo.

Puede:
- ver productos,
- consultar stock,
- cargar movimientos permitidos,
- revisar vencimientos,
- colaborar con inventario.

### 18.5 Compras
Se enfoca en proveedores, costos y compras.

Puede:
- cargar compras,
- consultar proveedores,
- revisar costos,
- ver stock crítico,
- gestionar ingreso de mercadería.

### 18.6 Consulta
Solo visualiza información permitida.

Puede:
- ver reportes o datos limitados,
- consultar stock,
- revisar listados.

No debería poder modificar información.

### 18.7 Soporte técnico o supervisor especial
Rol opcional para tareas técnicas, mantenimiento o revisión con permisos acotados.

---

## 19. Permisos sugeridos

Los permisos deben ser pequeños, claros y reutilizables.

### 19.1 Permisos de usuarios
- users.view
- users.create
- users.edit
- users.disable
- users.change_role
- users.reset_password
- users.manage_permissions

### 19.2 Permisos de productos
- products.view
- products.create
- products.edit
- products.disable
- products.delete_logical
- products.change_price

### 19.3 Permisos de ventas
- sales.view
- sales.create
- sales.edit_draft
- sales.confirm
- sales.cancel
- sales.refund
- sales.apply_discount

### 19.4 Permisos de compras
- purchases.view
- purchases.create
- purchases.edit_draft
- purchases.confirm
- purchases.cancel

### 19.5 Permisos de caja
- cash.view
- cash.open
- cash.close
- cash.add_income
- cash.add_expense
- cash.withdraw
- cash.adjust

### 19.6 Permisos de stock
- stock.view
- stock.adjust
- stock.inventory
- stock.view_movements

### 19.7 Permisos de reportes
- reports.view_sales
- reports.view_purchases
- reports.view_stock
- reports.view_cash
- reports.view_audit
- reports.export

### 19.8 Permisos de configuración
- settings.view
- settings.edit
- system.manage

---

## 20. Reglas de asignación de permisos

### Reglas generales
- Los permisos deben asignarse por rol por defecto.
- Los permisos individuales pueden agregarse si el proyecto lo permite.
- Un rol no debe tener permisos innecesarios.
- Un usuario no debe tener más acceso del necesario para su tarea.
- Los permisos sensibles deben ser revisados con cuidado.

### Prioridad
- Administrador: máximo acceso.
- Encargado: acceso amplio con control.
- Cajero y repositor: acceso operativo limitado.
- Consulta: acceso solo lectura.

---

## 21. Permisos sensibles

Hay acciones que requieren especial cuidado.

### Ejemplos
- eliminar registros,
- anular ventas,
- ajustar stock,
- cerrar caja,
- cambiar roles,
- ver márgenes,
- ver costos,
- exportar información sensible,
- modificar configuraciones del sistema.

### Reglas
- Estas acciones deben estar restringidas.
- Deben quedar auditadas.
- El sistema puede exigir confirmación adicional.
- Puede requerirse doble validación si el negocio lo decide.

---

## 22. Auditoría de usuarios y permisos

Toda acción importante relacionada con seguridad debe quedar auditada.

### Se audita especialmente:
- alta de usuario,
- edición de usuario,
- baja lógica,
- cambio de rol,
- cambio de permisos,
- bloqueo,
- desbloqueo,
- cambio de contraseña,
- inicio de sesión si se define,
- cierre de sesión si se define,
- intentos fallidos de acceso si se registra.

### Datos mínimos
- usuario afectado,
- usuario que realizó la acción,
- fecha,
- hora,
- acción,
- valor anterior,
- valor nuevo,
- motivo si aplica.

---

## 23. Políticas de seguridad recomendadas

### 23.1 Contraseñas
- Deben guardarse con hash seguro.
- No deben mostrarse en texto plano.
- Debe evitarse el uso de contraseñas triviales.

### 23.2 Sesiones
- Las sesiones deben ser seguras.
- Debe definirse expiración si aplica.
- El cierre debe invalidar el acceso.

### 23.3 Acceso por rol
- Cada usuario debe ver solo lo que necesita.
- No se debe exponer información sensible por error.

### 23.4 Registro de acciones
- Las operaciones críticas deben quedar en auditoría.
- No deben borrarse eventos sensibles libremente.

---

## 24. Validaciones obligatorias

Antes de crear o modificar un usuario, el sistema debe validar como mínimo:

- que el nombre de usuario no esté duplicado,
- que el rol exista,
- que los campos obligatorios estén completos,
- que la contraseña cumpla la política,
- que el estado sea válido,
- que el usuario que realiza la acción tenga permiso.

---

## 25. Casos de excepción

El sistema debe manejar correctamente estos casos:

- usuario inexistente,
- usuario inactivo,
- contraseña incorrecta,
- rol inexistente,
- permiso insuficiente,
- sesión vencida,
- bloqueo por seguridad,
- error al guardar cambios,
- error al asignar permisos.

En todos los casos debe mostrarse un mensaje claro y no comprometer la integridad del sistema.

---

## 26. Relación con otros módulos

El módulo de usuarios, roles y permisos afecta a todo el sistema.

### Impacta en:
- ventas,
- compras,
- caja,
- stock,
- inventario,
- reportes,
- promociones,
- configuración,
- auditoría.

### Regla
Ningún módulo debería ejecutar acciones sensibles sin revisar permisos.

---

## 27. Reglas para IA al trabajar con este módulo

La IA que genere o modifique este módulo debe:

1. respetar el principio de mínimo privilegio,
2. no permitir acceso total por defecto,
3. no guardar contraseñas en texto plano,
4. no omitir auditoría,
5. no mezclar rol con permiso de forma confusa,
6. no dar permisos sensibles sin necesidad,
7. no romper la relación entre usuarios y acciones,
8. no inventar roles que no encajan en el negocio,
9. no simplificar tanto que se pierda seguridad,
10. no modificar accesos sin revisar el impacto en todo el sistema.

---

## 28. Criterios de aceptación

El módulo de usuarios, roles y permisos se considera correcto si:

- cada usuario entra con credenciales seguras,
- cada rol limita correctamente el acceso,
- los permisos sensibles están controlados,
- las acciones importantes quedan auditadas,
- los usuarios inactivos no pueden operar,
- y el sistema mantiene seguridad sin volver el trabajo innecesariamente difícil.

---

## 29. Cierre

Este módulo es la base de la seguridad y del control operativo del sistema.

Si está bien diseñado, cada persona verá solo lo que necesita y el negocio mantendrá orden, trazabilidad y protección.  
Si está mal diseñado, cualquier usuario podría hacer demasiado o demasiado poco.

Por eso esta parte debe tratarse con especial cuidado.

**Fin del documento.**