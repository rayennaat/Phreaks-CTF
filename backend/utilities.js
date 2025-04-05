const jwt = require('jsonwebtoken')

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extract token from "Bearer <token>"
  
    console.log('Token received:', token); // Debugging: Log the token
  
    if (!token) {
      console.log('No token provided');
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }
  
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        console.log('Token verification failed:', err.message); // Debugging: Log the error
        return res.status(403).json({ message: 'Forbidden: Invalid token' });
      }
  
      console.log('Decoded user data:', user); // Debugging: Log the decoded user data
      req.user = user;
      next();
    });
  }

module.exports = {
    authenticateToken,
};