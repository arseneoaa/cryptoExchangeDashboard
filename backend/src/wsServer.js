const WebSocket = require('ws');
const { getOrderBookStats } = require('./sink');

const SERVER_PORT_NUMBER = 8088;

// todo add cleanup for closed connections

function setupWSServer() {
  const wss = new WebSocket.Server({ port: SERVER_PORT_NUMBER });
  console.log(`[ws server] WebSocket server is listening on port ${SERVER_PORT_NUMBER}.`)
  wss.on('connection', function connection(ws) {
    ws.on('message', (message) => {
      console.log('received: %s', message);
    });

    console.log('getOrderBookStats', typeof getOrderBookStats);
    ws.send(JSON.stringify(getOrderBookStats()));
  });
  return wss;
}

class wsServer {
  constructor() {
    this.wss = setupWSServer();
  }
  broadCastToAllClients (data) {
    this.wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  }
}

// the ws server is a singleton
module.exports = new wsServer();