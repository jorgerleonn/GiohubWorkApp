<<<<<<< HEAD
# GiohubWorkApp
=======
# 🎯 GIOHUB - Gestión de Estudio

Aplicación web Full-Stack para seguimiento de sesiones de estudio con técnica Pomodoro/Flowtime, estadísticas visuales e integración con Google Calendar.

## 🚀 Stack Tecnológico

- **Frontend**: Next.js 16 (App Router) + TypeScript + Tailwind CSS
- **UI Components**: shadcn/ui
- **Base de Datos**: Supabase (PostgreSQL)
- **Gráficas**: Recharts
- **Integración**: Google Calendar API

## 📋 Requisitos Previos

- Node.js 18 o superior
- Cuenta de Supabase (gratuita)
- Cuenta de Google Cloud con Service Account (opcional, para Calendar)

## 🛠️ Instalación

### 1. Clonar e instalar dependencias

```bash
cd giohub
npm install
```

### 2. Configurar Supabase

#### Crear las tablas en Supabase:

1. Ir a: https://fwuitvljudqjmafwzhnm.supabase.co
2. Abrir **SQL Editor** → **New Query**
3. Copiar el contenido de `supabase/schema.sql`
4. Ejecutar el script

Esto creará:
- Tabla `asignaturas` (id, nombre, color, timestamps)
- Tabla `sesiones_estudio` (id, fecha, asignatura_id, tiempos, tipo_tarea, etc.)
- Índices optimizados
- Triggers para updated_at

### 3. Verificar variables de entorno

El archivo `.env.local` ya está configurado con:

```env
NEXT_PUBLIC_SUPABASE_URL=https://fwuitvljudqjmafwzhnm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
GOOGLE_SERVICE_ACCOUNT_JSON=...
GOOGLE_CALENDAR_ID=jorgeleonestudios@gmail.com
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

1. Ir a **⚙ Configuración**
2. Añadir tus asignaturas con colores personalizados
3. Ejemplo: "Matemáticas", "Física", "Programación"

### 2. Work / Pomodoro

1. Ir a **▶ Work / Pomodoro**
2. Seleccionar asignatura
3. (Opcional) Añadir tipo de tarea: "Ejercicios", "Teoría", etc.
4. Elegir modo:
   - **Pomodoro**: Cronómetro clásico
   - **Flowtime**: Con cálculo automático de descanso (tiempo/5)
5. Clickear **▶ Iniciar**
6. Al finalizar, clickear **⏹ Detener** para guardar la sesión

**Características:**
- Cronómetro en tiempo real (MM:SS o HH:MM:SS)
- Pausar/Reanudar
- Reiniciar
- Sincronización opcional con Google Calendar
- Historial del día en tiempo real
- Contador de sesiones y tiempo total del día

### 3. Gráficas de Estudio

1. Ir a **📊 Gráficas de Estudio**
2. Ver:
   - **Resumen del día**: Tiempo total, asignaturas, sesiones
   - **Gráfica de barras**: Horas totales por asignatura (todos los tiempos)
   - **Gráfica de líneas**: Evolución diaria (7/30/90 días)
   - **Tabla de sesiones recientes**: 20 últimas sesiones con detalles

## 📂 Estructura del Proyecto

```
giohub/
├── app/
│   ├── api/calendar/          # API Route para Google Calendar
│   ├── work/                  # Página de cronómetro
│   ├── stats/                 # Página de estadísticas
│   ├── config/                # Página de configuración
│   ├── layout.tsx             # Layout global
│   └── page.tsx               # Dashboard principal
├── components/
│   ├── ui/                    # Componentes shadcn/ui
│   ├── layout/                # BackButton
│   ├── work/                  # Timer component
│   └── stats/                 # Gráficas Recharts
├── lib/
│   ├── actions/               # Server Actions (asignaturas, sesiones, estadísticas)
│   ├── supabase/              # Clientes Supabase
│   ├── types.ts               # Interfaces TypeScript
│   └── utils.ts               # Funciones helper
└── supabase/
    └── schema.sql             # Schema de base de datos
```

## 🔑 Funcionalidades Principales

### ✅ Gestión de Asignaturas
- Crear con nombre y color personalizado
- Eliminar (con confirmación)
- Listado visual con colores

### ⏱️ Cronómetro Pomodoro/Flowtime
- Dos modos de trabajo
- Controles: Start, Pause, Stop, Reset
- Indicador visual de estado
- Cálculo automático de descanso en modo Flowtime

### 📊 Estadísticas Avanzadas
- Horas por asignatura (gráfica de barras con colores)
- Evolución temporal (gráfica de líneas)
- Filtros de 7, 30 o 90 días
- Tabla de sesiones recientes con todos los detalles

### 🔗 Integración Google Calendar
- Sincronización automática opcional
- Eventos con nombre de asignatura, tarea, fecha y hora
- Manejo de errores sin interrumpir flujo

## 🎨 Colores GIOHUB

```css
bg-dark:         #1C1C1C (Fondo principal)
card:            #2C2C2C (Tarjetas)
card-secondary:  #333333 (Tarjetas secundarias)
primary:         #FF4C4C (Rojo primario)
primary-hover:   #FF7F50 (Rojo hover)
success:         #4CAF50 (Verde éxito)
orange:          #CA5C45 (Naranja)
red:             #A54040 (Rojo oscuro)
turquoise:       #40A5A4 (Turquesa)
gray:            #555555 (Gris)
```

## 📝 Notas Técnicas

- **Server Actions**: Todas las operaciones de base de datos usan Server Actions de Next.js
- **Client Components**: Solo componentes interactivos (cronómetro, formularios)
- **Optimización**: Índices en Supabase para queries rápidas
- **Seguridad**: Service Role Key solo en Server Actions (no expuesta al cliente)

## 🐛 Troubleshooting

### Error al conectar con Supabase
- Verificar que el schema SQL fue ejecutado
- Comprobar credenciales en `.env.local`

### Gráficas no muestran datos
- Asegurarse de tener asignaturas creadas
- Registrar al menos una sesión

### Calendar no sincroniza
- Verificar `GOOGLE_SERVICE_ACCOUNT_JSON` en `.env.local`
- La cuenta debe tener permisos en el calendario destino

## 🚀 Próximas Mejoras (Opcionales)

- [ ] Validación con Zod
- [ ] Toast notifications
- [ ] Confirmaciones para acciones destructivas
- [ ] Responsive design para móviles
- [ ] Dark/Light mode toggle
- [ ] Export de datos a CSV
- [ ] Estadísticas por semana/mes
- [ ] Objetivos de estudio
- [ ] Notificaciones de descanso

## 📄 Licencia

MIT

---

**Desarrollado con Next.js 16 + TypeScript + Supabase**
>>>>>>> c3b0821 (Primer commit: Estructura base de GIOHUB)
