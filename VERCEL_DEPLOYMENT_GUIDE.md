# 🚀 Guía Paso a Paso: Despliegue en Vercel & Supabase (PostgreSQL)

Esta guía describe los 3 pasos sencillos para publicar **LocalKioskito** en la nube de forma gratuita o de bajo costo.

---

## Paso 1: Crear la Base de Datos en Supabase (Gratis)

1. Ingresa a [https://supabase.com](https://supabase.com) e inicia sesión con GitHub.
2. Haz clic en **"New Project"**.
3. Completa los datos:
   - **Name**: `localkioskito-db`
   - **Database Password**: (Crea una contraseña segura y guárdala).
   - **Region**: Selecciona *South America (São Paulo)* o la más cercana.
4. Una vez creado, ve a **Project Settings -> Database**.
5. En la sección **Connection String**, copia la URI en formato **Node.js / URI**:
   - `DATABASE_URL`: `postgresql://postgres.[REF]:[PASSWORD]@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true`
   - `DIRECT_URL`: `postgresql://postgres.[REF]:[PASSWORD]@aws-0-sa-east-1.pooler.supabase.com:5432/postgres`

---

## Paso 2: Ejecutar las Migraciones y Cargar Datos de Prueba

Desde tu terminal local (reemplazando por tu URI de Supabase):

```bash
# 1. Aplicar la estructura de la base de datos en Supabase
$env:DATABASE_URL="postgresql://postgres.[REF]:[PASSWORD]@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
$env:DIRECT_URL="postgresql://postgres.[REF]:[PASSWORD]@aws-0-sa-east-1.pooler.supabase.com:5432/postgres"

npx prisma db push

# 2. Poblar los 3 usuarios iniciales y productos de prueba
npx tsx prisma/seed.ts
```

---

## Paso 3: Subir a Vercel

1. Sube el código a tu repositorio de **GitHub** (`git push`).
2. Entra a [https://vercel.com](https://vercel.com) y haz clic en **"Add New Project"**.
3. Importa tu repositorio de GitHub `LocalKioskito`.
4. En la sección **Environment Variables**, agrega:
   - `DATABASE_URL` = (Tu URI de Supabase)
   - `DIRECT_URL` = (Tu URI Directa de Supabase)
5. Haz clic en **Deploy**.

¡Listo! En 2 minutos tendrás tu aplicación publicada con HTTPS gratuito (ej: `localkioskito.vercel.app`).
