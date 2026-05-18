# ReservApp

Plataforma de gestión de turnos online para negocios uruguayos. Conecta negocios con sus clientes, permitiendo reservar turnos 24/7 desde una página pública única.

---

## Características

- **Agenda inteligente** — visualización de turnos, sin superposiciones
- **Gestión de empleados** — asignación de servicios y horarios por empleado
- **Recordatorios automáticos** — notificaciones antes de cada turno
- **Horarios flexibles** — configuración de días, feriados y franjas horarias
- **Página propia por negocio** — URL única para compartir con clientes
- **Roles diferenciados** — dueño de negocio (`owner`) y cliente (`user`)

---

## Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Base de datos / Auth / Storage:** [Supabase](https://supabase.com/)
- **Estilos:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Calendario:** [FullCalendar](https://fullcalendar.io/)
- **Fuentes:** Syne (display) + DM Sans (body) vía `next/font`

---

## Requisitos

- Node.js >= 20.9.0
- Cuenta en Supabase con las tablas configuradas (ver abajo)

---

## Instalación

```bash
git clone <repo-url>
cd my-app
npm install
```

Crea un archivo `.env.local` en la raíz:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=tu_anon_key
```

Levanta el servidor de desarrollo:

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

---

## Scripts

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm start` | Servidor de producción |
| `npm run lint` | Linting con ESLint |

---

## Estructura del proyecto

```
├── app/
│   ├── Home/               # Panel principal (owner / user)
│   ├── auth/verificacion/  # Callback de verificación de email
│   ├── crear-cuenta/
│   │   ├── owner/          # Onboarding dueño de negocio
│   │   └── user/           # Onboarding cliente
│   ├── login/              # Inicio de sesión
│   ├── negocio/[id]/       # Página pública del negocio
│   ├── signup/             # Registro
│   └── page.js             # Landing page
├── components/
│   ├── crearNegocio/       # Wizard de creación de negocio (4 pasos)
│   ├── crearUsuario/       # Formulario de perfil de usuario
│   ├── negocio/
│   │   ├── owner/          # Panel de administración del negocio
│   │   └── user/           # Vista pública y reserva de turnos
│   ├── home/               # Vistas home por rol
│   ├── agregarEmpleados/   # Formulario de alta de empleados
│   ├── agregarServicios/   # Formulario de creación de servicios
│   └── ui/                 # Componentes reutilizables (Button, Input, Label, etc.)
├── lib/
│   └── supabase.js         # Cliente de Supabase
└── utils/
    ├── ciudades.js          # Lista de ciudades de Uruguay
    └── features.js          # Datos de funcionalidades para la landing
```

---

## Tablas de Supabase requeridas

| Tabla | Descripción |
|---|---|
| `Duenos` | Perfiles de dueños de negocio |
| `Clientes` | Perfiles de clientes |
| `Negocios` | Negocios registrados |
| `Empleados` | Empleados asociados a un negocio |
| `Turnos` | Reservas de turnos |

**Storage buckets:** `negocio` (logos) · `perfiles` (fotos de usuarios)

---

## Flujo de la aplicación

1. El usuario se registra eligiendo rol: **owner** o **user**
2. Confirma su email (redirige a `/auth/verificacion`)
3. Completa su perfil en `/crear-cuenta/{rol}`
4. El **owner** crea su negocio (nombre, categoría, horarios, servicios)
5. El **user** busca negocios, elige servicio, profesional, fecha y horario, y confirma la reserva
6. El **owner** gestiona turnos desde el panel con calendario FullCalendar

---

## Despliegue

La forma más sencilla es [Vercel](https://vercel.com). Agrega las variables de entorno desde el dashboard y conecta el repositorio.

Recuerda actualizar la URL de redirección del email en Supabase:

```
https://tu-dominio.vercel.app/auth/verificacion
```
