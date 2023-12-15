const express = require('express');
const { join } = require('path');
const app = express();

const bodyParser = require('body-parser');

app.use(express.static(join(__dirname, 'static')));
app.use(bodyParser.json());

const authMap = new Map();

const generateAuthCode = () => {
  return Math.random().toString(36).substring(7);
};

app.post('/authorize', (req, res) => {
  const { response_type, client_id, state, redirect_uri } = req.query;
  const { username, password } = req.body;

  if (username === 'admin' && password === 'admin') {
    const authorizationCode = generateAuthCode();

    authMap.set(client_id, authorizationCode);

    res
      .status(200)
      .send({ redirect_uri, authorization_code: authorizationCode, state });
  } else {
    return res.status(403).send('auth failed');
  }
});

app.get('/introspect', (req, res) => {
  const { authorization_code, client_id } = req.query;
  if (authMap.get(client_id) === authorization_code) {
    res.status(200).send('OK');
  } else {
    res.status(403).send('Unauthorized');
  }
});

app.get('/revoke', (req, res) => {
  const { client_id, redirect_uri } = req.query;
  authMap.delete(client_id);
  res.status(302).location(redirect_uri).send('OK');
});

app.get('/auth', (req, res) => {
  res.sendFile(join(__dirname, './static/index.html'));
});

app.listen(3030, () => {
  console.log('Auth server is running on port 3030');
});
