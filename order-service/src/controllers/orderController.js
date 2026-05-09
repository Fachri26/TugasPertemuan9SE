const db = require('../config/db');
const { getChannel } = require('../config/rabbitmq');

exports.createProduct = (req, res) => {

  const { name, price } = req.body;

  if (!name || typeof price !== 'number' || price <= 0) {
    return res.status(400).json({
      success: false,
      error: 'Invalid input: Name is required and price must be a positive number'
    });
  }

  db.query(
    'INSERT INTO products (name, price) VALUES (?, ?)',
    [name, price],
    (err, result) => {

      if (err) {
        return res.status(500).json(err);
      }

      res.json({
        message: 'Product created',
        productId: result.insertId
      });
    }
  );
};

exports.getProducts = (req, res) => {

  db.query(
    'SELECT * FROM products',
    (err, result) => {

      if (err) {
        return res.status(500).json(err);
      }

      res.json(result);
    }
  );
};

exports.createOrder = (req, res) => {

  const { product_id, quantity } = req.body;

  const user_id = req.user.id;

  if (!product_id || !quantity) {
    return res.status(400).json({
      error: 'All fields required'
    });
  }

  db.query(
    'SELECT * FROM products WHERE id = ?',
    [product_id],
    (err, products) => {

      if (err) {
        return res.status(500).json(err);
      }

      if (products.length === 0) {
        return res.status(404).json({
          error: 'Product not found'
        });
      }

      db.query(
        `INSERT INTO orders 
        (user_id, product_id, quantity)
        VALUES (?, ?, ?)`,
        [user_id, product_id, quantity],

        (err, result) => {

          if (err) {
            return res.status(500).json(err);
          }

        //publish ke rabbitmq

          const channel = getChannel();

          const message = {
            orderId: result.insertId,
            userId: user_id,
            productId: product_id,
            quantity
          };

          channel.sendToQueue(
            'order_created',
            Buffer.from(JSON.stringify(message))
          );

          res.json({
            message: 'Order created',
            orderId: result.insertId
          });
        }
      );
    }
  );
};

