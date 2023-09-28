const jwt = require("jsonwebtoken");
const secretToken = process.env.secretToken
function verifyToken(req, res, next) {
    const token =  req.query.token;

    if (!token) return res.status(401).json({ message: 'Authentication failed. Token not provided.' });
    try {
        const decoded = jwt.verify(token, secretToken);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Authentication failed. Invalid token.' });
    }
}

module.exports = verifyToken;
