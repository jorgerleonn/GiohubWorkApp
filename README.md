# 🎯 DeepWorkOS - Gestión de Estudio

Aplicación web Full-Stack para seguimiento de sesiones de estudio con técnica Pomodoro/Flowtime, estadísticas visuales, lista de tareas por asignatura y integración con Google Calendar.

## 🚀 Stack Tecnológico

- **Frontend**: Next.js 16 (App Router) + TypeScript + Tailwind CSS
- **UI Components**: shadcn/ui
- **Base de Datos**: Supabase (PostgreSQL)
- **Gráficas**: VISx (Airbnb) + Recharts
- **Integración**: Google Calendar API
- **Estado**: Zustand
- **Autenticación**: Clerk

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
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/work
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/work

# Supabase
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key

# Google Calendar (opcional)
GOOGLE_SERVICE_ACCOUNT_JSON={"type":"service_account",...}
GOOGLE_CALENDAR_ID=tu_email@gmail.com
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
   - **Pomodoro**: Temporizador fijo (15-60 min), descanso configurado
   - **Flowtime**: Temporizador libre, descanso proporcional al tiempo estudiado
3. Opcional: Añadir tareas para la sesión
4. Clickear **Iniciar**
5. Al finalizar, clickear **Detener** para guardar la sesión
6. Puedes pausar y reanudar en cualquier momento
7. Si sales de la página, el cronómetro continúa al volver

### 3. Lista de Tareas

1. Añadir tareas para la sesión de estudio
2. Las tareas se asignan automáticamente a la asignatura seleccionada
3. Filtrar tareas por asignatura
4. Marcar tareas como completadas
5. Las tareas se guardan localmente

### 4. Estadísticas

1. Ver distribución por asignatura (Pie Chart)
2. Ver horas por asignatura (Barras)
3. Ver histórico de estudio (Línea)
4. Ver sesiones recientes
5. Filtrar por 7, 30 o 90 días
6. Eliminar sesiones

## 🎨 Características

- **Persistência del temporizador**: Al salir de la página, el cronómetro continúa y al volver restaura el tiempo transcurrido
- **Modo Pomodoro**: Temporizador clásico con duración configurable y descansos
- **Modo Flowtime**: Temporizador flexible con descansos proporcionales al tiempo estudiado (ratio 1:2 a 1:10)
- **Integración Google Calendar**: Sincroniza automáticamente las sesiones de estudio
- **Tema Neón**: Interfaz oscura con acentos neón personalizables

## 🎨 Tema Neón

La aplicación usa un tema oscuro con acentos neón:
- Fondo: #0a0a0f
- Verde neón: #00ff88
- Turquesa neón: #00d4ff
- Púrpura neón: #bf5af2
- Naranja: #ff9f43
- Rojo: #ff4c4c

## 📄 Licencia

MIT

---

**Desarrollado con Next.js 16 + TypeScript + Supabase + VISx + Clerk**
