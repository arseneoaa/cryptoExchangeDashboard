import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import useWebSocket, { ReadyState } from "react-use-websocket";

import ExchangeCard from "./ExchangeCard";
import { IExchangeCardData } from "../interfaces";

import { WS_URL, FORMATTINGS, THRESHOLDS } from "../config";

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexFlow: "column",
  },
  exchanges: {
    display: "flex",
    flexFlow: "row wrap",
    justifyContent: "space-between",
  },
  exchangeItem: {
    flex: "1 1 auto",
    margin: "20px",
  },
  moreInfo: {
    marginTop: "100px",
  },
});

export default function Dashboard() {
  const classes = useStyles();
  const [exchanges, setExchanges] = useState<IExchangeCardData[]>([]);

  const [socketUrl, setSocketUrl] = useState(WS_URL);
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
        // snapshot of all exchanges sent at connection time
        setExchanges(payload);
      } else {
        // update for a single exchange
        const newExchangesData = exchanges.concat();
        const indexOfItemToUpdate = newExchangesData.findIndex(
          (item) => item.name === payload.name
        );
        newExchangesData[indexOfItemToUpdate] = payload;
        setExchanges(newExchangesData);
      }
    },
  });

  return (
    <div className={classes.root}>
      <h1>Crypto pairs monitoring dashboard</h1>
      <div className={classes.exchanges}>
        {exchanges.map((exchange) => (
          <div className={classes.exchangeItem} key={exchange.name}>
            <ExchangeCard
              data={exchange}
              formatting={FORMATTINGS[exchange.name]}
              thresholds={THRESHOLDS[exchange.name]}
            ></ExchangeCard>
          </div>
        ))}
      </div>
      <span className={classes.moreInfo}>
        More info{" "}
        <a
          target="_blank"
          href="https://github.com/arseneoaa/cryptoExchangeDashboard"
        >
          here.
        </a>{" "}
      </span>
    </div>
  );
}
