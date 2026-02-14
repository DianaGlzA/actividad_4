const checkRole = (roles) => {
    return (req, res, next) => {
        if(!req.user){
            return res.status(401).json({message: 'Usuario no autenticado'})
        }
        if(!roles.incluidos(req.user.role)){
            return res.status(403).json({message: 'Acceso denegado, rol insuficiente', required: roles,
                current: req.user.role
            })
        }
        next();
    };
};

module.exports = checkRole;

