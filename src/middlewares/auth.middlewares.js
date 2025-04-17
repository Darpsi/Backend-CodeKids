import db from '../db';

const validateResetToken = async (req, res, next) => {
    try {
        const { token } = req.body;
        const user = await db.query('SELECT id FROM users WHERE reset_token = $1 AND reset_token_expires > NOW()', [token]);

        if (!user.rows.length) return res.status(400).json({ error: 'Token inválido o expirado' });

        next();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export { validateResetToken };
