import crypto from 'crypto';
import {pool} from '../db.js';
import bcrypt from 'bcrypt';

// Función para generar un token de restablecimiento de contraseña
const generateResetToken = async (email) => {
    const user = await pool.query('SELECT pk_correo FROM usuario WHERE pk_correo = $1', [email]);
    console.log(user.rows);

    if (!user.rows.length) throw new Error('Correo no registrado');

    const token = crypto.randomInt(100000,999999).toString(); // Genera un token aleatorio de 6 dígitos
    const expireDate = new Date();
    expireDate.setHours(expireDate.getHours() + 1); // Establece la fecha de expiración a 1 hora a partir de ahora
    console.log(token);
    await pool.query('UPDATE usuario SET reset_token = $1, reset_token_expires = $2 WHERE pk_correo = $3', [token, expireDate, email]);

    return token;
};

// Función para restablecer la contraseña
const resetPassword = async (token, newPassword) => {
    const user = await pool.query(
        'SELECT pk_correo FROM usuario WHERE reset_token = $1 AND reset_token_expires > NOW()::timestamp',
        [token]
    );

    if (!user.rows.length) throw new Error('Token inválido o expirado');

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await pool.query(
        'UPDATE usuario SET password = $1, reset_token = NULL, reset_token_expires = NULL WHERE pk_correo = $2',
        [newPassword, user.rows[0].pk_correo]
    );
};

// Función para verificar el token
const verifyToken = async (token) => {
    const user = await pool.query(
        'SELECT pk_correo FROM usuario WHERE reset_token = $1 AND reset_token_expires > NOW()::timestamp',
        [token]
    );
    console.log("usuario cuyo token se ingreso" + user.rows);

    return user.rows.length > 0;
};

export default { generateResetToken, resetPassword, verifyToken };