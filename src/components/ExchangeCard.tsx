import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';


const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: 275,
  },
  exchangeName: {
    fontSize: 14,
    color: theme.palette.text.secondary,
  },
  speed: {
  },
  orderBookLine: {
    display: 'flex',
    flexFlow: 'row nowrap',
    justifyContent: "space-between",
  },
  bids: {
    color: 'green',
  },
  asks: {
    color: 'red',
  },
  mainInfo: {
    display: 'flex',
    flexFlow: 'row nowrap',
    justifyContent: "space-between",
    fontSize: '25px'// todo use theme
  },
  midPrice: {

  },
  spread: {
    fontWeight: 'bold',
  }
}));

export default function ExchangeCard() {
  const classes = useStyles();

  const exchangeCardData = {
    name: 'Kraken BTC/USD',
    speed: 53,
    // todo add lib to round to 1 digit
    asks: [
      {
        value: 7107.3,
        otherValue: 25.0,
      },
      {
        value: 7107.2,
        otherValue: 0.9,
      },
      {
        value: 7106.9,
        otherValue: 32,
      },
    ],
    bids: [
      {
        value: 7104.8,
        otherValue: 22.1,
      },
      {
        value: 7105.0,
        otherValue: 4.9,
      },
      {
        value: 7105.2,
        otherValue: 2.0,
      },
    ],
  };

  return (
    <Card className={classes.root}>
      <CardContent>
        <span className={classes.exchangeName}>
          {exchangeCardData.name}
        </span>
        <Typography variant="subtitle1" component="p">
          speed: {Math.round(exchangeCardData.speed)} ob/min
        </Typography>
        {(exchangeCardData.asks.map(item => (
          <div className={classes.orderBookLine}>
            <span className={classes.asks}>{item.value}</span>
            <span>{item.otherValue}</span>
          </div>
        )))}
        <div className={classes.mainInfo}>
          <span className={classes.midPrice}>7015.9</span>
          <span className={classes.spread}>0.03%</span>
        </div>
        {(exchangeCardData.bids.map(item => (
          <div className={classes.orderBookLine}>
            <span className={classes.bids}>{item.value}</span>
            <span>{item.otherValue}</span>
          </div>
        )))}
      </CardContent>
    </Card>
  );
}