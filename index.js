const express = require('express');
const mongoose = require('mongoose');
const redis = require('redis');
const RedisStore = require("connect-redis").default;
const session = require('express-session');
const { MONGO_USER, MONGO_PASSWORD, MONGO_IP, MONGO_PORT, REDIS_URL, REDIS_PORT, SESSION_SECRET } = require('./config/config');
const app = express();
const port = process.env.PORT || 3000;
const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`;
const postRouter = require('./routes/postRoutes');
const userRouter = require('./routes/userRoutes');

// Initialize client.
let redisClient = redis.createClient({
  socket: {
    host: REDIS_URL,
    port: REDIS_PORT
  },
})
redisClient.connect().catch(console.error)

// Initialize store.
let redisStore = new RedisStore({
  client: redisClient
})

const connectWithRetry = () => {
  mongoose
  .connect(mongoURL)
  .then(() => console.log('Connected to MongoDB...'))
  .catch((err)=> console.log('Could not connect to MongoDB...', err)
  .setTimeout(connectWithRetry, 5000)
  );
}

connectWithRetry();

app.use(express.json());

// Initialize sesssion storage.
app.use(
  session({
    store: redisStore,
    resave: false, // required: force lightweight session keep alive (touch)
    saveUninitialized: false, // recommended: only save session when data exists
    secret: SESSION_SECRET,
    cookie: {
      secure: false, // recommended: only set cookies over https. In production you should use secure:true
      httpOnly: true, // recommended: don't let JS code access cookies. Browser extensions run JS code on your browser!
      maxAge: 1000 * 60 * 60, // 1 hour
    }
  })
)


app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api/v1/posts', postRouter);
app.use('/api/v1/users', userRouter);

app.listen(port, () => console.log('listening on port ' + port));
