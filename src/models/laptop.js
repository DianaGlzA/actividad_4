const mongoose = require('mongoose');
const laptopSchema = new mongoose.Schema({
    marca: { type: String, required: true},
    modelo: { type: String, required: true},
    precio: { type: Number, required: true},
    ram: { type: Number, required: true},
    alemacenamiento: { type: Number, required: true},
    procesador: { type: String, required: true},
    disponibilidad: { type: Boolean, default: true}
}, { timestamps: true });
module.exports = mongoose.model('Laptop', laptopSchema, 'laptops');

