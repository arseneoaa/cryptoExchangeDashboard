import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import numeral from "numeral";

import { IExchangeCardData, IExchangeCardFormat } from "../interfaces";

type IExchangeCardComponentProps = {
  data: IExchangeCardData;
  formatting?: IExchangeCardFormat;
};

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 275,
  },
  exchangeName: {
    fontSize: 14,
    color: theme.palette.text.secondary,
  },
  updatesPerMinute: {},
  orderBookLine: {
    display: "flex",
    flexFlow: "row nowrap",
    justifyContent: "space-between",
  },
  bids: {
    color: "green",
  },
  asks: {
    color: "red",
  },
  mainInfo: {
    display: "flex",
    flexFlow: "row nowrap",
    justifyContent: "space-between",
    fontSize: "25px", // todo use theme
  },
  midPrice: {},
  spread: {
    fontWeight: "bold",
  },
}));

const defaultExchangeCardFormat: IExchangeCardFormat = {
  speed: "0",
  price: "0.0",
  volume: "0.0",
  spread: "0.00%",
};

export default function ExchangeCard({ data, formatting = defaultExchangeCardFormat }: IExchangeCardComponentProps) {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardContent>
        <span className={classes.exchangeName}>{data.name}</span>
        <Typography variant="subtitle1" component="p">
          speed: {numeral(data.updatesPerMinute).format(formatting.speed)} ob/min
        </Typography>
        {data.topAsks.map((item, index) => (
          <div className={classes.orderBookLine} key={index}>
            <span className={classes.asks}>
              {numeral(item[0]).format(formatting.price)}
            </span>
            <span>{numeral(item[1]).format(formatting.volume)}</span>
          </div>
        ))}
        <div className={classes.mainInfo}>
          <span className={classes.midPrice}>
            {numeral(data.midPrice).format(formatting.price)}
          </span>
          <span className={classes.spread}>
            {numeral(data.spread).format(formatting.spread)}
          </span>
        </div>
        {data.topBids.map((item, index) => (
          <div className={classes.orderBookLine} key={index}>
            <span className={classes.bids}>
              {numeral(item[0]).format(formatting.price)}
            </span>
            <span>{numeral(item[1]).format(formatting.volume)}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
