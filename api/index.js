const { promisify } = require('util');
const Koa = require('koa');
const mongoose = require('mongoose');
const logger = require('koa-logger');
const cors = require('kcors');
const bodyParser = require('koa-bodyparser');
const routes = require('./routes');
const config = require('./config');
let pubsubLib = require('redis'),
  subscriber = pubsubLib.createClient(),
  publisher = pubsubLib.createClient();
// redis
const Redis = require('then-redis');

const redis = Redis.createClient();


// Make mongoose use native ES6 promises
mongoose.Promise = global.Promise;

// Connect to MongoDB
mongoose.connect(config.database.url, config.database.opts);

// Websocket
// Create the Socket
let WebSocketServer = require('ws').Server,
  wss = new WebSocketServer({ port: 4200 });

wss.broadcast = function broadcast(data) {
  console.log('data: ', data);
  wss.clients.forEach((client) => {
    console.log('data2: ', data);
    client.send(data);
  });
};

// broadcast
subscriber.subscribe('publish');
subscriber.on('message', async (channel, payloadS) => {
  const tag = ' | publish | ';
  try {
    const payload = JSON.parse(payloadS);
    let sequence = await redis.incrby('sequence', 1);
    sequence += 1;
    payload.sequence = sequence;
    console.log(payload);
    wss.broadcast(JSON.stringify(payload));
  } catch (e) {
    console.log(tag, 'payloadS: ', payloadS);
    console.error(tag, 'ERROR: ', e);
  }
});

// App
const app = new Koa()
  .use(cors())
  .use(logger())
  .use(bodyParser())
  .use(routes.routes())
  .use(routes.allowedMethods());


const server = app.listen(config.server.port);

module.exports = server;
