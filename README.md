🚀 CodeKids: Plataforma Educativa Backend

API REST desarrollada para gestionar la lógica del servidor, autenticación de usuarios, conexión con la base de datos y manejo de la información de la plataforma educativa CodeKids.

Este backend se encarga de conectar el frontend con la base de datos en la nube mediante una arquitectura escalable y segura.

🛠️ Stack Tecnológico

Este proyecto fue construido utilizando tecnologías modernas de desarrollo Backend:

Categoría	Tecnología
Entorno de Ejecución	Node.js
Framework Backend	Express.js
Base de Datos	PostgreSQL
Base de Datos en la Nube	Supabase
Gestor de Paquetes	npm
Control de Versiones	Git / GitHub
🌟 Características Clave

El backend de CodeKids implementa:

API RESTful: Manejo estructurado de rutas y controladores.

Conexión Segura a Base de Datos: Uso de pool de conexiones para Supabase.

Arquitectura Modular: Separación por rutas, controladores y configuración de base de datos.

Gestión de Usuarios e Instituciones: CRUD para usuarios, insignias e instituciones.

Escalabilidad: Optimización mediante pool de conexiones.

📂 Estructura del Proyecto
Backend-CodeKids/
│
├── src/
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   ├── config.js
│   ├── db.js
│   ├── encriptarInstituciones.js
│   └── index.js
│
├── package.json
└── .env
⚙️ Variables de Entorno

Antes de ejecutar el proyecto, crea un archivo .env en la raíz con la siguiente configuración:

DATABASE_URL=postgresql://postgres.zsjnpllwntyzjqkjpadn:TU_PASSWORD@aws-0-us-west-2.pooler.supabase.com:6543/postgres

⚠️ Importante: No subir el archivo .env al repositorio.

⚙️ Cómo Ejecutar el Proyecto Localmente

Sigue estos pasos para levantar el backend en tu máquina local:

1️⃣ Clonar el Repositorio
git clone git@github.com:Darpsi/Backend-CodeKids.git
2️⃣ Instalar Dependencias
npm install
3️⃣ Iniciar el Servidor
npm start

El servidor se ejecutará en:

http://localhost:4000