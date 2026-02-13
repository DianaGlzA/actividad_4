const Laptop = require('../models/laptop');

class LaptopsController {

    async getAll(req, res) {
        try {
            const laptops = await Laptop.find().sort({ createdAt: -1 });
            res.json(laptops);
        } catch (error) {
            res.status(500).json({ 
                message: 'Error al obtener laptops', 
                error: error.message 
            });
        }
    }

    async getById(req, res) {
        try {
            const laptop = await Laptop.findById(req.params.id);
            if (!laptop) {
                return res.status(404).json({ 
                    message: 'Laptop no encontrada' 
                });
            }
            res.json(laptop);
        } catch (error) {
            res.status(500).json({ 
                message: 'Error al obtener laptop', 
                error: error.message 
            });
        }
    }

    async create(req, res) {
        try {
            const laptop = await Laptop.create(req.body);
            res.status(201).json({
                message: 'Laptop creada exitosamente',
                laptop
            });
        } catch (error) {
            res.status(500).json({ 
                message: 'Error al crear laptop', 
                error: error.message 
            });
        }
    }

    async update(req, res) {
        try {
            const laptop = await Laptop.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true, runValidators: true }
            );
            if (!laptop) {
                return res.status(404).json({ 
                    message: 'Laptop no encontrada' 
                });
            }
            res.json({
                message: 'Laptop actualizada exitosamente',
                laptop
            });
        } catch (error) {
            res.status(500).json({ 
                message: 'Error al actualizar laptop', 
                error: error.message 
            });
        }
    }

    async delete(req, res) {
        try {
            const laptop = await Laptop.findByIdAndDelete(req.params.id);
            if (!laptop) {
                return res.status(404).json({ 
                    message: 'Laptop no encontrada' 
                });
            }
            res.json({ message: 'Laptop eliminada exitosamente' });
        } catch (error) {
            res.status(500).json({ 
                message: 'Error al eliminar laptop', 
                error: error.message 
            });
        }
    }
}

module.exports = new LaptopsController();