import e from 'express';
import { pool } from '../db.js';
import bcrypt from 'bcrypt'; 

// Aqui se realiza la consulta a la base de datos

// Se muestran todos los Usuarios
export const getUsers = async (req, res) => {

    // se destructura el resultado para solo obtener lo relevante (rows)
    const {rows} = await pool.query('SELECT * FROM usuario');
    res.json(rows);
}

// Se muestra un solo usuario
export const getUser1 = async (req, res) => {

    // se obtiene el id de los parámetros
    const { pk_correo } = req.params;
    const {rows} = await pool.query('SELECT * FROM usuario WHERE pk_correo = $1', [pk_correo]);
    
    if (rows.length === 0) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json(rows[0]);
}

// Se crea un usuario

const saltRounds = 10;

export const postUser = async (req, res) => {
  try {
    const { pk_correo, nombre, password, certificado } = req.body;

    // Validate certificado
    if (certificado !== undefined && typeof certificado !== 'boolean') {
      return res.status(400).json({ message: 'El certificado debe ser un valor booleano' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert user
    const { rows } = await pool.query(
      'INSERT INTO usuario (pk_correo, nombre, password, certificado) VALUES ($1, $2, $3, $4) RETURNING pk_correo, nombre, certificado',
      [pk_correo.toLowerCase(), nombre, hashedPassword, certificado ?? null]
    );

    return res.status(201).json(rows[0]);
  } catch (error) {
    if (error?.code === '23505') {
      return res.status(409).json({ message: 'El correo ya existe' });
    }
    console.error('Error al insertar usuario:', error.message, error.stack);
    return res.status(500).json({ message: 'Error al insertar el usuario', details: error.message });
  }
};

// Se inicia sesión y se valida si es usuario normal o institucion
export const loginUser = async (req, res) => {
  const { pk_correo, password } = req.body;

  try {
    // Buscar en la tabla usuario (usuario normal)
    const { rows: rows_user } = await pool.query(
      'SELECT * FROM usuario WHERE pk_correo = $1',
      [pk_correo]
    );

    if (rows_user.length > 0) {
      const usuario = rows_user[0];
      const esValida = await bcrypt.compare(password, usuario.password);

      if (esValida) {
        return res.json({
          message: 'Inicio de sesión exitoso',
          tipo: 'normal',
        });
      }
    }

    // Buscar en la tabla institucion (superusuario)
    const { rows: rows_admin } = await pool.query(
      'SELECT * FROM institucion WHERE correo = $1',
      [pk_correo]
    );

    if (rows_admin.length > 0) {
      const admin = rows_admin[0];
      const esValida = await bcrypt.compare(password, admin.password);

      if (esValida) {
        return res.json({
          message: 'Inicio de sesión exitoso',
          tipo: 'admin',
        });
      }
    }

    // Si no encontró nada válido
    return res.status(401).json({ message: 'Correo o contraseña incorrectos' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el inicio de sesión' });
  }
};


// Se elimina un usuario
export const deleteUser = async (req, res) => {
    const { pk_correo } = req.params;
    const {rowCount} = await pool.query('DELETE FROM usuario WHERE pk_correo = $1 RETURNING *', [pk_correo]);

    // si no se encontró el usuario (rowCount indica la cantidad de filas afectadas)
    if (rowCount === 0) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    return res.sendStatus(204); // Todo OK, no hay contenido para devolver
}

// Se actualiza un usuario
export const putUser = async (req, res) => {
    const { pk_correo } = req.params;
    const data = req.body;
    
    const {rows} = await pool.query('UPDATE usuario SET nombre = $1, password = $2, certificado = $3 WHERE pk_correo = $4 RETURNING *', [data.nombre, data.password, data.certificado, pk_correo]);
    return res.json(rows[0]);
}

// Se cambia la contraseña de un usuario
export const changePassword = async (req, res) => {
    const { email, password, newPassword } = req.body;

    try {
        const result = await pool.query('SELECT * FROM usuario WHERE pk_correo = $1', [email]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const user = result.rows[0];

        const isValid = await bcrypt.compare(password, user.password);
          if (!isValid) {
            return res.status(401).json({ message: 'Contraseña actual incorrecta' });
          }

        const isSame = await bcrypt.compare(newPassword, user.password);
          if (isSame) {
            return res.status(400).json({ message: 'La nueva contraseña no puede ser la misma que la actual' });
          }

        const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

        await pool.query('UPDATE usuario SET password = $1 WHERE pk_correo = $2', [hashedNewPassword, email]);

        return res.status(200).json({ message: 'Contraseña actualizada exitosamente' });
    } catch (error) {
        console.error('Error al cambiar la contraseña:', error);
        return res.status(500).json({ message: 'Error del servidor' });
    }
};

export const getName = async (req, res) => {
    try {
        const { pk_correo } = req.params;
        const { rows } = await pool.query('SELECT nombre FROM usuario WHERE pk_correo = $1', [pk_correo]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.json(rows[0].nombre);
    } catch (error) {
        console.error('Error al obtener el nombre del usuario:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
}

export const getInstitution = async (req, res) => {
    try {
        const { pk_correo } = req.params;
        const { rows } = await pool.query('SELECT i.nombre FROM usuario u JOIN institucion i ON u.correo_institucion = i.correo WHERE u.pk_correo = $1', [pk_correo]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.json(rows[0].nombre);
    } catch (error) {
        console.error('Error al obtener la institución del usuario:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
}

export const getProgresoUsuario = async (req, res) => {
    const { correo } = req.params;
    try {
      const result = await pool.query(
        'SELECT id_modulo_actual FROM usuario WHERE pk_correo = $1',
        [correo]
      );
  
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
  
      res.json({ maxModulo: result.rows[0].id_modulo_actual });
    } catch (error) {
      console.error('Error al obtener el progreso:', error);
      res.status(500).json({ error: 'Error al obtener el progreso del usuario' });
    }
  };

  
export const actualizarProgreso = async (req, res) => {
  const { correo, modulo } = req.body;

  try {
    const result = await pool.query(
      'SELECT id_modulo_actual, certificado FROM usuario WHERE pk_correo = $1',
      [correo]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const { id_modulo_actual, certificado } = result.rows[0];

        // Si acaba de aprobar el módulo 8, desbloquear el certificado si aún no lo tiene
    if (id_modulo_actual === 8 && Number(modulo) === 8 && !certificado) {
      await pool.query(
        'UPDATE usuario SET certificado = TRUE WHERE pk_correo = $1',
        [correo]
      );
      return res.json({ mensaje: '¡Certificado desbloqueado!' });
    }

    // Usuario está justo en el módulo actual que acaba de aprobar (y no pasó del 8)
    if (id_modulo_actual === Number(modulo) && id_modulo_actual < 8) {
      await pool.query(
        'UPDATE usuario SET id_modulo_actual = id_modulo_actual + 1 WHERE pk_correo = $1',
        [correo]
      );
      return res.json({ mensaje: 'Progreso actualizado', nuevoModulo: id_modulo_actual + 1 });
    }

    return res.status(400).json({ error: 'No avanza modulo' });

  } catch (error) {
    console.error('Error al actualizar progreso:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

export const getCertificado = async (req, res) => {
  const { pk_correo } = req.params;

  try {
    const result = await pool.query(
      'SELECT certificado FROM usuario WHERE pk_correo = $1',
      [pk_correo]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ certificado: result.rows[0].certificado });
  } catch (error) {
    console.error('Error al obtener certificado:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

export const getUsersInInstitution = async (req, res) => {
  const {correo} = req.params;

  try {
    const { rows } = await pool.query('select u.nombre, u.id_modulo_actual from institucion i join usuario u ON i.correo = u.correo_institucion where i.correo = $1', [correo]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'No se encontraron usuarios para esta institución' });
    }
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener usuarios de la institución:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

export const postUserInstitution = async (req, res) => {
  const { pk_correo, correo_institucion } = req.body;

  try {
    // 1. Consultar al usuario por su correo
    const consult = await pool.query(
      'SELECT correo_institucion FROM usuario WHERE pk_correo = $1',
      [pk_correo]
    );

    if (consult.rowCount === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const usuario = consult.rows[0];

    // 2. Verificar si ya pertenece a esa institución
    if (usuario.correo_institucion === correo_institucion) {
      return res.status(400).json({ message: 'El usuario ya pertenece a esta institución' });
    }

    // 3. Si pertenece a otra institución, puedes validar si debe cambiarse o no
    if (
      usuario.correo_institucion &&
      usuario.correo_institucion !== correo_institucion
    ) {
      return res
        .status(400)
        .json({ message: 'El usuario ya pertenece a otra institución' });
    }

    // 4. Actualizar el correo institucional
    const result = await pool.query(
      'UPDATE usuario SET correo_institucion = $1 WHERE pk_correo = $2 RETURNING *',
      [correo_institucion, pk_correo]
    );

    res.json({ message: 'Institución actualizada correctamente'});
  } catch (error) {
    console.error('Error al actualizar la institución:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

export const desbloquearInsignia = async (req, res) => {
  const { correo, id_insignia } = req.body;

  try {
    const result = await pool.query(`
      SELECT ui.desbloqueado, i.descripcion
      FROM usuario_insignia ui
      JOIN insignia i ON ui.id_insignia = i.id
      WHERE ui.usuario_correo = $1 AND ui.id_insignia = $2
    `, [correo, id_insignia]);

    if (result.rowCount > 0 && result.rows[0].desbloqueado) {
      return res.json({ itwasunlock: true });
    }

    await pool.query(`
      INSERT INTO usuario_insignia (usuario_correo, id_insignia, desbloqueado)
      VALUES ($1, $2, true)
      ON CONFLICT (usuario_correo, id_insignia)
      DO UPDATE SET desbloqueado = true;
    `, [correo, id_insignia]);

    const descRes = await pool.query(`
      SELECT descripcion FROM insignia WHERE id = $1
    `, [id_insignia]);

    res.json({ itwasunlock: false, descripcion: descRes.rows[0].descripcion });

  } catch (error) {
    console.error("Error al desbloquear insignia:", error);
    res.status(500).json({ error: "Error al desbloquear la insignia" });
  }
};


export const GetInsigniasDesbloqueadas = async (req, res) => {
  const { correo } = req.params;

  try {
    const result = await pool.query(`
      SELECT id_insignia FROM usuario_insignia
      WHERE usuario_correo = $1 AND desbloqueado = true
    `, [correo]);

    const idsDesbloqueadas = result.rows.map(row => row.id_insignia);
    res.json({ desbloqueadas: idsDesbloqueadas });

  } catch (error) {
    console.error("Error al obtener insignias desbloqueadas:", error);
    res.status(500).json({ error: "Error al obtener insignias" });
  }
};
