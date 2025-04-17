import { verify } from 'crypto';
import authService from '../services/auth.services.js';
import emailService from '../services/email.services.js';

// Controlador para solicitar el restablecimiento de contraseña
const requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;
        const resetToken = await authService.generateResetToken(email);
        await emailService.sendResetEmail(email, resetToken);
        res.json({ message: 'Correo de recuperación enviado' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Controlador para restablecer la contraseña
const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        await authService.resetPassword(token, newPassword);
        res.json({ message: 'Contraseña restablecida con éxito' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Controlador para verificar el token
const verifyToken = async (req, res) => {
    try {
        const { token } = req.body;
        const isValid = await authService.verifyToken(token);
        if (isValid) {
            res.json({ message: 'Token válido' });
        } else {
            res.status(400).json({ message: 'Token inválido o expirado' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export default { requestPasswordReset, resetPassword, verifyToken };
