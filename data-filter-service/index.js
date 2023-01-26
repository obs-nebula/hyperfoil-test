const { Kafka } = require('kafkajs');
const db = require('./db.js');

const io = require('socket.io-client');

const socket = io('http://dds:8083');
socket.on('news', (data) => {
  console.log(data);
});

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

function sendToDB(msg) {
  db.addMessage(msg);
}

function pingDDS(msg) {
  socket.emit('msg', {msg: msg});
}

const run = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'msgs', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const newMessage = filterMessage(message.value.toString());
      sendToDB(newMessage);
      // Trolling DDS here.
      pingDDS(message.value.toString());
    }
  });
};

run();
