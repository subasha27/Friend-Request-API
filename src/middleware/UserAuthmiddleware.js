const jwt = require("jsonwebtoken");
const signToken = process.env.signToken;



function authenticateToken(req, res, next) {
    const token = req.header('Authorization')?.replace('Bearer ', '')||req.query.token;
    if (!token) return res.status(401).json({ message: 'Authorization token not found' });

    try {
        const decoded = jwt.verify(token, signToken);
        req.id = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
}

module.exports = authenticateToken;   