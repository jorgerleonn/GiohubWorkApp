# 🎯 DeepWorkOS - Gestión de Estudio

Aplicación web Full-Stack para seguimiento de sesiones de estudio con técnica Pomodoro/Flowtime, estadísticas visuales con VISx e integración con Google Calendar.

## 🚀 Stack Tecnológico

- **Frontend**: Next.js 16 (App Router) + TypeScript + Tailwind CSS
- **UI Components**: shadcn/ui
- **Base de Datos**: Supabase (PostgreSQL)
- **Gráficas**: VISx (Airbnb)
- **Integración**: Google Calendar API
- **Estado**: Zustand

## 📋 Requisitos Previos

- Node.js 18 o superior
- Cuenta de Supabase (gratuita)
- Cuenta de Clerk para autenticación

## 🛠️ Instalación

### 1. Clonar e instalar dependencias

```bash
git clone https://github.com/jorgerleonn/DeepWorkOS.git
cd DeepWorkOS
npm install
```

### 2. Configurar variables de entorno

Crear archivo `.env.local` con:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
```

### 3. Configurar Supabase

Ejecutar el schema en el SQL Editor de Supabase:

```sql
-- Tabla asignaturas
CREATE TABLE asignaturas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_id TEXT NOT NULL,
  nombre TEXT NOT NULL,
  color TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla sesiones_estudio
CREATE TABLE sesiones_estudio (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_id TEXT NOT NULL,
  fecha DATE NOT NULL,
  dia_semana TEXT NOT NULL,
  asignatura_id UUID REFERENCES asignaturas(id) ON DELETE CASCADE,
  hora_inicio TIME NOT NULL,
  hora_final TIME NOT NULL,
  minutos_estudio INTEGER NOT NULL,
  tipo_tarea TEXT,
  sincronizado_calendar BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_sesiones_clerk ON sesiones_estudio(clerk_id);
CREATE INDEX idx_sesiones_fecha ON sesiones_estudio(fecha);
CREATE INDEX idx_asignaturas_clerk ON asignaturas(clerk_id);
```

## 🏃 Ejecutar la Aplicación

### Modo desarrollo:

```bash
npm run dev
```

Abrir: http://localhost:3000

### Build de producción:

```bash
npm run build
npm start
```

## 📱 Uso de la Aplicación

### 1. Configuración (Primera vez)

1. Ir a **Configuración**
2. Añadir asignaturas con colores personalizados

### 2. Work / Pomodoro

1. Seleccionar asignatura
2. Elegir modo: **Pomodoro** o **Flowtime**
3. Clickear **Iniciar**
4. Al finalizar, clickear **Detener** para guardar la sesión

### 3. Estadísticas

1. Ver distribución por asignatura (Pie Chart)
2. Ver horas por asignatura (Barras)
3. Ver histórico de estudio (Línea)
4. Filtrar por 7, 30 o 90 días

## 🎨 Tema Neón

La aplicación usa un tema oscuro con acentos neón:
- Fondo: #0a0a0f
- Verde neón: #00ff88
- Turquesa neón: #00d4ff
- Púrpura neón: #bf5af2

## 📄 Licencia

MIT

---

**Desarrollado con Next.js 16 + TypeScript + Supabase + VISx**
