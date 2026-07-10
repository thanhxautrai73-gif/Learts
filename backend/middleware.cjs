const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'learts-secret-key-123456';

function authenticateAdmin(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No token provided.'
    });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({
      success: false,
      message: 'Token error. Format must be Bearer <token>'
    });
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. Invalid or expired token.'
    });
  }
}

module.exports = {
  authenticateAdmin,
  JWT_SECRET
};
