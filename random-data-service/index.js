const express = require('express');
const Chance = require('chance');

const app = express();
const port = 8080;
const chance = new Chance();

app.get('/', async (req, _) => {
  const paragraph = chance.paragraph();

  const customHeaders = {
    'Content-Type': 'application/json',
  }
  
  try {
    await fetch('http://localhost:8081/', {
      method: "POST",
      headers: customHeaders,
      body: JSON.stringify({ msg: paragraph }),
    });
  } catch (err) {
    console.log(req);
    console.error(err);
  }

});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
