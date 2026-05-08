const amqp = require('amqplib');

async function connectRabbitMQ() {

  const connection = await amqp.connect(process.env.RABBITMQ_URL);

  const channel = await connection.createChannel();

  await channel.assertQueue('order_created');

  console.log('Consumer connected to RabbitMQ');

  return channel;
}

module.exports = connectRabbitMQ;