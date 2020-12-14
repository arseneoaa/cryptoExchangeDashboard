const isEqual = require("lodash.isequal");
const cloneDeep = require("lodash.clonedeep");
const crc32 = require('crc-32');

const sync = require("./synchronisationService");

// Each how many microseconds it will calculate and display the speed
const FREQUENCY = 10000;
const NUMBER_OF_TOP_ORDERS = 3;

class OderBook {
  name = "";
  updates = [];
  book = {
    bids: [],
    asks: [],
  };
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
        (this.updates.filter((u) => u > Date.now() - FREQUENCY).length *
          60000) /
        FREQUENCY;

      console.log(
        `[OrderBook ${name}] Speed: ${this.orderBookStats.updatesPerMinute} orderbooks per minute`
      );
      this.triggerOrderBookPostUpdateProcessing();
    }, FREQUENCY);
  }

  recordNewUpdateTime = () => this.updates.push(Date.now());

  resetOrderBookFromSnapshot = ({ bids, asks }) => {
    this.recordNewUpdateTime();
    this.book.asks = asks;
    this.book.bids = bids;
    this.triggerOrderBookPostUpdateProcessing();
  };

  triggerOrderBookPostUpdateProcessing = () => {
    const {
      topAsks,
      topBids,
      midPrice,
      spread,
    } = computeOrderBookStats(this.book.asks, this.book.bids);
    this.orderBookStats = {
      ...this.orderBookStats,
      topAsks,
      topBids,
      midPrice,
      spread,
    };
    this.notifyExternalSystemsIfNeeded();
  };


  notifyExternalSystemsIfNeeded = () => {
    if (isEqual(this.previousOderBookStats, this.orderBookStats)) {
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
  };

  updateOrderBook({ bids, asks, checksum }) {
    // console.log('about to update oderbook with', JSON.stringify(bids), JSON.stringify(asks), checksum);
    this.recordNewUpdateTime();
    let newListOfBids = this.book.bids.concat();
    let newListOfAsks = this.book.asks.concat();

    if (bids) {
      bids.forEach(
        (bid) =>
          (newListOfBids = computeOrderBookAfterSingleOrder(
            bid,
            newListOfBids
          ))
      );
    }
    if (asks) {
      asks.forEach(
        (ask) =>
          (newListOfAsks = computeOrderBookAfterSingleOrder(
            ask,
            newListOfAsks
          ))
      );
    }
    // we check the checksum before updating the book
    this.verifyChecksum(newListOfAsks, newListOfBids, checksum);
    if (newListOfAsks) {
      this.book.asks = newListOfAsks;
    }
    if (newListOfBids) {
      this.book.bids = newListOfBids;
    }
    this.triggerOrderBookPostUpdateProcessing();
  }

  verifyChecksum(newListOfAsks, newListOfBids, orderCheckSum) {
    if (!orderCheckSum && orderCheckSum !== 0) {
      console.warn(`[${this.name}] no checksum provided for comparison`)
      return;
    }
    const top10Asks = getTopOrders(newListOfAsks, 10);
    const top10Bids = getTopOrders(newListOfBids, 10, true);
    const concatenated = concatenateOrders(top10Asks) + concatenateOrders(top10Bids);
    const computedChecksum = crc32.str(concatenated) >>> 0;
    // console.log(`order checksum ${orderCheckSum}, computed checksum ${computedChecksum}`);
    if (Number(computedChecksum) !== Number(orderCheckSum)) {
      //todo
      // console.log('top10Asks', top10Asks)
      // console.log('top10Bids', top10Bids)
      // throw new Error(`[${this.name}] checksum mismatch`);
    };
  }
}

function concatenateOrders(orders) {
  let result = '';
  orders.forEach(item => {
    result += formatValueForChecksum(item[0]) + formatValueForChecksum(item[1]);
  });
  return result;
}

function formatValueForChecksum(value) {
  return String(Number(value.replace('.', '')))
}

function getTopOrders(ordersList, numberOfOrdersToReturn, decreasingOrder = false) {
  return ordersList
    .concat()
    .sort((order1, order2) => {
      if (decreasingOrder) {
        return parseFloat(order2[0]) - parseFloat(order1[0]);
      }
      return parseFloat(order1[0]) - parseFloat(order2[0]);
    })
    .slice(0, numberOfOrdersToReturn);
}

function computeOrderBookAfterSingleOrder(order, ordersList) {
  // As usual, it is important not to change the inputs but rather return the result
  // todo we could add checksum validation here

  const volume = parseFloat(order[1]);
  if (volume === 0) {
    // remove the corresponding bid (with the same price) from the order book
    return ordersList.filter((item) => item[0] !== order[0]);
  }
  if (order[3] === "r") {
    // this is a republish update, do nothing --> we return the same input
    return ordersList.concat();
  } else {
    // pushing directly would mutate the input variable
    // concat(order) would deflate the content
    return ordersList.concat([order]);
  }
}

function computeOrderBookStats (asks, bids) {
  // asks are sorted from lowest to highest price
  const topAsks = getTopOrders(asks, NUMBER_OF_TOP_ORDERS);
  // bids are sorted from highest to lowest price
  const topBids = getTopOrders(bids, NUMBER_OF_TOP_ORDERS, true);

  const topAskPrice = parseFloat(topAsks[0][0]);
  const topBidPrice = parseFloat(topBids[0][0]);

  const midPrice =
    topBidPrice + (topAskPrice - topBidPrice) / 2;
  const spread =
    (topAskPrice - topBidPrice) / midPrice;
  return {
    topAsks,
    topBids,
    midPrice,
    spread,
  }
}

// the external interface consists of the following methods
// getOrderBookStats, resetOrderBookFromSnapshot, updateOrderBook
module.exports = OderBook;
