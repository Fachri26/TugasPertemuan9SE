require('dotenv').config();

const express = require('express');

const orderRoutes = require('./routes/orderRoutes');

const {
  connectRabbitMQ
} = require('./config/rabbitmq');

const helmet = require('helmet');

const app = express();

app.use(helmet());

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({
    service: 'order-service',
    status: 'up and running',
    timestamp: new Date()
  });
});

app.use('/api', orderRoutes);

const PORT = process.env.PORT;

app.listen(PORT, async () => {

  console.log(`Order Service running on ${PORT}`);

  await connectRabbitMQ();
});