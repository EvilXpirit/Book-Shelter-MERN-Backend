const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).send('Authorization header is missing');
  }

  const token = authHeader.replace('Bearer ', '');
  console.log('Token received:', token);

  try {
    const decoded = jwt.verify(token, 'your_jwt_secret');
    console.log('Decoded token:', decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('JWT verification failed:', error);
    res.status(401).send('Invalid token');
  }
};

module.exports = authMiddleware;
