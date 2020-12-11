const WebSocket = require("ws");

const SERVER_PORT_NUMBER = 8088;

// this is the orchestration mechanism
// relevant statistic updates are sent here for processing

class Sync {
  wss;
  allExchangesData = {};

  constructor() {
    this.wss = this.setupWSServer();
  }

  handleNewStats = (data) => {
    // when new stats come up, we want to:
    // update the locally saved results,
    this.allExchangesData[data.name] = data;
    // send this raw info to the ws clients
    // later on, we can do some processing to get actionable insights and determine
    // if other notifications like email/phone call need to be sent too
    this.sendStatsToWSClients(data);
    // computeAggregateInsights();
    // notifyAdminsIfNeeded();
  };

  getAllExchangesData() {
    return Object.keys(this.allExchangesData).map(
      (name) => this.allExchangesData[name]
    );
  }

  sendStatsToWSClients(data) {
    this.broadCastToAllClients(data);
  }

  // todo add cleanup for closed connections
  setupWSServer() {
    const wss = new WebSocket.Server({ port: SERVER_PORT_NUMBER });
    console.log(
      `[ws server] WebSocket server is listening on port ${SERVER_PORT_NUMBER}.`
    );
    wss.on(
      "connection",
      function connection(ws) {
        ws.on("message", (message) => {
          console.log("[ws server] received: %s", message);
        });

        ws.send(JSON.stringify(this.getAllExchangesData()));
      }.bind(this)
    );
    return wss;
  }

  broadCastToAllClients(data) {
    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  }
}

module.exports = new Sync();
