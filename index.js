const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 3000;

mongoose.connect('mongodb://root:example@mongo:27017/?authSource=admin')
  .then(() => console.log('Connected to MongoDB...'))
  .catch((err)=> console.log('Could not connect to MongoDB...', err));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => console.log('listening on port ' + port));
