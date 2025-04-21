import e from 'express';
import { pool } from '../db.js';

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
export const postUser = async (req, res) => {
    try {
        const data = req.body;
        const {rows} = await pool.query('INSERT INTO usuario (pk_correo, nombre, password, certificado) VALUES ($1, $2, $3, $4) RETURNING *', [data.pk_correo, data.nombre, data.password, data.null]);
        return res.json(rows[0]);
    } catch (error) {
        if (error?.code === '23505') {
            return res.status(409).json({ message:'El correo ya existe' });
        }
        return res.status(500).json({ message: 'Error al insertar el usuario' });
    }
}

// Se inicia sesión
export const loginUser = async (req, res) => {
    const { pk_correo, password } = req.body;

    try {
        // Buscar usuario por correo
        const { rows } = await pool.query('SELECT * FROM usuario WHERE pk_correo = $1', [pk_correo]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'El correo no está registrado' });
        }

        const user = rows[0];

        // Verificar contraseña
        if (user.password !== password) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        // Si todo está bien, enviar mensaje de éxito o datos del usuario (puedes ajustar esto según lo que necesites)
        res.json({ message: 'Inicio de sesión exitoso', user });
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

        if (user.password !== password) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        if (user.password === newPassword) {
            return res.status(400).json({ message: 'La nueva contraseña no puede ser la misma que la actual' });
        }
        await pool.query('UPDATE usuario SET password = $1 WHERE pk_correo = $2', [newPassword, email]);

        return res.status(200).json({ message: 'Contraseña actualizada exitosamente' });
    } catch (error) {
        console.error('Error al cambiar la contraseña:', error);
        return res.status(500).json({ message: 'Error del servidor' });
    }
};
