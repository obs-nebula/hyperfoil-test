const { Kafka } = require('kafkajs');

const kfk = new Kafka({
  clientId: 'data-filter-service',
  brokers: ['kafka:9092']
});

const consumer = kfk.consumer({ groupId: 'test' });

function filterMessage(msg) {
  const newMsg = msg.split(' ').filter(token => {
    return token.length < 6;
  }).join(' ');
  return newMsg;
}

function sendToDB() {
  console.log('send to db');
}

function pingDDS() {
  console.log('ping DDS');
}

const run = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'msgs', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const newMessage = filterMessage(message.value.toString());
      sendToDB();
      pingDDS();
    }
  });
};

run();
