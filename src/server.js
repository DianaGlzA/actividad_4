const path = require('path');
require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db')
const app = express(); 

// Archivos estáticos
app.use(express.static(path.join(__dirname, '../public')));

// Ruta principal muestra el login
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/login.html'));
});

connectDB();
 
app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/laptops', require('./routes/laptops.routes'));

app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
