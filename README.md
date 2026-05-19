# 📻 Radio Online — Instrucciones de Instalación Completas

Esta guía está pensada para quien lo hace por primera vez. Sigue cada paso en orden.

---

## ¿Qué vas a tener al final?

- Un **backend** (Node.js + TypeScript + Express) que sirve la API
- Un **frontend** (React + Vite) con reproductor de radio
- Una **base de datos** en la nube gratuita (Neon PostgreSQL)
- Un **panel de administración** para gestionar estaciones

---

## PARTE 1 — Herramientas que necesitás instalar

### 1.1 Node.js
Descargá la versión LTS (recomendada) desde:
👉 https://nodejs.org

Para verificar que quedó instalado, abrí una terminal y ejecutá:
```
node --version
npm --version
```

### 1.2 Git (opcional pero recomendado)
👉 https://git-scm.com/downloads

---

## PARTE 2 — Crear la base de datos en Neon (gratis)

1. Entrá a 👉 https://neon.tech y creá una cuenta gratuita
2. Hacé clic en **"New Project"**
3. Elegí un nombre (ej: `radio-db`), región más cercana (US East funciona bien)
4. Una vez creado, vas a ver un panel. Hacé clic en **"Connection string"**
5. Copiá la URL completa, que tiene este formato:
   ```
   postgresql://usuario:contraseña@ep-algo-123.us-east-1.aws.neon.tech/neondb?sslmode=require
   ```
6. **Guardá esa URL**, la vas a necesitar en el siguiente paso.

---

## PARTE 3 — Configurar el Backend

### 3.1 Abrir la carpeta del backend
En tu terminal:
```bash
cd radio-app/backend
```

### 3.2 Crear el archivo de configuración
Copiá el archivo de ejemplo:
```bash
# En Mac/Linux:
cp .env.example .env

# En Windows (PowerShell):
copy .env.example .env
```

Abrí el archivo `.env` con cualquier editor de texto (Notepad, VS Code, etc.) y pegá tu URL de Neon:
```env
PORT=3001
NODE_ENV=development
DATABASE_URL=postgresql://tu-usuario:tu-contraseña@ep-xxx.aws.neon.tech/neondb?sslmode=require
FRONTEND_URL=http://localhost:5173
```

### 3.3 Instalar dependencias
```bash
npm install
```
Esto puede tardar 1-2 minutos.

### 3.4 Crear las tablas en la base de datos
```bash
npm run db:migrate
```
Deberías ver:
```
✅ Conectado a PostgreSQL (Neon)
🚀 Ejecutando migraciones...
✅ Migraciones completadas exitosamente!
✅ Estaciones de ejemplo insertadas
```

### 3.5 Iniciar el servidor
```bash
npm run dev
```
Deberías ver:
```
🎵 Radio API corriendo en http://localhost:3001
📡 Health check: http://localhost:3001/health
✅ Conectado a PostgreSQL (Neon)
```

Para verificar que funciona, abrí en el navegador: http://localhost:3001/health

---

## PARTE 4 — Configurar el Frontend

Abrí **otra terminal** (dejá el backend corriendo en la primera).

### 4.1 Ir a la carpeta del frontend
```bash
cd radio-app/frontend
```

### 4.2 Crear el archivo de configuración
```bash
# Mac/Linux:
cp .env.example .env

# Windows:
copy .env.example .env
```

El archivo `.env` del frontend debe quedar así:
```env
VITE_API_URL=http://localhost:3001/api
```

### 4.3 Instalar dependencias
```bash
npm install
```

### 4.4 Iniciar el frontend
```bash
npm run dev
```
Deberías ver:
```
VITE v4.5.3  ready in 300 ms
➜  Local:   http://localhost:5173/
```

Abrí http://localhost:5173 en tu navegador. ¡Tu radio está lista!

---

## PARTE 5 — Cómo escuchar radio (las URLs de stream)

Esto es lo más importante. Para que se escuche audio necesitás una **URL de stream de audio** válida.

### ¿Qué es una URL de stream?
Es una URL que transmite audio en tiempo real en formato MP3, AAC u OGG. El navegador se conecta y reproduce directamente.

### Opción A — Radios públicas gratuitas (para probar ya)
Estas URLs funcionan ahora mismo:

| Estación | URL del Stream |
|----------|---------------|
| Radio Paradise (Rock) | `https://stream.radioparadise.com/rock-320` |
| Radio Paradise (Jazz) | `https://stream.radioparadise.com/mellow-320` |
| Radio Paradise (Eclectic) | `https://stream.radioparadise.com/eclectic-320` |
| SomaFM Groove Salad | `https://ice1.somafm.com/groovesalad-256-mp3` |
| SomaFM Secret Agent | `https://ice1.somafm.com/secretagent-128-mp3` |

**Nota importante:** Muchas radios bloquean el acceso desde otros dominios (CORS). Si una URL no funciona, probá con otra.

### Opción B — Crear tu propia radio con Zeno.fm (recomendado)
Si querés transmitir tu propio contenido:

1. Registrate en 👉 https://zeno.fm (gratis)
2. Creá una estación
3. Usá software como **BUTT** (https://danielnoethen.de/butt/) o **Mixxx** para transmitir audio a Zeno
4. Zeno te da una URL de stream que podés pegar en el admin de tu app

### Opción C — Servidor Icecast propio
Para una solución completa y profesional:
1. Instalá **Icecast** en un VPS (DigitalOcean, Linode, etc.)
2. Configurá un source client como **Liquidsoap** o **BUTT**
3. La URL queda como: `http://tu-servidor:8000/stream`

### ¿Cómo encontrar la URL de una radio existente?
1. Abrí la radio en su sitio web
2. Abrí las herramientas de desarrollador (F12)
3. Ve a la pestaña **Network** (Red)
4. Filtrá por **Media**
5. Reproducí la radio y verás la URL del stream aparecer

---

## PARTE 6 — Agregar estaciones

1. Abrí http://localhost:5173/admin
2. Completá el formulario:
   - **Nombre:** nombre de tu radio
   - **URL del Stream:** la URL de audio (ver Parte 5)
   - **Descripción, Género, Bitrate:** opcionales
3. Hacé clic en **Crear Estación**
4. Volvé al inicio y ya verás tu estación

---

## PARTE 7 — Scripts disponibles

### Backend (`radio-app/backend`)
| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia en modo desarrollo (con hot-reload) |
| `npm run build` | Compila TypeScript a JavaScript |
| `npm start` | Inicia la versión compilada (producción) |
| `npm run db:migrate` | Crea las tablas en la base de datos |

### Frontend (`radio-app/frontend`)
| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia en modo desarrollo |
| `npm run build` | Compila para producción |
| `npm run preview` | Vista previa de la versión compilada |

---

## PARTE 8 — Estructura del proyecto

```
radio-app/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Lógica de negocio
│   │   ├── db/              # Conexión y migraciones de BD
│   │   ├── routes/          # Definición de endpoints
│   │   └── index.ts         # Punto de entrada
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/
    ├── src/
    │   ├── components/      # Player, StationCard
    │   ├── hooks/           # useAudioPlayer
    │   ├── pages/           # HomePage, AdminPage
    │   ├── services/        # Llamadas a la API
    │   ├── store/           # Estado global (Zustand)
    │   └── types/           # Tipos TypeScript
    ├── .env.example
    ├── package.json
    └── vite.config.ts
```

---

## PARTE 9 — API endpoints disponibles

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/health` | Estado del servidor |
| GET | `/api/stations` | Listar estaciones |
| POST | `/api/stations` | Crear estación |
| PUT | `/api/stations/:id` | Editar estación |
| DELETE | `/api/stations/:id` | Desactivar estación |
| GET | `/api/stations/:id/history` | Historial de canciones |
| POST | `/api/stations/:id/history` | Agregar canción al historial |
| GET | `/api/stations/:id/chat` | Mensajes del chat |
| POST | `/api/stations/:id/chat` | Enviar mensaje al chat |

---

## Preguntas frecuentes

**¿Por qué no se escucha el audio?**
- La URL del stream puede estar caída o bloqueada por CORS
- Probá con las URLs de Radio Paradise o SomaFM de la tabla de arriba
- Algunos streams HTTP no funcionan desde páginas HTTPS

**¿Error de conexión con la base de datos?**
- Verificá que la URL en el `.env` sea exactamente la de Neon
- Asegurate de incluir `?sslmode=require` al final

**¿Error de CORS?**
- Verificá que `FRONTEND_URL` en el `.env` del backend sea `http://localhost:5173`
- Con Vite 4.5.3, el proxy en `vite.config.ts` maneja las peticiones automáticamente

**¿Cómo desplegar en producción?**
- Backend: Railway, Render, o Fly.io (tienen planes gratuitos)
- Frontend: Vercel o Netlify (gratis para proyectos personales)
- Base de datos: Neon ya es una BD en la nube, no necesitás moverla
