export interface IExchangeCardData {
  name: string,
  updatesPerMinute: number,
  midPrice: number,
  spread: number,
  topAsks: IOrder[],
  topBids: IOrder[],
}

export interface IExchangeData extends IExchangeCardData {
  asks: any[],
  bids: any[],
}

export interface IOrder {
  price: number,
  volume: number,
}

