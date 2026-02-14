const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const router = express.Router();

const authController = require('../controllers/auth.controller');
router.post('/register', authController.register);
router.post('/login', authController.login);

//Registro de usuario
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await user.create({ username, email, password: hashedPassword });
        res.status(201).json({ message: 'Usuario registrado exitosamente', user });
    } catch (error) {
        res.status(500).json({ message: 'Error al registrar usuario', error });
    }
});

//Login de usuario
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: 'Contraseña incorrecta' });
        }
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({token});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

module.exports = router;
