import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

// Configuración de la conexión
export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL
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