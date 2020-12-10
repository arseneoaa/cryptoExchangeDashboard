# `orderbook-parser`

Example projects that shows how to obtain orderbook snapshots from Kraken.

## Requirements

- You need a relatively new version of Node.js (this was tested with version 13.3.0)
- `yarn` package manager

## How to install

- `git clone` this repo
- Run `yarn` to install the dependencies

## How to run

Just `yarn start`.

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