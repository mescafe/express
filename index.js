const express = require('express');
const mongoose = require('mongoose');
const { MONGO_USER, MONGO_PASSWORD, MONGO_IP, MONGO_PORT } = require('./config/config');
const app = express();
const port = process.env.PORT || 3000;
const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`;

const connectWithRetry = () => {
  mongoose
  .connect(mongoURL)
  .then(() => console.log('Connected to MongoDB...'))
  .catch((err)=> console.log('Could not connect to MongoDB...', err)
  .setTimeout(connectWithRetry, 5000)
  );
}

connectWithRetry();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => console.log('listening on port ' + port));
