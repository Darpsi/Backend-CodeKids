import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'nicolasrodriguezromero1118@gmail.com',
        pass: 'xney jsnk ouha wrtx'
    },
});

// Función para enviar el correo de recuperación de contraseña
const sendResetEmail = async (email, token) => {
    const resetUrl = `http://localhost:3000/verify-token`;
    
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Recuperación de contraseña Codekids',
        text: `Tu código de recuperación de contraseña de Codekids es: ${token}.
        Haz clic en el siguiente enlace para restablecer tu contraseña: ${resetUrl}`,
    };

    await transporter.sendMail(mailOptions);
};

export default { sendResetEmail };
