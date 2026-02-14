const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Laptop = require('../src/models/laptop');
const laptopsController = require('../src/controllers/laptops.controller');
const verifyToken = require('../src/middleware/auth.middleware');
const checkRole = require('../src/middleware/role.middleware');

// Configuración del app de prueba
const createTestApp = () => {
    const app = express();
    app.use(express.json());
    
    // Rutas públicas
    app.get('/api/laptops', laptopsController.getAll);
    app.get('/api/laptops/:id', laptopsController.getById);
    
    // Rutas protegidas
    app.post('/api/laptops', verifyToken, checkRole(['admin']), laptopsController.create);
    app.put('/api/laptops/:id', verifyToken, checkRole(['admin']), laptopsController.update);
    app.delete('/api/laptops/:id', verifyToken, checkRole(['admin']), laptopsController.delete);
    
    return app;
};

// Generar token de prueba
const generateTestToken = (role = 'user') => {
    return jwt.sign(
        { id: 'testId', role },
        process.env.JWT_SECRET || 'test_secret',
        { expiresIn: '1h' }
    );
};

describe('Laptops Controller', () => {
    let app;
    
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/test_db');
        app = createTestApp();
    });
    
    afterEach(async () => {
        await Laptop.deleteMany({});
    });
    
    afterAll(async () => {
        await mongoose.connection.close();
    });
    
    describe('GET /api/laptops', () => {
        it('debería obtener todas las laptops', async () => {
            // Crear laptops de prueba
            await Laptop.create([
                { marca: 'Dell', modelo: 'XPS', precio: 1500, ram: 16, almacenamiento: 512, procesador: 'Intel' },
                { marca: 'HP', modelo: 'Pavilion', precio: 800, ram: 8, almacenamiento: 256, procesador: 'AMD' }
            ]);
            
            const response = await request(app)
                .get('/api/laptops')
                .expect(200);
            
            expect(response.body.length).toBe(2);
        });
        
        it('debería retornar array vacío si no hay laptops', async () => {
            const response = await request(app)
                .get('/api/laptops')
                .expect(200);
            
            expect(response.body).toEqual([]);
        });
    });
    
    describe('GET /api/laptops/:id', () => {
        it('debería obtener laptop por ID', async () => {
            const laptop = await Laptop.create({
                marca: 'Dell',
                modelo: 'XPS',
                precio: 1500,
                ram: 16,
                almacenamiento: 512,
                procesador: 'Intel'
            });
            
            const response = await request(app)
                .get(`/api/laptops/${laptop._id}`)
                .expect(200);
            
            expect(response.body.marca).toBe('Dell');
            expect(response.body.modelo).toBe('XPS');
        });
        
        it('debería retornar 404 si laptop no existe', async () => {
            const fakeId = '507f1f77bcf86cd799439011';
            
            const response = await request(app)
                .get(`/api/laptops/${fakeId}`)
                .expect(404);
            
            expect(response.body.message).toBe('Laptop no encontrada');
        });
    });
    
    describe('POST /api/laptops', () => {
        it('debería crear laptop con token de admin', async () => {
            const adminToken = generateTestToken('admin');
            const laptopData = {
                marca: 'MacBook',
                modelo: 'Pro',
                precio: 2500,
                ram: 16,
                almacenamiento: 512,
                procesador: 'Apple M1'
            };
            
            const response = await request(app)
                .post('/api/laptops')
                .set('Authorization', `Bearer ${adminToken}`)
                .send(laptopData)
                .expect(201);
            
            expect(response.body.message).toBe('Laptop creada exitosamente');
            expect(response.body.laptop.marca).toBe(laptopData.marca);
        });
        
        it('debería rechazar creación sin token', async () => {
            const laptopData = {
                marca: 'MacBook',
                modelo: 'Pro',
                precio: 2500,
                ram: 16,
                almacenamiento: 512,
                procesador: 'Apple M1'
            };
            
            const response = await request(app)
                .post('/api/laptops')
                .send(laptopData)
                .expect(401);
            
            expect(response.body.message).toContain('token no proporcionado');
        });
        
        it('debería rechazar creación de usuario no-admin', async () => {
            const userToken = generateTestToken('user');
            const laptopData = {
                marca: 'MacBook',
                modelo: 'Pro',
                precio: 2500,
                ram: 16,
                almacenamiento: 512,
                procesador: 'Apple M1'
            };
            
            const response = await request(app)
                .post('/api/laptops')
                .set('Authorization', `Bearer ${userToken}`)
                .send(laptopData)
                .expect(403);
            
            expect(response.body.message).toContain('rol insuficiente');
        });
    });
    
    describe('PUT /api/laptops/:id', () => {
        it('debería actualizar laptop con token de admin', async () => {
            const laptop = await Laptop.create({
                marca: 'Dell',
                modelo: 'XPS',
                precio: 1500,
                ram: 16,
                almacenamiento: 512,
                procesador: 'Intel'
            });
            
            const adminToken = generateTestToken('admin');
            const updateData = { precio: 1400 };
            
            const response = await request(app)
                .put(`/api/laptops/${laptop._id}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send(updateData)
                .expect(200);
            
            expect(response.body.laptop.precio).toBe(1400);
        });
    });
    
    describe('DELETE /api/laptops/:id', () => {
        it('debería eliminar laptop con token de admin', async () => {
            const laptop = await Laptop.create({
                marca: 'Dell',
                modelo: 'XPS',
                precio: 1500,
                ram: 16,
                almacenamiento: 512,
                procesador: 'Intel'
            });
            
            const adminToken = generateTestToken('admin');
            
            const response = await request(app)
                .delete(`/api/laptops/${laptop._id}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200);
            
            expect(response.body.message).toBe('Laptop eliminada exitosamente');
            
            // Verificar que fue eliminada
            const deletedLaptop = await Laptop.findById(laptop._id);
            expect(deletedLaptop).toBeNull();
        });
        
        it('debería retornar 404 al eliminar laptop inexistente', async () => {
            const adminToken = generateTestToken('admin');
            const fakeId = '507f1f77bcf86cd799439011';
            
            const response = await request(app)
                .delete(`/api/laptops/${fakeId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(404);
            
            expect(response.body.message).toBe('Laptop no encontrada');
        });
    });
});