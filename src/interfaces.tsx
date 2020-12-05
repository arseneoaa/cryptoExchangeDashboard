export interface IExchangeCardData {
  name: string,
  speed: number,
  midPrice: number,
  spread: number,
  asks: IOrder[],
  bids: IOrder[],
}

export interface IExchangeCardComponentData {
  data: IExchangeCardData,
}

export interface IOrder {
  value: number,
  otherValue: number,
}