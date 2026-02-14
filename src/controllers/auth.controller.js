const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

class AuthController {
    async register(req, res) {
        try {
            const { username, email, password } = req.body;
            const existingUser = await User.findOne({ email });

        if (existingUser) { 
            return res.status(400).json({
                message: 'El email ya está registrado'
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        username,
        email,
        password: hashedPassword
    });

    const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    res.status(201).json({
        message: 'Usuario registrado exitosamente',
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        },
        token
    });
} catch (error) {
    res.status(500).json({
        message: 'Error al registrar usuario',
        error: error.message
    });
}
    }

    async login(req, res){
        try {
            const { email, password } = req.body;

            const user = await User.findOne({ email });
            if (!user) {
                return res.status(404).json({
                    message: 'Usuario no encontrado'
                });
            }

            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                return res.status(400).json({
                    message: 'Contraseña incorrecta'
                });
            }

            const token = jwt.sign(
                { id: user._id, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            res.json({
                message: 'Login exitoso',
                token,
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role
                }
            });
        } catch (error) {
            res.status(500).json({
                message: 'Error en el login',
                error: error.message
            });
        }
    }
}

module.exports = new AuthController();