# DATABASE.md

## 1. Propósito del documento

Este documento define la estructura de base de datos del sistema de gestión para una fiambrería y almacén.

Su objetivo es dejar claro:

- qué entidades existen,
- cómo se relacionan,
- qué datos debe guardar cada una,
- qué reglas de integridad deben respetarse,
- qué campos son obligatorios,
- qué campos son opcionales,
- qué datos deben auditarse,
- y cómo debe modelarse el negocio para que el sistema sea estable, escalable y mantenible.

Este documento debe ser usado como base para diseñar la base de datos real del proyecto.

---

## 2. Principios de diseño de la base de datos

La base de datos debe construirse siguiendo estos principios:

1. **Consistencia antes que comodidad**.  
   Los datos deben ser confiables incluso si eso obliga a validar más.

2. **Trazabilidad completa**.  
   Toda operación importante debe poder reconstruirse luego.

3. **Eliminación lógica por defecto**.  
   Los registros críticos no deben borrarse físicamente.

4. **Relaciones claras**.  
   Cada tabla debe tener una función concreta y una relación entendible con las demás.

5. **Evitar duplicación innecesaria**.  
   No guardar el mismo dato en demasiadas tablas si puede derivarse.

6. **Escalabilidad**.  
   El modelo debe permitir sumar módulos futuros sin rehacer todo.

7. **Auditoría de cambios sensibles**.  
   Cambios en precios, stock, caja y usuarios deben quedar registrados.

8. **Compatibilidad con reportes**.  
   La estructura debe facilitar consultas analíticas y operativas.

---

## 3. Motor de base de datos recomendado

Se recomienda usar una base relacional, idealmente **PostgreSQL**.

Razones:

- integridad relacional sólida,
- buen soporte para índices,
- excelente manejo de UUID,
- consultas complejas robustas,
- soporte para auditoría y reportes,
- escalabilidad adecuada para un comercio real.

---

## 4. Convenciones generales

### 4.1 Claves primarias

Todas las tablas principales deberían usar una clave primaria técnica:

- `id UUID` como identificador principal.

### 4.2 Fechas y horas

Guardar todas las fechas importantes con hora completa cuando aplique:

- `createdAt`
- `updatedAt`
- `deletedAt` si se usa baja lógica
- `eventDate` o nombre específico según entidad

### 4.3 Eliminación lógica

Siempre que sea posible, usar:

- `isActive BOOLEAN`
- `deletedAt TIMESTAMP NULL`
- `deletedBy UUID NULL`

para no perder trazabilidad.

### 4.4 Normalización

La base debe estar al menos en un nivel razonable de normalización:

- evitar repetir proveedores, categorías o usuarios en texto libre,
- usar relaciones por id,
- almacenar histórico cuando el negocio lo requiera.

### 4.5 Moneda y valores numéricos

Los importes monetarios deben guardarse con precisión decimal, nunca en punto flotante.

Sugerencia:

- `NUMERIC(12,2)` para importes generales,
- `NUMERIC(14,4)` si se necesita más precisión en costos,
- `NUMERIC(10,3)` o similar para pesos/cantidades fraccionadas.

### 4.6 Nombres de tablas

Usar nombres claros, consistentes y preferentemente en plural o en singular, pero nunca mezclados.

Ejemplo recomendado para este proyecto:

- `users`
- `roles`
- `permissions`
- `products`
- `categories`
- `suppliers`
- `customers`
- `sales`
- `sale_items`
- `purchases`
- `purchase_items`
- `stock_movements`
- `cash_registers`
- `cash_movements`
- `lots`
- `expirations`
- `promotions`
- `audit_logs`

### 4.7 Nombres de columnas

Usar nombres descriptivos y consistentes.

Ejemplos:

- `createdAt`
- `updatedAt`
- `deletedAt`
- `isActive`
- `unitPrice`
- `salePrice`
- `purchasePrice`
- `currentStock`
- `minimumStock`

---

## 5. Entidades principales

La base de datos debe contemplar, como mínimo, estas entidades:

