const WebSocket = require("ws");
const OrderBook = require("./OderBook");

// See https://www.kraken.com/features/websocket-api#message-book for payload example
const normalizePayload = (payload) => {
  if (payload.length === 5) {
    // this is for update payloads with both asks and bids
    const [, { a: asks }, { b: bids, c: checksum }, , pair] = payload;
    return { asks, bids, pair, payloadType: "update" };
  }
  // payload.length === 4 (see docs above)
  // this is for snapshot payloads or updates
  const [
    ,
    {
      as: snapShotAsks,
      bs: snapshotBids,
      a: updateAsks,
      b: updateBids,
      c: checksum,
    },
    ,
    pair,
  ] = payload;
  // ask || bid || (asks && bids)
  if (snapShotAsks && snapshotBids) {
    // this is a snapshot
    return {
      payloadType: "snapshot",
      asks: snapShotAsks,
      bids: snapshotBids,
      pair,
    };
  }
  // this is an update, we either have updateAsks or (exclusive or) updateBids
  return {
    payloadType: "update",
    asks: updateAsks,
    bids: updateBids,
    pair,
    checksum,
  };
};

function startKrakenMonitoring({ symbol }) {
  const orderbook = new OrderBook("Kraken" + symbol);
  const ws = new WebSocket("wss://ws.kraken.com");

  ws.onopen = function onOpen() {
    console.log(`[kraken ${symbol}] Connection open`);

    ws.send(
      JSON.stringify({
        event: "subscribe",
        pair: [symbol],
        subscription: {
          name: "book",
          depth: 100,
        },
      })
    );
  };

  ws.onmessage = function onMessage({ data }) {
    const payload = JSON.parse(data);

    if (Array.isArray(payload)) {
      const { asks, bids, pair, payloadType, checksum } = normalizePayload(
        payload
      );

      if (pair !== symbol) {
        throw new Error(`${pair} update received. Expected: ${symbol}`);
      }

      if (payloadType === "snapshot") {
        orderbook.resetOrderBookFromSnapshot({ bids, asks });
      } else {
        orderbook.updateOrderBook({ bids, asks, checksum });
      }
    } else {
      const { event } = payload;
      if (event === "heartbeat") {
        console.log(`[kraken ${symbol}] Heartbeat received`);
      } else if (["systemStatus", "subscriptionStatus"].includes(event)) {
        // do nothing
      } else {
        console.error("Unknown update received", payload);
      }
    }
  };

  ws.onerror = function onError(e) {
    console.error(e);
  };

  ws.onclose = function onClose(e) {
    console.error("[kraken] WebSocket connection closed", JSON.stringify(e));
    process.exit(2);
  };
}

module.exports = {
  startKrakenMonitoring,
};
