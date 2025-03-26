import pg from 'pg';

// Configuración de la conexión
export const pool = new pg.Pool({
  user: 'postgres', // Usuario de la base de datos
  host: 'database-1.cbaw20om6wxc.us-east-2.rds.amazonaws.com',
  database: 'Codekids', // Nombre de la base de datos
  password: 'posgrescodekids', // Contraseña de la base de datos
  port: 5432, // Puerto de PostgreSQL
  ssl: {
    rejectUnauthorized: false, // Necesario para conexiones SSL
  },
});

async function verificarConexion() {
  try {
    const client = await pool.connect();
    const res = await client.query('SELECT NOW() AS fecha_hora'); // Consulta simple
    console.log('Conexión exitosa:', res.rows[0].fecha_hora);
    client.release(); // Liberar conexión
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
  }
}

// Llamar a la función para probar la conexión
verificarConexion();