- usuarios,
- roles,
- permisos,
- productos,
- categorías,
- subcategorías,
- proveedores,
- clientes,
- compras,
- detalle de compras,
- ventas,
- detalle de ventas,
- caja,
- movimientos de caja,
- stock,
- movimientos de stock,
- lotes,
- vencimientos,
- promociones,
- auditoría,
- configuraciones generales del sistema.

---

## 6. Modelo conceptual general

La lógica general del sistema es la siguiente:

- los **productos** pertenecen a **categorías** y opcionalmente a **subcategorías**,
- los **productos** pueden comprarse a **proveedores**,
- las **compras** generan ingreso de stock,
- las **ventas** generan salida de stock,
- la **caja** registra los movimientos de dinero asociados a ventas, egresos e ingresos manuales,
- los **lotes** y **vencimientos** permiten controlar mercadería perecedera,
- la **auditoría** registra acciones sensibles,
- los **usuarios** tienen roles y permisos.

---

## 7. Tablas de seguridad y acceso

### 7.1 `users`

Tabla de usuarios del sistema.

#### Campos sugeridos

- `id UUID PRIMARY KEY`
- `fullName TEXT NOT NULL`
- `username TEXT NOT NULL UNIQUE`
- `email TEXT NULL UNIQUE`
- `passwordHash TEXT NOT NULL`
- `roleId UUID NOT NULL`
- `isActive BOOLEAN NOT NULL DEFAULT TRUE`
- `lastLoginAt TIMESTAMP NULL`
- `createdAt TIMESTAMP NOT NULL`
- `updatedAt TIMESTAMP NOT NULL`
- `deletedAt TIMESTAMP NULL`

#### Reglas

- El usuario no debe guardar la contraseña en texto plano.
- `passwordHash` debe contener un hash seguro.
- Un usuario inactivo no debe poder iniciar sesión.
- El nombre de usuario debe ser único.

---

### 7.2 `roles`

Tabla de roles.

#### Campos sugeridos

- `id UUID PRIMARY KEY`
- `name TEXT NOT NULL UNIQUE`
- `description TEXT NULL`
- `isActive BOOLEAN NOT NULL DEFAULT TRUE`
- `createdAt TIMESTAMP NOT NULL`
- `updatedAt TIMESTAMP NOT NULL`
- `deletedAt TIMESTAMP NULL`

#### Ejemplos de roles

- administrador,
- encargado,
- cajero,
- repositor,
- compras,
- consulta.

---

### 7.3 `permissions`

Tabla de permisos.

#### Campos sugeridos

- `id UUID PRIMARY KEY`
- `key TEXT NOT NULL UNIQUE`
- `name TEXT NOT NULL`
- `description TEXT NULL`
- `module TEXT NULL`
- `isActive BOOLEAN NOT NULL DEFAULT TRUE`
- `createdAt TIMESTAMP NOT NULL`
- `updatedAt TIMESTAMP NOT NULL`

#### Ejemplos de permisos

- `products.create`
- `products.edit`
- `products.delete`
- `sales.create`
- `sales.cancel`
- `cash.close`
- `stock.adjust`
- `users.manage`
- `reports.view`

---

### 7.4 `role_permissions`

Tabla puente entre roles y permisos.

#### Campos sugeridos

- `id UUID PRIMARY KEY`
- `roleId UUID NOT NULL`
- `permissionId UUID NOT NULL`
- `createdAt TIMESTAMP NOT NULL`

#### Restricciones

- `UNIQUE(roleId, permissionId)`

---

## 8. Tablas de catálogo de productos

### 8.1 `categories`

Tabla de categorías generales.

#### Campos sugeridos

- `id UUID PRIMARY KEY`
- `name TEXT NOT NULL UNIQUE`
- `description TEXT NULL`
- `sortOrder INT NOT NULL DEFAULT 0`
- `isActive BOOLEAN NOT NULL DEFAULT TRUE`
- `createdAt TIMESTAMP NOT NULL`
- `updatedAt TIMESTAMP NOT NULL`
- `deletedAt TIMESTAMP NULL`

#### Reglas

- Toda categoría debe tener un nombre claro.
- No deben existir duplicados activos con el mismo nombre.

---

### 8.2 `subcategories`

Tabla de subcategorías.

#### Campos sugeridos

