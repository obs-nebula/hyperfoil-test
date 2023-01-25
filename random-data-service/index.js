const express = require('express');
const Chance = require('chance');

const app = express();
const port = 8080;
const chance = new Chance();

app.get('/', (_, res) => {
  // TODO: to call a post on fastify service to send
  // the sentence.
  res.send(chance.sentence());
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});