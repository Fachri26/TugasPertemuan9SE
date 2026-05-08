const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);

// admin only
router.delete('/users/:id', verifyToken, isAdmin, authController.softDelete);

module.exports = router;