- `id UUID PRIMARY KEY`
- `categoryId UUID NOT NULL`
- `name TEXT NOT NULL`
- `description TEXT NULL`
- `sortOrder INT NOT NULL DEFAULT 0`
- `isActive BOOLEAN NOT NULL DEFAULT TRUE`
- `createdAt TIMESTAMP NOT NULL`
- `updatedAt TIMESTAMP NOT NULL`
- `deletedAt TIMESTAMP NULL`

#### Restricciones

- `UNIQUE(categoryId, name)`

---

### 8.3 `units`

Tabla opcional para unidades de medida.

#### Campos sugeridos

- `id UUID PRIMARY KEY`
- `code TEXT NOT NULL UNIQUE`
- `name TEXT NOT NULL`
- `description TEXT NULL`
- `isActive BOOLEAN NOT NULL DEFAULT TRUE`

#### Ejemplos

- unidad,
- kg,
- g,
- litro,
- ml,
- pack,
- caja.

---

### 8.4 `products`

Tabla principal de productos.

#### Campos sugeridos

- `id UUID PRIMARY KEY`
- `internalCode TEXT NULL UNIQUE`
- `barcode TEXT NULL UNIQUE`
- `name TEXT NOT NULL`
- `description TEXT NULL`
- `brand TEXT NULL`
- `categoryId UUID NOT NULL`
- `subcategoryId UUID NULL`
- `unitId UUID NULL`
- `productType TEXT NOT NULL`
- `saleMode TEXT NOT NULL`
- `purchasePrice NUMERIC(14,4) NOT NULL DEFAULT 0`
- `salePrice NUMERIC(14,4) NOT NULL DEFAULT 0`
- `lastCost NUMERIC(14,4) NULL`
- `marginPercent NUMERIC(8,2) NULL`
- `currentStock NUMERIC(14,3) NOT NULL DEFAULT 0`
- `minimumStock NUMERIC(14,3) NOT NULL DEFAULT 0`
- `maximumStock NUMERIC(14,3) NULL`
- `requiresLot BOOLEAN NOT NULL DEFAULT FALSE`
- `requiresExpiration BOOLEAN NOT NULL DEFAULT FALSE`
- `trackSerial BOOLEAN NOT NULL DEFAULT FALSE`
- `supplierId UUID NULL`
- `isActive BOOLEAN NOT NULL DEFAULT TRUE`
- `imageUrl TEXT NULL`
- `notes TEXT NULL`
- `createdBy UUID NULL`
- `updatedBy UUID NULL`
- `createdAt TIMESTAMP NOT NULL`
- `updatedAt TIMESTAMP NOT NULL`
- `deletedAt TIMESTAMP NULL`

#### Campos importantes explicados

- `internalCode`: código interno del negocio.
- `barcode`: código de barras, si existe.
- `productType`: tipo general del producto.
- `saleMode`: forma de venta, por ejemplo:
  - `unit`
  - `weight`
  - `fraction`
  - `pack`
  - `box`
- `purchasePrice`: costo de compra.
- `salePrice`: precio de venta.
- `currentStock`: stock actual.
- `minimumStock`: stock mínimo deseado.

#### Reglas

- Un producto activo debe tener nombre.
- No deben existir duplicados activos con el mismo `barcode`.
- El stock actual debe reflejar el estado real del sistema.
- Si el producto tiene `requiresExpiration = true`, debe manejarse vencimiento.
- Si el producto tiene `requiresLot = true`, debe existir lote asociado en compras o ingresos.

---

### 8.5 `product_variants` o `product_prices_history` si se usa

Si el negocio maneja variantes o historial separado, se recomienda una tabla adicional según la necesidad real.

#### Opción A: variantes

- `id UUID PRIMARY KEY`
- `productId UUID NOT NULL`
- `name TEXT NOT NULL`
- `barcode TEXT NULL`
- `salePrice NUMERIC(14,4) NOT NULL DEFAULT 0`
- `purchasePrice NUMERIC(14,4) NULL`
- `isActive BOOLEAN NOT NULL DEFAULT TRUE`

#### Opción B: historial de precios

