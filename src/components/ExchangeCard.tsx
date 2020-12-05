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

  return (
    <Card className={classes.root}>
      <CardContent>
        <span className={classes.exchangeName}>
          Kraken BTC/USD
        </span>
        <Typography variant="subtitle1" component="p">
          speed: 53ob/min
        </Typography>
        <div className={classes.orderBookLine}>
          <span className={classes.asks}>7107.3</span>
          <span>25.0</span>
        </div>
        <div className={classes.orderBookLine}>
          <span className={classes.asks}>7107.2</span>
          <span>0.9</span>
        </div>
        <div className={classes.orderBookLine}>
          <span className={classes.asks}>7106.9</span>
          <span>32.0</span>
        </div>
        <div className={classes.mainInfo}>
          <span className={classes.midPrice}>7015.9</span>
          <span className={classes.spread}>0.03%</span>
        </div>
        <div className={classes.orderBookLine}>
          <span className={classes.bids}>7104.8</span>
          <span>22.1</span>
        </div>
      </CardContent>
    </Card>
  );
}