# Actividad 4 - API de Laptops con Autenticación JWT

## Descripción

API RESTful para gestión de laptops con autenticación JWT, desarrollada en Node.js con Express.js y MongoDB.

## Requisitos Cumplidos

### 1. Configuración del Servidor
- **Framework**: Express.js v5.2.1
- **Base de datos**: MongoDB con Mongoose v9.2.0
- **Middlewares**: CORS, JSON parsing, JWT authentication

### 2. Rutas Implementadas

| Método | Endpoint | Descripción | Protección |
|--------|----------|-------------|------------|
| POST | `/api/auth/register` | Registrar usuario | Público |
| POST | `/api/auth/login` | Iniciar sesión | Público |
| GET | `/api/laptops` | Listar laptops | Público |
| GET | `/api/laptops/:id` | Obtener laptop por ID | Público |
| POST | `/api/laptops` | Crear laptop | Admin |
| PUT | `/api/laptops/:id` | Actualizar laptop | Admin |
| DELETE | `/api/laptops/:id` | Eliminar laptop | Admin |
| GET | `/api/health` | Estado del servidor | Público |

### 3. Autenticación y Autorización
- **JWT (JSON Web Tokens)**: Token de acceso con expiración de 1 hora
- **Roles**: Usuario regular y Administrador
- **Vista de Login**: [`public/login.html`](public/login.html) - Formulario HTML estático

### 4. Controladores
- [`src/controllers/auth.controller.js`](src/controllers/auth.controller.js): Registro y login de usuarios
- [`src/controllers/laptops.controller.js`](src/controllers/laptops.controller.js): CRUD de laptops

### 5. Modelos
- [`src/models/user.js`](src/models/user.js): Esquema de usuario
- [`src/models/laptop.js`](src/models/laptop.js): Esquema de laptop

### 6. Pruebas Unitarias
- **Framework**: Jest v30.2.0
- **Archivos de prueba**:
  - [`tests/auth.test.js`](tests/auth.test.js): Pruebas de autenticación
  - [`tests/laptops.test.js`](tests/laptops.test.js): Pruebas de laptops
  - [`tests/middleware.test.js`](tests/middleware.test.js): Pruebas de middlewares
- **Ejecutar**: `npm test`

### 7. Despliegue
- **Plataforma**: Vercel
- **Configuración**: [`vercel.json`](vercel.json)
- **CI/CD**: GitHub Actions (`.github/workflows/`)

## Estructura del Proyecto

```
actividad_4/
├── public/
│   └── login.html              # Vista de login
├── src/
│   ├── config/
│   │   └── db.js              # Conexión a MongoDB
│   ├── controllers/
│   │   ├── auth.controller.js # Controlador de auth
│   │   └── laptops.controller.js
│   ├── middleware/
│   │   ├── auth.middleware.js # Verificación JWT
│   │   └── role.middleware.js # Verificación de roles
│   ├── models/
│   │   ├── laptop.js          # Modelo de laptop
│   │   └── user.js            # Modelo de usuario
│   ├── routes/
│   │   ├── auth.routes.js     # Rutas de auth
│   │   └── laptops.routes.js  # Rutas de laptops
│   └── server.js              # Punto de entrada
├── tests/
│   ├── auth.test.js
│   ├── laptops.test.js
│   └── middleware.test.js
├── .env                       # Variables de entorno
├── package.json
├── vercel.json
└── jest.setup.js
```

## Instalación y Uso

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar variables de entorno
Crear archivo `.env`:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/laptopsdb
JWT_SECRET=tu_secreto_aqui
```

### 3. Ejecutar en desarrollo
```bash
npm run dev
```
Servidor disponible en: http://localhost:3000

### 4. Ejecutar pruebas
```bash
npm test
```

## Endpoints de la API

### Autenticación

**Registro:**
```bash
POST /api/auth/register
{
  "username": "usuario",
  "email": "correo@ejemplo.com",
  "password": "contraseña"
}
```

**Login:**
```bash
POST /api/auth/login
{
  "email": "correo@ejemplo.com",
  "password": "contraseña"
}
```

Respuesta:
```json
{
  "message": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1...",
  "user": {
    "id": "...",
    "username": "usuario",
    "email": "correo@ejemplo.com",
    "role": "user"
  }
}
```

### Laptops (público)
```bash
GET /api/laptops
GET /api/laptops/:id
```

### Laptops (admin, requiere JWT)
```bash
POST /api/laptops
Authorization: Bearer <token>
{
  "brand": "Dell",
  "model": "XPS 15",
  "price": 1500
}
```

## Tecnologías Utilizadas

- **Runtime**: Node.js
- **Framework**: Express.js
- **Base de datos**: MongoDB (Mongoose)
- **Auth**: JWT (jsonwebtoken) + bcryptjs
- **Testing**: Jest + supertest + mongodb-memory-server
- **Despliegue**: Vercel