- `id UUID PRIMARY KEY`
- `productId UUID NOT NULL`
- `oldPurchasePrice NUMERIC(14,4) NULL`
- `newPurchasePrice NUMERIC(14,4) NULL`
- `oldSalePrice NUMERIC(14,4) NULL`
- `newSalePrice NUMERIC(14,4) NULL`
- `changedBy UUID NULL`
- `changedAt TIMESTAMP NOT NULL`
- `reason TEXT NULL`

---

## 9. Proveedores

### 9.1 `suppliers`

Tabla de proveedores.

#### Campos sugeridos

- `id UUID PRIMARY KEY`
- `businessName TEXT NOT NULL`
- `tradeName TEXT NULL`
- `taxId TEXT NULL`
- `phone TEXT NULL`
- `email TEXT NULL`
- `address TEXT NULL`
- `city TEXT NULL`
- `province TEXT NULL`
- `taxCondition TEXT NULL`
- `isActive BOOLEAN NOT NULL DEFAULT TRUE`
- `notes TEXT NULL`
- `createdAt TIMESTAMP NOT NULL`
- `updatedAt TIMESTAMP NOT NULL`
- `deletedAt TIMESTAMP NULL`

#### Reglas

- Un proveedor puede estar inactivo sin perder historial.
- Las compras deben poder asociarse a un proveedor.

---

## 10. Clientes

### 10.1 `customers`

Tabla de clientes.

#### Campos sugeridos

- `id UUID PRIMARY KEY`
- `fullName TEXT NOT NULL`
- `documentNumber TEXT NULL`
- `phone TEXT NULL`
- `email TEXT NULL`
- `address TEXT NULL`
- `customerType TEXT NOT NULL DEFAULT 'regular'`
- `accountBalance NUMERIC(14,2) NOT NULL DEFAULT 0`
- `creditLimit NUMERIC(14,2) NULL`
- `isActive BOOLEAN NOT NULL DEFAULT TRUE`
- `notes TEXT NULL`
- `createdAt TIMESTAMP NOT NULL`
- `updatedAt TIMESTAMP NOT NULL`
- `deletedAt TIMESTAMP NULL`

#### Reglas

- El cliente puede ser opcional en una venta simple.
- Si existe cuenta corriente, el saldo debe actualizarse de forma consistente.

---

## 11. Compras

### 11.1 `purchases`

Tabla principal de compras.

#### Campos sugeridos

- `id UUID PRIMARY KEY`
- `supplierId UUID NOT NULL`
- `purchaseDate TIMESTAMP NOT NULL`
- `invoiceNumber TEXT NULL`
- `invoiceType TEXT NULL`
- `status TEXT NOT NULL`
- `subtotal NUMERIC(14,2) NOT NULL DEFAULT 0`
- `taxAmount NUMERIC(14,2) NOT NULL DEFAULT 0`
- `discountAmount NUMERIC(14,2) NOT NULL DEFAULT 0`
- `total NUMERIC(14,2) NOT NULL DEFAULT 0`
- `paymentStatus TEXT NOT NULL DEFAULT 'pending'`
- `notes TEXT NULL`
- `createdBy UUID NULL`
- `updatedBy UUID NULL`
- `createdAt TIMESTAMP NOT NULL`
- `updatedAt TIMESTAMP NOT NULL`
- `deletedAt TIMESTAMP NULL`

#### Estados posibles

- borrador,
- confirmada,
- anulada,
- pendiente.

---

### 11.2 `purchase_items`

Detalle de cada compra.

#### Campos sugeridos

- `id UUID PRIMARY KEY`
- `purchaseId UUID NOT NULL`
- `productId UUID NOT NULL`
- `quantity NUMERIC(14,3) NOT NULL`
- `unitCost NUMERIC(14,4) NOT NULL`
- `salePriceSnapshot NUMERIC(14,4) NULL`
- `discount NUMERIC(14,2) NOT NULL DEFAULT 0`
- `subtotal NUMERIC(14,2) NOT NULL`
- `lotCode TEXT NULL`
- `expirationDate DATE NULL`
- `notes TEXT NULL`
- `createdAt TIMESTAMP NOT NULL`

#### Reglas

- Una compra confirmada debe generar o actualizar stock.
- Si el producto requiere vencimiento, `expirationDate` debe cargarse.
- Si el producto requiere lote, debe registrarse `lotCode` o una referencia equivalente.

