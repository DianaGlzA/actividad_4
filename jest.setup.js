// Configuración global para Jest
process.env.JWT_SECRET = 'test_secret_key_for_testing_only';
process.env.NODE_ENV = 'test';
process.env.MONGO_URI_TEST = 'mongodb://localhost:27017/test_db';
