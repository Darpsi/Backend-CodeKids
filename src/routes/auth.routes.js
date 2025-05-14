import { Router } from 'express';
import authController from "../controllers/auth.controllers.js";
const { requestPasswordReset, resetPassword, verifyToken } = authController;

const router = Router();

// Envio de correo para restablecer la contraseña con el token
router.post('/request-reset', requestPasswordReset);

// Ruta para verificar el token
router.post("/verify-token", verifyToken);

// Ruta para restablecer la contraseña
router.post('/reset-password', resetPassword);

export default router;