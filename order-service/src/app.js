require('dotenv').config();

const express = require('express');

const orderRoutes = require('./routes/orderRoutes');

const {
  connectRabbitMQ
} = require('./config/rabbitmq');

const app = express();

app.use(express.json());

app.use('/api', orderRoutes);

const PORT = process.env.PORT;

app.listen(PORT, async () => {

  console.log(`Order Service running on ${PORT}`);

  await connectRabbitMQ();
});