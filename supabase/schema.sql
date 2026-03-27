-- ===========================
-- GIOHUB DATABASE SCHEMA
-- ===========================
-- Ejecutar en Supabase: SQL Editor → New Query → Pegar este contenido → Run

-- Tabla de usuarios (sincronizada con Clerk)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_id VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice para búsquedas por clerk_id
CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON users(clerk_id);

-- Trigger para actualizar updated_at en users
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Habilitar RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Políticas RLS: usuarios solo pueden ver/editar su propio registro
CREATE POLICY "Users can view own data" ON users
    FOR SELECT USING (auth.uid()::text = clerk_id);

CREATE POLICY "Users can update own data" ON users
    FOR UPDATE USING (auth.uid()::text = clerk_id);

-- Nota: El webhook usa el service_role key, no auth, así que tiene acceso total
-- Para INSERT desde webhook, necesitas una política específica o usar service_role

-- Tabla de asignaturas
CREATE TABLE IF NOT EXISTS asignaturas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_id VARCHAR(255) NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  color VARCHAR(7),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(clerk_id, nombre)
);

CREATE INDEX IF NOT EXISTS idx_asignaturas_clerk_id ON asignaturas(clerk_id);

-- Tabla de sesiones de estudio
CREATE TABLE IF NOT EXISTS sesiones_estudio (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_id VARCHAR(255) NOT NULL,
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

CREATE INDEX IF NOT EXISTS idx_sesiones_clerk_id ON sesiones_estudio(clerk_id);
CREATE INDEX IF NOT EXISTS idx_sesiones_fecha ON sesiones_estudio(fecha DESC);
CREATE INDEX IF NOT EXISTS idx_sesiones_asignatura ON sesiones_estudio(asignatura_id);

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

-- Datos de ejemplo (opcional - comentar si no quieres datos de prueba)
-- INSERT INTO asignaturas (nombre, color) VALUES
--   ('Matemáticas', '#FF4C4C'),
--   ('Física', '#40A5A4'),
--   ('Programación', '#CA5C45')
-- ON CONFLICT (nombre) DO NOTHING;
