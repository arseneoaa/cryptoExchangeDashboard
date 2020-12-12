# Backend for monitoring crypto pairs

Forked from `https://github.com/KeyrockEU/orderbook-parser`
Starting this will expose a websocket backend connecting to the APIs of crypto-currency exchanges and serving updates for monitoring purposes.

## Requirements

- You need a relatively new version of Node.js (this was tested with version 13.3.0)
- `yarn` or `npm` package manager

## How to install

- `git clone` this repo
- Run `yarn` to install the dependencies

## How to run

Just `yarn start`.

## How it works

The code is all in the `src` folder.
`syncrhonisationService` is an orchestrator singleton that records data from the exchanges that need to be stored and shares it to the websocket clients for example.

It's `handleNewStats` method is called by the processes for each exchange/key-pair to save the new state of the monitoring for that key-pair on that exchange.

Each exchange process like `startKrakenMonitoring` can use and instance of the `OrderBook` class to record order book snapshot and updates.

## Supported exchanges

- Kraken

## Next steps

- check logic
- add dockerfile
- add unit and e2e testing
  - singleton/multiple instances where needed
  - book snapshot and update handling
- add summary of how it works
- error handling
- restart ws connection to exchanges if it breaks
- add some type checking as the project might grow
- add more exchanges
