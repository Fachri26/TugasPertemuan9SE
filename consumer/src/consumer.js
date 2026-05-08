require('dotenv').config();

const db = require('./config/db');
const connectRabbitMQ = require('./config/rabbitmq');

async function startConsumer() {

  const channel = await connectRabbitMQ();

  console.log('Waiting for messages...');

  channel.consume('order_created', (msg) => {

    if (msg !== null) {

      const data = JSON.parse(msg.content.toString());

      console.log('Message received:', data);

     //simulasi

      setTimeout(() => {

        db.query(
          'UPDATE orders SET status = ? WHERE id = ?',
          ['processed', data.orderId],

          (err) => {

            if (err) {

              console.error('Failed processing order:', err);

              return;
            }

            console.log(`Order ${data.orderId} processed`);

            //ack message

            channel.ack(msg);
          }
        );

      }, 3000);
    }
  });
}

startConsumer();