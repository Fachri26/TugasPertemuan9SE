require('dotenv').config();

const express = require('express');

const morgan = require('morgan');

const rateLimit = require('express-rate-limit');

const {
  createProxyMiddleware
} = require('http-proxy-middleware');

const helmet = require('helmet');

const app = express();

app.use(morgan('dev'));

app.use(helmet());

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100
});

app.use(limiter);

app.use(
  '/auth',
  createProxyMiddleware({
    target: process.env.AUTH_SERVICE_URL,
    changeOrigin: true
  })
);

app.use(
  '/api',
  createProxyMiddleware({
    target: process.env.ORDER_SERVICE_URL,
    changeOrigin: true
  })
);

app.get('/health', (req, res) => {
  res.json({
    gateway: 'running'
  });
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});