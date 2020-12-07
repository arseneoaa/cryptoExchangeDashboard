export interface IExchangeCardData {
  name: string,
  updatesPerMinute: number,
  midPrice: number,
  spread: number,
  topAsks: IOrder[],
  topBids: IOrder[],
}

export interface IExchangeCardComponentData {
  data: IExchangeCardData,
}

export interface IExchangeData extends IExchangeCardData {
  asks: any[],
  bids: any[],
}

export interface IOrder {
  price: number,
  volume: number,
}

export interface IKrakenConfig {
  name: string,
  pair: string,
  // web socket part
  wsUrl: string,
  // message sent to subscribe to updates
  subscriptionMessage: {
    event: string,
    subscription: {
      name: string,
      depth: number
    },
  },
};
