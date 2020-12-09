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


module.exports = {
  resetOrderBookFromSnapshot({ bids, asks }) {
    recordNewUpdate();
    orderBook.asks = asks;
    orderBook.bids = bids;
    //todo remove
    console.log('updated complete order book', JSON.stringify({ asks, bids }));
  },

  updateOrderBook({ bids, asks }) {
    recordNewUpdate();

    //todo remove
    console.log('about to add update', JSON.stringify(orderBook))
    if (bids) {
      //todo remove
      console.log('new bids received', JSON.stringify(bids));
      bids.forEach(bid => {
        const volume = parseFloat(bid[1]);
        if (volume === 0) {
          // remove the corresponding bid (with the same price) from the order book
          orderBook.bids = orderBook.bids.filter(item => (item[0] !== bid[0]));
        } else {
          orderBook.bids = orderBook.bids.concat(bid);
        }
      });
    }
    if (asks) {
      //todo remove
      console.log('new asks received', JSON.stringify(asks));
      asks.forEach(ask => {
        const volume = parseFloat(ask[1]);
        if (volume === 0) {
          // remove the corresponding ask (with the same price) from the order book
          orderBook.asks = orderBook.asks.filter(item => (item[0] !== ask[0]));
        }
        else {
          orderBook.asks = orderBook.asks.concat(ask);
        }
      });
    }
  }
};
