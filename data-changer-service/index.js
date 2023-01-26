const fastify = require('fastify')();
const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'data-changer-service',
  brokers: ['kafka:9092']
});

const producer = kafka.producer();

function changeMessage(msg) {
  const newMsg = msg.split(' ').filter(token => {
    return token.length < 8;
  }).join(' ');
  return newMsg;
}

fastify.post('/', async (request, reply) => {
  const newMessage = changeMessage(request.body.msg);
  await producer.connect();
  try {
    await producer.send({
      topic: 'msgs',
      messages: [{ value: newMessage }]
    });
  } catch (err) {
    console.log(err);
  }
  reply.send(newMessage);
});

fastify.get('/', (_, reply) => {
  reply.send('ok');
});

fastify.listen({ host: '0.0.0.0', port: 8081 }, (err, _) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
});