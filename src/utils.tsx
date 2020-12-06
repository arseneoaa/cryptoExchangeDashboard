export function normalizePayload (payload: any) {
  if (payload.length === 5) {
    const [, { a: ask }, { b: bid }, , pair] = payload;
    // ask && bid
    return { ask, bid, pair };
  }
  const [, { as: asks, bs: bids, a: ask, b: bid }, , pair] = payload;
  // ask || bid || (asks && bids)
  return { ask, bid, asks, bids, pair };
}

export function getInfoFromAsksAndBids(asks: any[], bids: any[]) {
  // todo can the best ask be lower than the best bid?

  // because we might have updated the asks, we cannot rely on the index order
  // Array.concat is used just to avoid mutating the input
  const orderedAsks = asks.concat().sort((order1, order2) => (parseFloat(order1[0]) - parseFloat(order2[0])));
  // bids are sorted from highest to lowest
  const orderedBids = bids.concat().sort((order1, order2) => (parseFloat(order2[0]) - parseFloat(order1[0])));
  const numberOfRelevantOrders = 3;
  const topBidPrice = parseFloat(orderedBids[0][0]);
  const topAskPrice = parseFloat(orderedAsks[0][0]);
  const midPrice = topBidPrice + (topAskPrice - topBidPrice) / 2;
  const spread = (topAskPrice - topBidPrice) / midPrice;
  const topAsks = orderedAsks.slice(0,numberOfRelevantOrders);
  const topBids = orderedBids.slice(0,numberOfRelevantOrders);
  return {
    midPrice,
    spread,
    topAsks: topAsks[0].map((item: string[]) => ({
      value: parseFloat(item[0]),
      otherValue: parseFloat(item[1]),
    })),
    topBids: topBids[0].map((item: string[]) => ({
      value: parseFloat(item[0]),
      otherValue: parseFloat(item[1]),
    })),
  };
}