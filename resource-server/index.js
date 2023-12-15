const express = require('express');
const app = express();
const { join } = require('path');
const axios = require('axios');
const cookieParser = require('cookie-parser');

app.use(cookieParser());

app.get('/resource/:resource_name', async (req, res) => {
  try {
    const { authorization_code, client_id } = req.query;
    await axios.get(
      'http://localhost:3030/introspect?authorization_code=' +
        authorization_code +
        '&client_id=' +
        client_id
    );
    res.sendFile(join(__dirname, 'public', req.params.resource_name));
  } catch (error) {
    res.status(403).location('http://localhost:3040').send('Unauthorized');
  }
});

const port = 3040;
app.listen(port, () => {
  console.log(`Resource server is running on port ${port}`);
});
