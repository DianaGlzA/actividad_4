const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../src/models/user');
const authController = require('../src/controllers/auth.controller');

const createTestApp = () => {
    const app = express();
    app.use(express.json());
    app.post('/api/auth/register', authController.register);
    app.post('/api/auth/login', authController.login);
    return app;
};

describe('Auth Controller', () => {
    let app;

    beforeAll(async () => {
       await mongoose.connect(process.env.MONGO_URI_TEST || 
        'mongodb://localhost:27017/test_db'
       );
       app = createTestApp({}); 
    });
    
    beforeEach(async () => {
        // Limpiar usuarios antes de cada test
        await User.deleteMany({});
    });
    
    afterAll(async () => {
        await mongoose.connection.close();
    });
    describe('POST /api/auth/register', () => {
        it('debería registrar un usuario exitosamente',
            async () => {
                const userData = {
                    username: 'testuser',
                    email: 'test@example.com',
                    password: 'password123'
                };
                const response = await request(app)
                .post('/api/auth/register')
                .send(userData)
                .expect(201);

                expect(response.body.message).toBe('Usuario registrado exitosamente');
            expect(response.body.user.username).toBe(userData.username);
            expect(response.body.user.email).toBe(userData.email);
                expect(response.body.token).toBeDefined();
            }
        );
        it('debería rechazar email duplicado', async () => {
            // Crear usuario existente
            await User.create({
                username: 'existing',
                email: 'test@example.com',
                password: await bcrypt.hash('password123', 10)
            });
            
            const userData = {
                username: 'testuser',
                email: 'test@example.com',
                password: 'password123'
            };
            
            const response = await request(app)
                .post('/api/auth/register')
                .send(userData)
                .expect(400);
            
            expect(response.body.message).toBe('El email ya está registrado');
        });
        
        it('debería rechazar datos incompletos', async () => {
            const incompleteData = {
                username: 'testuser'
                // Falta email y password
            };
            
            const response = await request(app)
                .post('/api/auth/register')
                .send(incompleteData)
                .expect(500);
            
            expect(response.body.message).toBe('Error al registrar usuario');
        });
    });
    
    describe('POST /api/auth/login', () => {
        beforeEach(async () => {
            // Crear usuario de prueba
            await User.create({
                username: 'testuser',
                email: 'test@example.com',
                password: await bcrypt.hash('password123', 10)
            });
        });
        
        it('debería hacer login exitosamente con credenciales válidas', async () => {
            const credentials = {
                email: 'test@example.com',
                password: 'password123'
            };
            
            const response = await request(app)
                .post('/api/auth/login')
                .send(credentials)
                .expect(200);
            
            expect(response.body.message).toBe('Login exitoso');
            expect(response.body.token).toBeDefined();
            expect(response.body.user.email).toBe(credentials.email);
        });
        
        it('debería rechazar contraseña incorrecta', async () => {
            const credentials = {
                email: 'test@example.com',
                password: 'wrongpassword'
            };
            
            const response = await request(app)
                .post('/api/auth/login')
                .send(credentials)
                .expect(400);
            
            expect(response.body.message).toBe('Contraseña incorrecta');
        });
        
        it('debería rechazar email inexistente', async () => {
            const credentials = {
                email: 'nonexistent@example.com',
                password: 'password123'
            };
            
            const response = await request(app)
                .post('/api/auth/login')
                .send(credentials)
                .expect(404);
            
            expect(response.body.message).toBe('Usuario no encontrado');
        });
    });
});