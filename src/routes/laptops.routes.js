const express = require('express');
const Laptop = require('../models/laptop');
const verifyToken = require('../middleware/auth.middleware');
const checkRole = require('../middleware/role.middleware');
const laptopsController = require('../controllers/laptops.controller'); 
const verifyToken = require('../middleware/auth.middleware');
const checkRole = require('../middleware/role.middleware');
const router = express.Router();

router.get('/', laptopsController.getAll);
router.get('/:id', laptopsController.getById);

router.get('/', async (req, res) => {
    const laptops = await Laptop.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(laptops);
}); 

router.delete('/:id', verifyToken, checkRole(['admin']), async (req, res) => {
    await Laptop.findByIdAndDelete(req.params.id);
    res.json({ message: 'Laptop eliminada' });
});

router.post('/', verifyToken, checkRole(['admin']), laptopsController.create);
router.put('/:id', verifyToken, checkRole(['admin']), laptopsController.update);
router.delete('/:id', verifyToken, checkRole(['admin']), laptopsController.delete);

module.exports = router;

