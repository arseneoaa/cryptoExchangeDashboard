import React, { useState, useEffect } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';

import { IExchangeData } from '../interfaces';
import ExchangeCard from './ExchangeCard';
import { normalizePayload, getInfoFromAsksAndBids } from '../utils';
import { useUpdatesPerMinute } from '../hooks';

const krakenConfig = {
  // name displayed on the card
  name: 'Kraken',
  pair: 'XBT/USD',
  // web socket part
  wsUrl: 'ws.kraken.com',
  // message sent to subscribe to updates
  subscriptionMessage: {
    event: "subscribe",
    subscription: {
      name: "book",
      depth: 100
    },
  },
};

export default function Dashboard() {
  const [exchangeCardData, setExchangeCardData] = useState <IExchangeData>({
    // todo remove pair from name
    name: `${krakenConfig.name} ${krakenConfig.pair}`,
    updatesPerMinute: 0,
    midPrice: 0,
    spread: 0,
    asks: [],
    bids: [],
    topAsks: [],
    topBids: [],
  });
  const { updatesPerMinute, recordNewUpdate } = useUpdatesPerMinute();

  const [socketUrl, setSocketUrl] = useState(`wss://${krakenConfig.wsUrl}`);
  const {
    sendJsonMessage,
    readyState, //todo update display according to this
  } = useWebSocket(socketUrl, {
    share: true,
    // Will attempt to reconnect on all close events, such as server shutting down
    shouldReconnect: (closeEvent) => true,
    onMessage: ({ data }) => {
      const payload = JSON.parse(data);

      if (Array.isArray(payload)) {
        const { ask, asks, bid, bids, pair } = normalizePayload(payload);

        if (pair !== krakenConfig.pair) {
          throw new Error(`${pair} update received. Expected: ${krakenConfig.pair}`);
        }

        if (bids && asks) {
          recordNewUpdate();
          setExchangeCardData({
            ...exchangeCardData,
            asks,
            bids,
            updatesPerMinute,
            ...getInfoFromAsksAndBids(asks, bids),
          });
        } else {
          recordNewUpdate();
          // These are updates, not orderbook snapshots. In a normal implementation they should update the last
          // orderbook snapshot in memory and deliver the up-to-date orderbook.
          let updatedAsks = exchangeCardData.asks;
          let updatedBids = exchangeCardData.bids;
          if (ask) {
            updatedAsks = exchangeCardData.asks.concat(ask);
          }
          if (bid) {
            updatedBids = exchangeCardData.bids.concat(bid);
          }
          setExchangeCardData({
            ...exchangeCardData,
            asks: updatedAsks,
            bids: updatedBids,
            updatesPerMinute,
            ...getInfoFromAsksAndBids(updatedAsks, updatedBids),
          });
        }
      } else {
        const { event } = payload;
        if (event === "heartbeat") {
          console.log("[kraken] Heartbeat received");
        } else if (["systemStatus", "subscriptionStatus"].includes(event)) {
          // do nothing
        } else {
          console.error("Unknown update received", payload);
        }
      }
    }
  });

  useEffect(() => {
    const subscriptionMessage = {
      ...krakenConfig.subscriptionMessage,
      pair: [krakenConfig.pair],
    }
    sendJsonMessage(subscriptionMessage);
  }, []);

  return (
    <ExchangeCard data={exchangeCardData}></ExchangeCard>
  );
}