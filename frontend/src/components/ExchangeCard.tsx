import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import numeral from "numeral";

import {
  IExchangeCardData,
  IExchangeCardFormat,
  IExchangeCardWarningThresholdsFormat,
} from "../interfaces";

type IExchangeCardComponentProps = {
  data: IExchangeCardData;
  formatting?: IExchangeCardFormat;
  thresholds?: IExchangeCardWarningThresholdsFormat;
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: "250px",
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
  warning: {
    fontWeight: "bold",
    fontSize: "24px",
    color: "red",
  },
  "@keyframes blinker": {
    from: {
      backgroundColor: "white",
    },
    to: {
      backgroundColor: theme.palette.warning.main,
    },
  },
  warningBlink: {
    animationName: "$blinker",
    animationDuration: "1s",
    animationTimingFunction: "linear",
    animationIterationCount: "infinite",
  },
}));

const defaultExchangeCardFormat: IExchangeCardFormat = {
  speed: "0",
  price: "0.0",
  volume: "0.0",
  spread: "0.00%",
};

const defaultThresholds: IExchangeCardWarningThresholdsFormat = {
  speed: 100,
  spread: 0.0003,
};

export default function ExchangeCard({
  data,
  formatting = defaultExchangeCardFormat,
  thresholds = defaultThresholds,
}: IExchangeCardComponentProps) {
  const classes = useStyles();

  const speedTooLow = data.updatesPerMinute < thresholds.speed;
  const spreadTooHigh = data.spread > thresholds.spread;
  const shouldBlink = speedTooLow || spreadTooHigh;

  return (
    <Card className={classes.root}>
      <CardContent className={shouldBlink ? classes.warningBlink : ""}>
        <span className={classes.exchangeName}>{data.name}</span>
        <div className={speedTooLow ? classes.warning : ""}>
          speed: {numeral(data.updatesPerMinute).format(formatting.speed)}{" "}
          ob/min
        </div>
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
          <span className={spreadTooHigh ? classes.warning : classes.spread}>
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
