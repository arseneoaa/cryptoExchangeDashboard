// Each how many microseconds it will calculate and display the speed
const FREQUENCY = 10000;

const updates = [];
const orderBook = {
  bids: [],
  asks: [],
};

const orderBookStats = {
  topsAsks: [],
  topBids: [],
  midPrice: 0,
  spread: 0,
  updatesPerMinute: 0,
};

const recordNewUpdate = () => updates.push(Date.now());

setInterval(() => {
  orderBookStats.updatesPerMinute =
    (updates.filter(u => u > Date.now() - FREQUENCY).length * 60000) /
    FREQUENCY;

  console.log(`[sink] Speed: ${orderBookStats.updatesPerMinute} orderbooks per minute`);
}, FREQUENCY);

const triggerOrderBookPostUpdateProcessing = () => {
  // recomputeOrderBookStats();
  // updateWSClientsIfNeeded();
}

const computeOrderBookAfterSingleOrder = (order, ordersList) => {
  // As usual, it is important not to change the inputs but rather return the result
  // todo we could add checksum validation here
  const volume = parseFloat(order[1]);
  if (volume === 0) {
    // remove the corresponding bid (with the same price) from the order book
    return ordersList.filter(item => (item[0] !== order[0]));
  } if (order[3] === 'r') {
    // this is a republish update, do nothing
  }
  else {
    return ordersList.concat(order);
  }
}

module.exports = {
  resetOrderBookFromSnapshot({ bids, asks }) {
    recordNewUpdate();
    orderBook.asks = asks;
    orderBook.bids = bids;
    //todo remove
    console.log('updated complete order book', JSON.stringify({ asks, bids }));
    triggerOrderBookPostUpdateProcessing();
  },

  updateOrderBook({ bids, asks }) {
    recordNewUpdate();

    //todo remove
    console.log('about to add update', JSON.stringify(orderBook))
    if (bids) {
      //todo remove
      console.log('new bids received', JSON.stringify(bids));
      bids.forEach(bid => (orderBook.bids = computeOrderBookAfterSingleOrder(bid, orderBook.bids)));
    }
    if (asks) {
      //todo remove
      console.log('new asks received', JSON.stringify(asks));
      asks.forEach(ask => (orderBook.asks = computeOrderBookAfterSingleOrder(ask, orderBook.asks)));
    }
    triggerOrderBookPostUpdateProcessing();
  }
};
