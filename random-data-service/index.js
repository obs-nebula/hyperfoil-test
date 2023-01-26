const express = require('express');
const Chance = require('chance');

const app = express();
const port = 8080;
const chance = new Chance();

app.get('/', async (_, res) => {
  const paragraph = chance.paragraph();
  console.log(paragraph);

  const customHeaders = {
    'Content-Type': 'application/json',
  }
  
  try {
    await fetch('http://dcs:8081/', {
      method: 'POST',
      headers: customHeaders,
      body: JSON.stringify({ msg: paragraph }),
    });
    res.send(paragraph);
  } catch (err) {
    console.error(err);
  }

});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
