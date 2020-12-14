const OrderBook = require('../src/OderBook');
const { testOrders, testOrderBookStats } = require('./data');

jest.mock('../src/synchronisationService');
jest.mock('ws')


test('OrderBook api to be defined', () => {
  const orderbook = new OrderBook();
  expect(orderbook.resetOrderBookFromSnapshot).toBeDefined();
  expect(orderbook.updateOrderBook).toBeDefined();
});

test('Order Book stats to be correct after post processing', () => {
  const orderbook = new OrderBook();
  orderbook.resetOrderBookFromSnapshot(testOrders);
  orderbook.triggerOrderBookPostUpdateProcessing();

  expect(orderbook.orderBookStats).toEqual(testOrderBookStats);
});