---

## 12. Ventas

### 12.1 `sales`

Tabla principal de ventas.

#### Campos sugeridos

- `id UUID PRIMARY KEY`
- `customerId UUID NULL`
- `cashRegisterId UUID NULL`
- `saleDate TIMESTAMP NOT NULL`
- `saleType TEXT NOT NULL`
- `status TEXT NOT NULL`
- `subtotal NUMERIC(14,2) NOT NULL DEFAULT 0`
- `discountAmount NUMERIC(14,2) NOT NULL DEFAULT 0`
- `taxAmount NUMERIC(14,2) NOT NULL DEFAULT 0`
- `total NUMERIC(14,2) NOT NULL DEFAULT 0`
- `paidAmount NUMERIC(14,2) NOT NULL DEFAULT 0`
- `changeAmount NUMERIC(14,2) NOT NULL DEFAULT 0`
- `notes TEXT NULL`
- `createdBy UUID NULL`
- `updatedBy UUID NULL`
- `createdAt TIMESTAMP NOT NULL`
- `updatedAt TIMESTAMP NOT NULL`
- `deletedAt TIMESTAMP NULL`

#### Estados posibles

- borrador,
- confirmada,
- anulada,
- devuelta.

---

### 12.2 `sale_items`

Detalle de ventas.

#### Campos sugeridos

- `id UUID PRIMARY KEY`
- `saleId UUID NOT NULL`
- `productId UUID NOT NULL`
- `quantity NUMERIC(14,3) NOT NULL`
- `unitPrice NUMERIC(14,4) NOT NULL`
- `discount NUMERIC(14,2) NOT NULL DEFAULT 0`
- `subtotal NUMERIC(14,2) NOT NULL`
- `weight NUMERIC(14,3) NULL`
- `notes TEXT NULL`
- `createdAt TIMESTAMP NOT NULL`

#### Reglas

- Toda venta debe tener al menos un ítem.
- El subtotal debe calcularse según cantidad, precio y descuento.
- Los productos por peso pueden usar `weight` si el negocio lo requiere.

---

### 12.3 `sale_payments`

Tabla de pagos de ventas.

#### Campos sugeridos

- `id UUID PRIMARY KEY`
- `saleId UUID NOT NULL`
- `paymentMethod TEXT NOT NULL`
- `amount NUMERIC(14,2) NOT NULL`
- `reference TEXT NULL`
- `notes TEXT NULL`
- `createdAt TIMESTAMP NOT NULL`

#### Ejemplos de `paymentMethod`

- cash,
- debit_card,
- credit_card,
- transfer,
- qr,
- account,
- mixed.

---

## 13. Caja

### 13.1 `cash_registers`

Tabla de aperturas/cierres de caja.

#### Campos sugeridos

- `id UUID PRIMARY KEY`
- `openDate TIMESTAMP NOT NULL`
- `closeDate TIMESTAMP NULL`
- `openedBy UUID NOT NULL`
- `closedBy UUID NULL`
- `openingAmount NUMERIC(14,2) NOT NULL DEFAULT 0`
- `expectedAmount NUMERIC(14,2) NULL`
- `countedAmount NUMERIC(14,2) NULL`
- `differenceAmount NUMERIC(14,2) NULL`
- `status TEXT NOT NULL`
- `notes TEXT NULL`
- `createdAt TIMESTAMP NOT NULL`
- `updatedAt TIMESTAMP NOT NULL`

#### Estados posibles

- abierta,
- cerrada,
- en_revision.

---

### 13.2 `cash_movements`

Movimientos de caja.

#### Campos sugeridos

- `id UUID PRIMARY KEY`
- `cashRegisterId UUID NOT NULL`
- `movementType TEXT NOT NULL`
- `amount NUMERIC(14,2) NOT NULL`
- `reason TEXT NULL`
- `referenceType TEXT NULL`
- `referenceId UUID NULL`
- `createdBy UUID NOT NULL`
- `createdAt TIMESTAMP NOT NULL`

#### Ejemplos de `movementType`

- sale_income,
- expense,
- withdrawal,
- manual_income,
- adjustment,
- refund.

