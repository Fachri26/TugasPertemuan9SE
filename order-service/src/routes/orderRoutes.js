const express = require('express');

const router = express.Router();

const {
  createProduct,
  getProducts,
  createOrder
} = require('../controllers/orderController');

const {
  verifyToken
} = require('../middleware/authMiddleware');

//products

router.post('/products', verifyToken, createProduct);

router.get('/products', getProducts);

//orders

router.post('/orders', verifyToken, createOrder);

module.exports = router;