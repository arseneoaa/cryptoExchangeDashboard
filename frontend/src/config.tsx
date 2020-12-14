import { IExchangeCardFormat } from "./interfaces";

export const WS_URL = "ws://localhost:8088/ws";

interface FormattingsProps {
  [x: string]: IExchangeCardFormat;
}
export const FORMATTINGS: FormattingsProps = {
  "KrakenETH/XBT": {
    speed: "0",
    price: "0.000000",
    volume: "0.0",
    spread: "0.00%",
  },
};
