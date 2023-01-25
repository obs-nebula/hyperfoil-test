const { Kafka } = require('kafkajs');

const kfk = new Kafka({
  clientId: 'data-filter-service',
  brokers: ['http://localhost:9092']
});

const consumer = kfk.consumer({ groupId: 'test' });

const run = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'msgs', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {
      // Get the message
      // Filter the message
      // Send to DB
      // send 1 socket.io msg the other service ?
      console.log(message);
    }
  });
};

run();
