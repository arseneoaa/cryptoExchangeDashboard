export interface IExchangeCardData {
  name: string;
  updatesPerMinute: number;
  midPrice: number;
  spread: number;
  topAsks: IOrder[];
  topBids: IOrder[];
}

export interface IExchangeData extends IExchangeCardData {
  asks: any[];
  bids: any[];
}

type IOrder = [string, string, string];

export interface IExchangeCardFormat {
  speed: string;
  price: string;
  volume: string;
  spread: string;
}
