import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import numeral from 'numeral';

import { IExchangeCardComponentData } from '../interfaces'


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

export default function ExchangeCard({data}: IExchangeCardComponentData) {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardContent>
        <span className={classes.exchangeName}>
          {data.name}
        </span>
        <Typography variant="subtitle1" component="p">
          speed: {numeral(data.speed).format('0')} ob/min
        </Typography>
        {(data.asks.map(item => (
          <div className={classes.orderBookLine}>
            <span className={classes.asks}>{numeral(item.value).format('0.0')}</span>
            <span>{numeral(item.otherValue).format('0.0')}</span>
          </div>
        )))}
        <div className={classes.mainInfo}>
          <span className={classes.midPrice}>{numeral(data.midPrice).format('0.0')}</span>
          <span className={classes.spread}>{numeral(data.spread).format('0.00%')}</span>
        </div>
        {(data.bids.map(item => (
          <div className={classes.orderBookLine}>
            <span className={classes.bids}>{numeral(item.value).format('0.0')}</span>
            <span>{numeral(item.otherValue).format('0.0')}</span>
          </div>
        )))}
      </CardContent>
    </Card>
  );
}