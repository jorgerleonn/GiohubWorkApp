# 🔴 IMPORTANTE: Ejecutar Schema SQL en Supabase

## Pasos para configurar la base de datos

### 1. Acceder a Supabase

Ir a: **https://fwuitvljudqjmafwzhnm.supabase.co**

### 2. Abrir SQL Editor

1. En el panel izquierdo, clickear **SQL Editor**
2. Clickear **New Query**

### 3. Copiar y ejecutar el Schema

Copiar TODO el contenido del archivo `supabase/schema.sql` y pegarlo en el editor.

Alternativamente, copiar este código:

```sql
-- ===========================
-- GIOHUB DATABASE SCHEMA
-- ===========================
-- Ejecutar en Supabase: SQL Editor → New Query → Pegar este contenido → Run

-- Tabla de asignaturas
CREATE TABLE IF NOT EXISTS asignaturas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(100) UNIQUE NOT NULL,
  color VARCHAR(7), -- Hex color (ej: "#FF4C4C")
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice para búsquedas rápidas por nombre
CREATE INDEX IF NOT EXISTS idx_asignaturas_nombre ON asignaturas(nombre);

-- Tabla de sesiones de estudio
CREATE TABLE IF NOT EXISTS sesiones_estudio (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fecha DATE NOT NULL,
  dia_semana VARCHAR(20) NOT NULL,
  asignatura_id UUID REFERENCES asignaturas(id) ON DELETE CASCADE,
  hora_inicio TIME NOT NULL,
  hora_final TIME NOT NULL,
  minutos_estudio INTEGER NOT NULL CHECK (minutos_estudio > 0),
  tipo_tarea VARCHAR(100),
  sincronizado_calendar BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para queries comunes
CREATE INDEX IF NOT EXISTS idx_sesiones_fecha ON sesiones_estudio(fecha DESC);
CREATE INDEX IF NOT EXISTS idx_sesiones_asignatura ON sesiones_estudio(asignatura_id);
CREATE INDEX IF NOT EXISTS idx_sesiones_fecha_asignatura ON sesiones_estudio(fecha, asignatura_id);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar updated_at en asignaturas
DROP TRIGGER IF EXISTS update_asignaturas_updated_at ON asignaturas;
CREATE TRIGGER update_asignaturas_updated_at
    BEFORE UPDATE ON asignaturas
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

### 4. Ejecutar

Clickear el botón **Run** (o presionar Ctrl/Cmd + Enter)

### 5. Verificar que se crearon las tablas

En el panel izquierdo, ir a **Table Editor**. Deberías ver:
- ✅ `asignaturas`
- ✅ `sesiones_estudio`

## ✅ ¡Listo!

Ahora puedes ejecutar la aplicación:

```bash
cd giohub
npm run dev
```

Y acceder a: **http://localhost:3000**

---

## 🧪 (Opcional) Insertar datos de prueba

Si quieres probar con datos de ejemplo, ejecuta esto DESPUÉS del schema:

```sql
INSERT INTO asignaturas (nombre, color) VALUES
  ('Matemáticas', '#FF4C4C'),
  ('Física', '#40A5A4'),
  ('Programación', '#CA5C45'),
  ('Historia', '#A54040')
ON CONFLICT (nombre) DO NOTHING;
```

Luego puedes eliminar estos datos desde la página de Configuración de la app.
