const isEqual = require('lodash.isequal');
const cloneDeep = require('lodash.clonedeep');

const {handleNewStats} = require('./statsChangeHandler');

// Each how many microseconds it will calculate and display the speed
const FREQUENCY = 10000;
const NUMBER_OF_TOP_ORDERS = 3;

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
// use to know when to update external systems/clients about changes in the tracked values
let previousOderBookStats = {};

const recordNewUpdate = () => updates.push(Date.now());

setInterval(() => {
  orderBookStats.updatesPerMinute =
    (updates.filter(u => u > Date.now() - FREQUENCY).length * 60000) /
    FREQUENCY;

  console.log(`[sink] Speed: ${orderBookStats.updatesPerMinute} orderbooks per minute`);
}, FREQUENCY);

const getTopOrders = (ordersList, decreasingOder = false) => {
  return ordersList.concat().sort((order1, order2) => {
    if (decreasingOder) {
      return parseFloat(order1[0]) - parseFloat(order2[0]);
    }
    return parseFloat(order2[0]) - parseFloat(order1[0]);
  }
  ).slice(0, NUMBER_OF_TOP_ORDERS);
};

const recomputeOrderBookStats = () => {
  // asks are sorted from lowest to highest price
  orderBookStats.topsAsks = getTopOrders(orderBook.asks);
  // bids are sorted from highest to lowest price
  orderBookStats.topBids = getTopOrders(orderBook.bids, true)

  const topAskPrice = orderBookStats.topsAsks[0][0];
  const topBidPrice = orderBookStats.topBids[0][0];

  orderBookStats.midPrice = topBidPrice + (topAskPrice - topBidPrice) / 2;
  orderBookStats.spread = (topAskPrice - topBidPrice) / orderBookStats.midPrice;
};

const notifyExternalSystemsIfNeeded = () => {
  if(isEqual(previousOderBookStats, orderBookStats)){
    // nothing to do
    return;
  }
  previousOderBookStats = cloneDeep(orderBookStats);
  // we notify the external systems/clients of the change
  handleNewStats(orderBookStats);
};

const triggerOrderBookPostUpdateProcessing = () => {
  recomputeOrderBookStats();
  notifyExternalSystemsIfNeeded();
}

const computeOrderBookAfterSingleOrder = (order, ordersList) => {
  // As usual, it is important not to change the inputs but rather return the result
  // todo we could add checksum validation here
  const volume = parseFloat(order[1]);
  if (volume === 0) {
    // remove the corresponding bid (with the same price) from the order book
    return ordersList.filter(item => (item[0] !== order[0]));
  } if (order[3] === 'r') {
    // this is a republish update, do nothing --> we return the same input
    return ordersList.concat();
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
    // console.log('updated complete order book', JSON.stringify({ asks, bids }));
    triggerOrderBookPostUpdateProcessing();
  },

  updateOrderBook({ bids, asks }) {
    recordNewUpdate();

    //todo remove
    // console.log('about to add update', JSON.stringify(orderBook))
    if (bids) {
      //todo remove
      // console.log('new bids received', JSON.stringify(bids));
      bids.forEach(bid => (orderBook.bids = computeOrderBookAfterSingleOrder(bid, orderBook.bids)));
    }
    if (asks) {
      //todo remove
      // console.log('new asks received', JSON.stringify(asks));
      asks.forEach(ask => (orderBook.asks = computeOrderBookAfterSingleOrder(ask, orderBook.asks)));
    }
    triggerOrderBookPostUpdateProcessing();
  }
};
