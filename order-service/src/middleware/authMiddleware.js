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

  exports.isAdmin = (req, res, next) => {

  if (req.user.role !== 'admin') {

    return res.status(403).json({
      error: 'Admin only'
    });
  }

  next();
};
