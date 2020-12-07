import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import KrakenExchange from './KrakenExchange';
import { IKrakenConfig } from '../interfaces';

const krakenConfigXBTUSD: IKrakenConfig = {
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

const krakenConfigETHUSD: IKrakenConfig = {
  // name displayed on the card
  name: 'Kraken',
  pair: 'ETH/USD',
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

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexFlow: 'row wrap',
    justifyContent: 'space-between'
  },
  exchangeItem: {
    flex: '1 1 auto',
  },
});

export default function Dashboard() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <div className={classes.exchangeItem} >
        <KrakenExchange config={krakenConfigXBTUSD} />
      </div>
      <div className={classes.exchangeItem} >
        <KrakenExchange config={krakenConfigETHUSD} />
      </div>
    </div>
  );
}
