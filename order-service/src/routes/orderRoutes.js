const express = require('express');

const router = express.Router();

const {
  createProduct,
  getProducts,
  createOrder
} = require('../controllers/orderController');

const {
  verifyToken,
  isAdmin
} = require('../middleware/authMiddleware');

//products

router.post('/products', verifyToken, isAdmin, createProduct);

router.get('/products', getProducts);

//orders

router.post('/orders', verifyToken, createOrder);

module.exports = router;