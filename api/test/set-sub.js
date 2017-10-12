/**
 * Created by highlander on 10/11/17.
 */
const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:4200');

ws.on('open', function open() {
    ws.send('something');
});

ws.on('message', function incoming(data) {
    console.log(data);
});