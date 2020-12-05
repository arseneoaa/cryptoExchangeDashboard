import React from 'react';
import {IExchangeCardData} from '../interfaces';
import ExchangeCard from './ExchangeCard';

export default function Dashboard() {

  const exchangeCardData: IExchangeCardData = {
    name: 'Kraken BTC/USD',
    speed: 53,
    midPrice: 7015.9,
    spread: 0.03,
    asks: [
      {
        value: 7107.3,
        otherValue: 25.0,
      },
      {
        value: 7107.2,
        otherValue: 0.9,
      },
      {
        value: 7106.9,
        otherValue: 32,
      },
    ],
    bids: [
      {
        value: 7104.8,
        otherValue: 22.1,
      },
      {
        value: 7105.0,
        otherValue: 4.9,
      },
      {
        value: 7105.2,
        otherValue: 2.0,
      },
    ],
  };

  return (
    <ExchangeCard data={exchangeCardData}></ExchangeCard>
  );
}