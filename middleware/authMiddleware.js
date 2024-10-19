const jwt = require('jsonwebtoken');
require('dotenv').config();

function authorize(roles) {
    return (req, res, next) => {
        const token = req.headers['authorization']?.split(' ')[1];
        console.log("Received Token:", token);
    
        if (!token) 
            return res.sendStatus(401).json({ error: 'Access denied' });
       
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) 
                return res.sendStatus(403).json({ error: 'Invalid token' });
            
            console.log("Decoded User:", user);
    
            if (!roles.includes(user.role)) 
                return res.sendStatus(403).json({ error: "Role not authorized"});
    
            req.user = user;
            next();
        });
    };
}

module.exports = authorize;