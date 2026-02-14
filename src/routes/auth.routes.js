const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const router = express.Router();

const authController = require('../controllers/auth.controller');
router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;
