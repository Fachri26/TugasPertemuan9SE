const express = require('express');
const passport = require('passport');
const router = express.Router();

const authController = require('../controllers/authController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
);


router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/auth/login-failed',
    session: false
  }),

  (req, res) => {
    res.json({
      message: 'Google login success',
      token: req.user.token
    });
  }
);

router.get('/login-failed', (req, res) => {
  res.status(401).json({
    error: 'Google login failed'
  });
});

// admin only
router.delete('/users/:id', verifyToken, isAdmin, authController.softDelete);

module.exports = router;