---

## 14. Stock

### 14.1 `stock_movements`

Tabla histórica de movimientos de stock.

#### Campos sugeridos

- `id UUID PRIMARY KEY`
- `productId UUID NOT NULL`
- `movementType TEXT NOT NULL`
- `quantity NUMERIC(14,3) NOT NULL`
- `previousStock NUMERIC(14,3) NOT NULL`
- `newStock NUMERIC(14,3) NOT NULL`
- `referenceType TEXT NULL`
- `referenceId UUID NULL`
- `reason TEXT NULL`
- `createdBy UUID NULL`
- `createdAt TIMESTAMP NOT NULL`

#### Ejemplos de `movementType`

- purchase_in,
- sale_out,
- adjustment_in,
- adjustment_out,
- waste_out,
- expiration_out,
- return_in,
- inventory_correction.

#### Reglas

- Nunca perder el historial de stock.
- Cada cambio debe poder reconstruirse.
- El stock actual del producto debe ser coherente con el historial o con un cálculo controlado.

---

### 14.2 `inventory_counts` si se usa inventario físico

#### Campos sugeridos

- `id UUID PRIMARY KEY`
- `countDate TIMESTAMP NOT NULL`
- `createdBy UUID NOT NULL`
- `status TEXT NOT NULL`
- `notes TEXT NULL`
- `createdAt TIMESTAMP NOT NULL`

### 14.3 `inventory_count_items`

#### Campos sugeridos

- `id UUID PRIMARY KEY`
- `inventoryCountId UUID NOT NULL`
- `productId UUID NOT NULL`
- `systemStock NUMERIC(14,3) NOT NULL`
- `countedStock NUMERIC(14,3) NOT NULL`
- `differenceStock NUMERIC(14,3) NOT NULL`
- `reason TEXT NULL`
- `createdAt TIMESTAMP NOT NULL`

---

## 15. Lotes y vencimientos

### 15.1 `lots`

Tabla de lotes.

#### Campos sugeridos

- `id UUID PRIMARY KEY`
- `productId UUID NOT NULL`
- `supplierId UUID NULL`
- `lotCode TEXT NOT NULL`
- `purchaseDate TIMESTAMP NULL`
- `expirationDate DATE NULL`
- `initialQuantity NUMERIC(14,3) NOT NULL DEFAULT 0`
- `remainingQuantity NUMERIC(14,3) NOT NULL DEFAULT 0`
- `status TEXT NOT NULL DEFAULT 'active'`
- `notes TEXT NULL`
- `createdAt TIMESTAMP NOT NULL`
- `updatedAt TIMESTAMP NOT NULL`

#### Reglas

- El lote debe poder rastrearse.
- Si un producto requiere lote, no debe quedar sin asociar.

---

### 15.2 `expirations` si se usa separación por evento

#### Campos sugeridos

- `id UUID PRIMARY KEY`
- `productId UUID NOT NULL`
- `lotId UUID NULL`
- `expirationDate DATE NOT NULL`
- `quantity NUMERIC(14,3) NOT NULL`
- `status TEXT NOT NULL`
- `createdAt TIMESTAMP NOT NULL`
- `updatedAt TIMESTAMP NOT NULL`

---

## 16. Promociones

### 16.1 `promotions`

Tabla de promociones.

#### Campos sugeridos

- `id UUID PRIMARY KEY`
- `name TEXT NOT NULL`
- `description TEXT NULL`
- `promotionType TEXT NOT NULL`
- `discountValue NUMERIC(14,2) NOT NULL DEFAULT 0`
- `startDate TIMESTAMP NOT NULL`
- `endDate TIMESTAMP NOT NULL`
- `isActive BOOLEAN NOT NULL DEFAULT TRUE`
- `createdBy UUID NULL`
- `createdAt TIMESTAMP NOT NULL`
- `updatedAt TIMESTAMP NOT NULL`

---

### 16.2 `promotion_products`

Relación entre promociones y productos.

#### Campos sugeridos

- `id UUID PRIMARY KEY`
- `promotionId UUID NOT NULL`
- `productId UUID NOT NULL`
- `createdAt TIMESTAMP NOT NULL`

#### Restricciones

