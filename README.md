# RondaManager API

API publicada: https://rondamanager-api.onrender.com

API REST del proyecto RondaManager, desarrollada con Node.js, Express y PostgreSQL.
Evidencia GA4-220501096-AA1-EV01 (Programación de Software, SENA).
Aprendiz: Anderson Arcesio Aguirre Angulo, Ficha 3466395.

## Requisitos
- Node.js 18 o superior
- Una base de datos PostgreSQL (se usó Neon, en la nube)
- Postman para probar los endpoints

## Instalación
1. Ejecutar `npm install`.
2. Copiar `.env.example` como `.env` y llenar `DATABASE_URL` con la cadena de conexión de la base de datos.
3. Ejecutar el script `database/script.sql` en la base de datos para crear las tablas.
4. Iniciar el servidor con `npm start`. Queda en http://localhost:3000.

## Estructura
- `src/models`: clases que consultan la base de datos.
- `src/controllers`: lógica de cada módulo.
- `src/routes`: rutas de la API.
- `src/middlewares`: verificación del token.
- `src/config`: conexión a la base de datos.

## Endpoints
| Módulo | Método | Ruta |
|---|---|---|
| Usuarios | GET, POST | /api/usuarios |
| Usuarios | GET, PUT, DELETE | /api/usuarios/:id |
| Servicios | GET, POST | /api/servicios |
| Servicios | GET, PUT, DELETE | /api/servicios/:id |
| Productos | GET, POST | /api/productos |
| Productos | GET, PUT, DELETE | /api/productos/:id |
| Autenticación | POST | /api/auth/registro |
| Autenticación | POST | /api/auth/login |
| Autenticación | GET | /api/auth/perfil (requiere token) |
| Autenticación | PUT | /api/auth/cambiar-password (requiere token) |
| Autenticación | DELETE | /api/auth/cuenta (requiere token) |

Los endpoints protegidos se llaman con el encabezado `Authorization: Bearer <token>`, y el token se obtiene en `/api/auth/login`.

## Pruebas
En la carpeta `postman` está la colección exportada con todas las pruebas realizadas.
## Aplicación web (GA4-220501096-AA1-EV02)

Aplicación publicada: https://rondamanager-api.onrender.com

Panel web de RondaManager hecho con HTML, CSS y JavaScript con clases (módulos ES), servido por el mismo servidor Express desde la carpeta `public`. Consume la API REST con `fetch` y formato JSON, y usa el token JWT del módulo de autenticación.

Módulos: inicio de sesión, usuarios (solo administrador), servicios y productos, cada uno con crear, consultar, editar y eliminar.

Estructura de `public/`:
- `index.html` y `css/estilos.css`
- `js/App.js`: clase principal (sesión, navegación y mensajes)
- `js/Sesion.js`: guarda y lee el token
- `js/ApiClient.js`: única clase que se comunica con la API
- `js/ModuloCrud.js`: clase base con tabla, formulario y las operaciones GET, POST, PUT y DELETE
- `js/UsuariosModulo.js`, `js/ServiciosModulo.js` y `js/ProductosModulo.js`: clases que heredan de `ModuloCrud`

Para ejecutarla en un computador: `npm install`, `npm start` y abrir http://localhost:3000.