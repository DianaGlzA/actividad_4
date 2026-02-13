const checkRole = (roles) => {
    return (req, res, next) => {
        if (req.user !== role){
            return res.status(403).json({ message: 'acceso denegado, rol insuficiente' });
        }
        next();
    };
};

module.exports = checkRole;

