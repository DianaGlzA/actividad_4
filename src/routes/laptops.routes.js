const express = require('express');
const Laptop = require('../models/laptop');
const verifyToken = require('../middleware/auth.middleware');
const checkRole = require('../middleware/role.middleware');

const router = express.Router();

router.get('/', async (req, res) => {
    const laptops = await Laptop.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(laptops);
}); 

router.delete('/:id', verifyToken, checkRole(['admin']), async (req, res) => {
    await Laptop.findByIdAndDelete(req.params.id);
    res.json({ message: 'Laptop eliminada' });
});

module.exports = router;

