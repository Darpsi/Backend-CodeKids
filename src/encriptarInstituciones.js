import { pool } from './db.js';  // Asegúrate de importar bien tu conexión pool
import bcrypt from 'bcrypt';

async function migrarContraseñasInstituciones() {
  try {
    // 1️⃣ Obtener todas las instituciones
    const { rows: instituciones } = await pool.query('SELECT correo, password FROM institucion');

    for (const institucion of instituciones) {
      const { correo, password } = institucion;

      // 2️⃣ Verificar si ya está encriptada
      if (password.startsWith('$2b$') || password.startsWith('$2a$')) {
        console.log(`Institución con correo ${correo} ya tiene contraseña encriptada.`);
        continue;
      }

      // 3️⃣ Encriptar la contraseña y actualizar
      const hashedPassword = await bcrypt.hash(password, 10);
      await pool.query('UPDATE institucion SET password = $1 WHERE correo = $2', [hashedPassword, correo]);
      console.log(`Contraseña actualizada para ${correo}`);
    }

    console.log('✅ Migración completa.');
  } catch (error) {
    console.error('❌ Error en la migración:', error);
  } finally {
    await pool.end();  // Cierra la conexión
  }
}

// Llamar a la función
migrarContraseñasInstituciones();

