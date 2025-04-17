import { Router } from 'express';
import authController from "../controllers/auth.controllers.js";
const { requestPasswordReset, resetPassword, verifyToken } = authController;


const router = Router();

// Rutas para la recuperación de contraseña

// Ruta para solicitar el restablecimiento de contraseña
// Esta ruta recibe el correo electrónico del usuario y genera un token de restablecimiento, 
// el cual se envia al correo electrónico del usuario.
router.post('/request-reset', requestPasswordReset);

// Ruta para verificar el token
router.post("/verify-token", verifyToken);

// Ruta para restablecer la contraseña
router.post('/reset-password', resetPassword);

export default router;