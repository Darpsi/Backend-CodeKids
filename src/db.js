import pg from 'pg';

// Configuración de la conexión
export const pool = new pg.Pool({
  user: 'postgres.rkpwagjxvdajggqvdoyk', // Usuario de la base de datos
  host: 'aws-0-us-west-1.pooler.supabase.com',
  database: 'postgres', // Nombre de la base de datos
  password: 'mmFC5EnnZcpQTB0B', // Contraseña de la base de datos
  port: 6543, // Puerto de PostgreSQL
  ssl: {
    rejectUnauthorized: false, // Necesario para conexiones SSL
  },
});
