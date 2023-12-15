const express = require('express');
const { join } = require('path');
const app = express();

app.listen(3020, () => {
  console.log('Server is running on port 3020');
});

app.use(express.static(join(__dirname, 'public')));
