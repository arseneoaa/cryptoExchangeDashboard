const isEqual = require('lodash.isequal');
const cloneDeep = require('lodash.clonedeep');

const sync = require('./synchronisationService');

// Each how many microseconds it will calculate and display the speed
const FREQUENCY = 10000;
const NUMBER_OF_TOP_ORDERS = 3;

class OderBook {
  name = '';
  updates = [];
  book = {
    bids: [],
    asks: [],
  }
  orderBookStats = {
    topAsks: [],
    topBids: [],
    midPrice: 0,
    spread: 0,
    updatesPerMinute: 0,
  };
  // used to know when to update external systems/clients about changes in the tracked values
  previousOderBookStats = {};

  constructor(name) {
    this.name = name;
    setInterval(() => {
      this.orderBookStats.updatesPerMinute =
        (this.updates.filter(u => u > Date.now() - FREQUENCY).length * 60000) /
        FREQUENCY;

      console.log(`[OrderBook ${name}] Speed: ${this.orderBookStats.updatesPerMinute} orderbooks per minute`);
      this.triggerOrderBookPostUpdateProcessing();
    }, FREQUENCY);
  }

  recordNewUpdateTime = () => this.updates.push(Date.now());

  resetOrderBookFromSnapshot = ({ bids, asks }) => {
    this.recordNewUpdateTime();
    this.book.asks = asks;
    this.book.bids = bids;
    this.triggerOrderBookPostUpdateProcessing();
  }

  triggerOrderBookPostUpdateProcessing = () => {
    this.recomputeOrderBookStats();
    this.notifyExternalSystemsIfNeeded();
  }

  recomputeOrderBookStats = () => {
    // asks are sorted from lowest to highest price
    this.orderBookStats.topAsks = getTopOrders(this.book.asks);
    // bids are sorted from highest to lowest price
    this.orderBookStats.topBids = getTopOrders(this.book.bids, true)

    const topAskPrice = parseFloat(this.orderBookStats.topAsks[0][0]);
    const topBidPrice = parseFloat(this.orderBookStats.topBids[0][0]);

    this.orderBookStats.midPrice = topBidPrice + (topAskPrice - topBidPrice) / 2;
    this.orderBookStats.spread = (topAskPrice - topBidPrice) / this.orderBookStats.midPrice;
  };

  notifyExternalSystemsIfNeeded = () => {
    if(isEqual(this.previousOderBookStats, this.orderBookStats)){
      // nothing to do
      return;
    }
    this.previousOderBookStats = this.getOrderBookStats();
    // we notify the external systems/clients of the change
    // we send a copy as it is an external module
    sync.handleNewStats({
      name: this.name,
      ...this.getOrderBookStats(),
    });
  };

  getOrderBookStats = () => {
    // we do not want to expose the original object
    // so the consumers of this module will receive a clone of it
    return cloneDeep(this.orderBookStats);
  }

  updateOrderBook({ bids, asks }) {
    this.recordNewUpdateTime();

    if (bids) {
      bids.forEach(bid => (this.book.bids = computeOrderBookAfterSingleOrder(bid, this.book.bids)));
    }
    if (asks) {
      asks.forEach(ask => (this.book.asks = computeOrderBookAfterSingleOrder(ask, this.book.asks)));
    }
    this.triggerOrderBookPostUpdateProcessing();
  }
}




function getTopOrders (ordersList, decreasingOder = false) {
  return ordersList.concat().sort((order1, order2) => {
    if (decreasingOder) {
      return parseFloat(order1[0]) - parseFloat(order2[0]);
    }
    return parseFloat(order2[0]) - parseFloat(order1[0]);
  }
  ).slice(0, NUMBER_OF_TOP_ORDERS);
};



function computeOrderBookAfterSingleOrder (order, ordersList) {
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
    // pushing directly would mutate the input variable
    // concat(order) would deflate the content
    return ordersList.concat([order]);
  }
}


// the external interface consists of the following methods
// getOrderBookStats, resetOrderBookFromSnapshot, updateOrderBook
module.exports = OderBook;
