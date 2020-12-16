import {
  IExchangeCardFormat,
  IExchangeCardWarningThresholdsFormat,
} from "./interfaces";

export const WS_URL = "ws://localhost:8088/ws";

interface IFormattingsProps {
  [x: string]: IExchangeCardFormat;
}

export const FORMATTINGS: IFormattingsProps = {
  "KrakenETH/XBT": {
    speed: "0",
    price: "0.000000",
    volume: "0.0",
    spread: "0.00%",
  },
};

interface IWarningThresholdsProps {
  [x: string]: IExchangeCardWarningThresholdsFormat;
}

export const THRESHOLDS: IWarningThresholdsProps = {
  "KrakenETH/XBT": {
    speed: 500,
    spread: 0.0004,
  },
};
