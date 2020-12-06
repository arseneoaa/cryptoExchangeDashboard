export interface IExchangeCardData {
  name: string,
  speed: number,
  midPrice: number,
  spread: number,
  topAsks: IOrder[],
  topBids: IOrder[],
}

export interface IExchangeCardComponentData {
  data: IExchangeCardData,
}

export interface IOrder {
  value: number,
  otherValue: number,
}