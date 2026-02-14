const jwt = require('jsonwebtoken');
const verifyToken = require('../src/middleware/auth.middleware');

describe('Auth Middleware', () => {
    let mockReq;
    let mockRes;
    let mockNext;
    
    beforeEach(() => {
        mockReq = {
            headers: {}
        };
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        mockNext = jest.fn();
    });
    
    it('debería rechazar solicitud sin token', () => {
        verifyToken(mockReq, mockRes, mockNext);
        
        expect(mockRes.status).toHaveBeenCalledWith(401);
        expect(mockRes.json).toHaveBeenCalledWith({
            message: 'acceso denegado, token no proporcionado'
        });
        expect(mockNext).not.toHaveBeenCalled();
    });
    
    it('debería rechazar token inválido', () => {
        mockReq.headers.authorization = 'Bearer invalid_token';
        
        verifyToken(mockReq, mockRes, mockNext);
        
        expect(mockRes.status).toHaveBeenCalledWith(401);
        expect(mockRes.json).toHaveBeenCalledWith({
            message: 'token no válido'
        });
        expect(mockNext).not.toHaveBeenCalled();
    });
    
    it('debería permitir token válido', () => {
        const token = jwt.sign(
            { id: 'testId', role: 'admin' },
            process.env.JWT_SECRET || 'test_secret',
            { expiresIn: '1h' }
        );
        mockReq.headers.authorization = `Bearer ${token}`;
        
        verifyToken(mockReq, mockRes, mockNext);
        
        expect(mockNext).toHaveBeenCalled();
        expect(mockReq.user).toBeDefined();
        expect(mockReq.user.id).toBe('testId');
        expect(mockReq.user.role).toBe('admin');
    });
});