const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {

  const header = req.headers.authorization;

  if (!header) {
    return res.status(403).json({
      error: 'No token provided'
    });
  }

  const token = header.split(' ')[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {

    if (err) {
      return res.status(403).json({
        error: 'Invalid token'
      });
    }

    req.user = decoded;

    next();
  });
};