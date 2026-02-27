# 🚀 CodeKids: Plataforma Educativa (Backend)

Bienvenido al corazón de **CodeKids**. Esta es una API REST robusta diseñada para gestionar la lógica del servidor, la autenticación de usuarios y la persistencia de datos de nuestra plataforma educativa. 

El backend actúa como el puente entre el frontend y nuestra base de datos en la nube, garantizando una arquitectura escalable, segura y eficiente.

---

## 🛠️ Stack Tecnológico

Hemos seleccionado tecnologías modernas para asegurar un rendimiento óptimo:

| Categoría | Tecnología |
| :--- | :--- |
| **Entorno de Ejecución** | Node.js |
| **Framework Backend** | Express.js |
| **Base de Datos** | PostgreSQL |
| **Base de Datos en la Nube** | Supabase |
| **Gestor de Paquetes** | npm |
| **Control de Versiones** | Git / GitHub |

---

## 🌟 Características Clave

El backend de CodeKids está diseñado bajo los siguientes pilares:

* **API RESTful:** Manejo estructurado y estandarizado de rutas y controladores.
* **Conexión Segura:** Implementación de *pooling* de conexiones para interactuar con Supabase de forma eficiente.
* **Arquitectura Modular:** Organización limpia mediante la separación de rutas, controladores y configuraciones.
* **Gestión Integral (CRUD):** Control total sobre usuarios, insignias e instituciones.
* **Escalabilidad:** Optimización de recursos para soportar el crecimiento de la plataforma.

---

## 📂 Estructura del Proyecto

La organización del código sigue un patrón modular para facilitar el mantenimiento:

```text
Backend-CodeKids/
│
├── src/
│   ├── routes/          # Definición de puntos finales (endpoints)
│   ├── controllers/     # Lógica de negocio
│   ├── services/        # Consultas y lógica de datos
│   ├── config.js        # Configuraciones globales
│   ├── db.js            # Configuración de la conexión a DB
│   ├── encriptarInst.js # Scripts de utilidad y seguridad
│   └── index.js         # Punto de entrada de la aplicación
│
├── package.json         # Dependencias y scripts
└── .env                 # Variables de entorno (No trackeado)

```

## ⚙️ Configuración de Variables de Entorno

Para que el backend pueda conectarse a la base de datos y funcionar correctamente, es necesario configurar las variables de entorno. 

### 1. Crear el archivo de configuración
Crea un archivo llamado `.env` en la raíz del proyecto y copiar el siguiente contenido:

```env
# Configuración de Base de Datos (Supabase/PostgreSQL)
DATABASE_URL=postgresql://postgres.zsjnpllwntyzjqkjpadn:01XrGu4cKPvKsK@aws-0-us-west-2.pooler.supabase.com:6543/postgres
```

## ⚙️ Cómo Ejecutar el Proyecto Localmente

Sigue estos pasos para levantar el backend en tu máquina local:

### 1️⃣ Clonar el Repositorio
```bash
git clone git@github.com:Darpsi/Backend-CodeKids.git
```
2️⃣ Instalar Dependencias
```bash
npm install
```
3️⃣ Iniciar el Servidor
```bash
npm start
```
El servidor se ejecutará en: 👉 http://localhost:4000
