/**
 * Created by highlander on 10/11/17.
 */


// const WebSocket = require('ws');
//
// const wss = new WebSocket.Server({ port: 4200 });
//
// // Broadcast to all.
// wss.broadcast = function broadcast(data) {
//   wss.clients.forEach((client) => {
//     if (client.readyState === WebSocket.OPEN) {
//       client.send(data);
//     }
//   });
// };
//
// wss.on('connection', (ws) => {
//   ws.on('message', (data) => {
//     // Broadcast to everyone else.
//     wss.clients.forEach((client) => {
//       if (client !== ws && client.readyState === WebSocket.OPEN) {
//         client.send(data);
//       }
//     });
//   });
// });


const pubsubLib = require('redis');

const publisher = pubsubLib.createClient();


const run = function () {
  const info = {};
  info.time = new Date().getTime();
  console.log(info)
  publisher.publish('publish', JSON.stringify(info));
};

setInterval(run, 1000);
