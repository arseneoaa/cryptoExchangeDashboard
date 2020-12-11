const { startKrakenMonitoring } = require('./exchanges');

startKrakenMonitoring({ symbol: "ETH/XBT" });
startKrakenMonitoring({ symbol: "XBT/USD" });
