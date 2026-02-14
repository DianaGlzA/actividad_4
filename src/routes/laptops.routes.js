const express = require('express');
const Laptop = require('../models/laptop');
const verifyToken = require('../middleware/auth.middleware');
const checkRole = require('../middleware/role.middleware');
const laptopsController = require('../controllers/laptops.controller'); 
const router = express.Router();

// Rutas públicas
router.get('/', laptopsController.getAll);
router.get('/:id', laptopsController.getById);

// Rutas protegidas (solo admin)
router.post('/', verifyToken, checkRole(['admin']), laptopsController.create);
router.put('/:id', verifyToken, checkRole(['admin']), laptopsController.update);
router.delete('/:id', verifyToken, checkRole(['admin']), laptopsController.delete);

module.exports = router;

