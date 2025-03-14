import { pool } from '../db.js';

// Aqui se realiza la consulta a la base de datos

export const getUsers = async (req, res) => {

    // se destructura el resultado para solo obtener lo relevante (rows)
    const {rows} = await pool.query('SELECT * FROM usuario');
    res.json(rows);
}

export const getUser1 = async (req, res) => {

    // se obtiene el id de los parámetros
    const { pk_correo } = req.params;
    const {rows} = await pool.query('SELECT * FROM usuario WHERE pk_correo = $1', [pk_correo]);
    
    if (rows.length === 0) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json(rows[0]);
}

export const postUser = async (req, res) => {
    try {
        const data = req.body;
        const {rows} = await pool.query('INSERT INTO usuario (pk_correo, nombre, password, certificado) VALUES ($1, $2, $3, $4) RETURNING *', [data.pk_correo, data.nombre, data.password, data.certificado]);
        return res.json(rows[0]);
    } catch (error) {
        if (error?.code === '23505') {
            return res.status(409).json({ message:'El correo ya existe' });
        }
        return res.status(500).json({ message: 'Error al insertar el usuario' });
    }
}

export const deleteUser = async (req, res) => {
    const { pk_correo } = req.params;
    const {rowCount} = await pool.query('DELETE FROM usuario WHERE pk_correo = $1 RETURNING *', [pk_correo]);

    // si no se encontró el usuario (rowCount indica la cantidad de filas afectadas)
    if (rowCount === 0) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    return res.sendStatus(204); // Todo OK, no hay contenido para devolver
}

export const putUser = async (req, res) => {
    const { pk_correo } = req.params;
    const data = req.body;
    
    const {rows} = await pool.query('UPDATE usuario SET nombre = $1, password = $2, certificado = $3 WHERE pk_correo = $4 RETURNING *', [data.nombre, data.password, data.certificado, pk_correo]);
    return res.json(rows[0]);
}