- `UNIQUE(promotionId, productId)`

---

## 17. Auditoría

### 17.1 `audit_logs`

Tabla general de auditoría.

#### Campos sugeridos

- `id UUID PRIMARY KEY`
- `userId UUID NULL`
- `action TEXT NOT NULL`
- `entityName TEXT NOT NULL`
- `entityId UUID NULL`
- `oldValue JSONB NULL`
- `newValue JSONB NULL`
- `reason TEXT NULL`
- `ipAddress TEXT NULL`
- `userAgent TEXT NULL`
- `createdAt TIMESTAMP NOT NULL`

#### Reglas

- Los logs de auditoría no deben modificarse libremente.
- La auditoría debe guardar cambios sensibles y operaciones críticas.
- `JSONB` es útil para capturar estados anteriores y nuevos.

---

## 18. Configuración general

### 18.1 `system_settings`

Tabla de configuraciones del negocio.

#### Campos sugeridos

- `id UUID PRIMARY KEY`
- `settingKey TEXT NOT NULL UNIQUE`
- `settingValue TEXT NULL`
- `settingType TEXT NOT NULL`
- `description TEXT NULL`
- `updatedBy UUID NULL`
- `updatedAt TIMESTAMP NOT NULL`

#### Ejemplos de configuración

- moneda,
- redondeo,
- permitir stock negativo,
- exigir lote,
- exigir vencimiento,
- impuestos,
- impresora por defecto,
- formato de ticket,
- reglas de caja.

---

## 19. Relaciones principales entre tablas

### Seguridad
- `users.roleId -> roles.id`
- `role_permissions.roleId -> roles.id`
- `role_permissions.permissionId -> permissions.id`

### Catálogo
- `products.categoryId -> categories.id`
- `products.subcategoryId -> subcategories.id`
- `subcategories.categoryId -> categories.id`
- `products.unitId -> units.id`

### Negocio
- `products.supplierId -> suppliers.id`
- `purchases.supplierId -> suppliers.id`
- `purchase_items.purchaseId -> purchases.id`
- `purchase_items.productId -> products.id`
- `sales.customerId -> customers.id`
- `sale_items.saleId -> sales.id`
- `sale_items.productId -> products.id`
- `sale_payments.saleId -> sales.id`

### Caja
- `cash_movements.cashRegisterId -> cash_registers.id`
- `sales.cashRegisterId -> cash_registers.id`

### Stock
- `stock_movements.productId -> products.id`
- `lots.productId -> products.id`
- `lots.supplierId -> suppliers.id`

### Promociones
- `promotion_products.promotionId -> promotions.id`
- `promotion_products.productId -> products.id`

### Auditoría
- `audit_logs.userId -> users.id`

---

## 20. Índices recomendados

Para mejorar rendimiento, se recomiendan índices sobre:

- `users.username`
- `users.email`
- `products.barcode`
- `products.internalCode`
- `products.name`
- `products.categoryId`
- `products.supplierId`
- `purchases.purchaseDate`
- `purchases.supplierId`
- `sales.saleDate`
- `sales.customerId`
- `stock_movements.productId`
- `stock_movements.createdAt`
- `cash_movements.cashRegisterId`
- `audit_logs.entityName`
- `audit_logs.entityId`
- `lots.productId`
- `lots.expirationDate`

---

## 21. Restricciones recomendadas

### 21.1 Unicidad

Aplicar unicidad donde corresponda:

- usuario,
- código interno,
- código de barras,
- categoría,
- combinación categoría/subcategoría,
- relación promoción/producto,
- relación rol/permisos.

### 21.2 No nulos

Los campos críticos no deben ser nulos:

- nombre del producto,
- rol del usuario,
- precio de venta cuando el producto está activo,
- cantidad en movimientos,
- fecha de operación,
- estados obligatorios.

### 21.3 Validaciones de negocio

- precio no negativo,
- stock no negativo salvo excepción,
- cantidades coherentes,
- fechas válidas,
- vencimientos posteriores a la compra cuando corresponda,
- estados válidos en cada entidad.

---

## 22. Estrategia de historificación

Algunos valores deben conservar historial porque afectan al negocio.

### Historial recomendado para:

- precios de productos,
- movimientos de stock,
- compras,
- ventas,
- caja,
- cambios de permisos,
- cambios de estado,
- anulaciones,
- devoluciones.

No se recomienda sobrescribir datos sensibles sin dejar rastro.

---

## 23. Estrategia de eliminación lógica

En lugar de borrar registros, se recomienda:

- `isActive = false`
- `deletedAt = now()`
- `deletedBy = userId`

Esto aplica especialmente a:

- productos,
- proveedores,
- clientes,
- usuarios,
- promociones,
- categorías,
- subcategorías.

No se recomienda borrar compras, ventas, stock ni caja de forma física si ya impactaron en la operación.

---

## 24. Consideraciones para reportes

La base de datos debe permitir consultas como:

- ventas por rango de fechas,
- ventas por producto,
- ventas por categoría,
- stock actual por categoría,
- productos con stock bajo,
- productos con vencimiento próximo,
- compras por proveedor,
- rotación por producto,
- diferencias de caja,
- margen por producto o categoría,
- movimientos de auditoría por usuario.

Por eso es importante guardar fechas, estados, relaciones y valores históricos.

---

## 25. Consideraciones para rendimiento

### Buenas prácticas

- usar índices donde haya filtros frecuentes,
- no guardar texto libre donde debería haber una relación,
- no duplicar datos que pueden derivarse,
- mantener tablas de detalle separadas,
- registrar movimientos históricos sin destruir el resumen actual,
- usar consultas paginadas en listados grandes.

### Tablas potencialmente grandes

Estas tablas pueden crecer bastante:

- `sales`
- `sale_items`
- `purchases`
- `purchase_items`
- `stock_movements`
- `audit_logs`
- `cash_movements`

Conviene diseñarlas desde el inicio pensando en crecimiento.

---

## 26. Recomendación de estructura física

Se sugiere separar el modelo lógico por dominios:

- seguridad,
- catálogo,
- compras,
- ventas,
- stock,
- caja,
- promociones,
- auditoría,
- configuración.

Eso ayuda a que el código, las migraciones y los repositorios se mantengan ordenados.

---

## 27. Reglas específicas para IA al trabajar con la base de datos

La IA que construya el sistema debe respetar estas pautas:

1. No crear tablas duplicadas sin necesidad.
2. No mezclar catálogo con movimientos.
3. No guardar precios solo en ventas si deben conservarse históricamente.
4. No eliminar el historial de stock.
5. No inventar campos que no resuelvan una necesidad real.
6. No cambiar relaciones sin analizar el impacto.
7. No usar float para dinero.
8. No omitir auditoría en acciones críticas.
9. No simplificar tanto la estructura que se pierda trazabilidad.
10. No romper compatibilidad con datos ya cargados.

---

## 28. Modelo mínimo viable recomendado

Si se quisiera arrancar con una versión simple, el mínimo razonable sería:

- `users`
- `roles`
- `permissions`
- `role_permissions`
- `categories`
- `subcategories`
- `products`
- `suppliers`
- `purchases`
- `purchase_items`
- `sales`
- `sale_items`
- `sale_payments`
- `cash_registers`
- `cash_movements`
- `stock_movements`
- `audit_logs`
- `system_settings`

Luego, en una segunda etapa, sumar:

- `customers`
- `lots`
- `promotions`
- `promotion_products`
- `inventory_counts`
- `inventory_count_items`
- `expirations`

---

## 29. Criterios de aceptación del modelo

La base de datos se considera bien diseñada si permite:

- operar ventas sin pérdida de datos,
- saber el stock exacto o razonablemente confiable,
- rastrear compras y proveedores,
- registrar caja diaria,
- auditar cambios importantes,
- consultar reportes útiles,
- crecer sin reescribir todo,
- y mantener el negocio ordenado.

---

## 30. Cierre

Este modelo de base de datos está pensado para representar de forma realista el funcionamiento de una fiambrería y almacén, con foco en:

- control,
- trazabilidad,
- rapidez,
- auditoría,
- y escalabilidad.

La prioridad no es solo guardar datos, sino guardar datos que sirvan para operar, analizar y hacer crecer el negocio.

**Fin del documento.**