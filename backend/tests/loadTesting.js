// This load test will start monitoring on the configured number of asset pairs of the Kraken API
// We are using the basic https API just for simplicity and to not bother importing another package for now

const https = require("https");

const { startKrakenMonitoring } = require("../src/exchanges");

// these are configurable
const NUMBER_OF_PAIRS_TO_TEST = 50;
const RANDOMIZE_PAIRS_TO_TEST = true;

let url = "https://api.kraken.com/0/public/AssetPairs";

https
  .get(url, (res) => {
    let body = "";

    res.on("data", (chunk) => {
      body += chunk;
    });

    res.on("end", () => {
      try {
        const assetPairsObject = JSON.parse(body).result;
        const assetPairSymbols = Object.keys(assetPairsObject)
          .map((item) => assetPairsObject[item].wsname)
          // somehow some of these values are undefined
          .filter((item) => !!item);
        randomiseAssetPairSymbolsIfNeeded(assetPairSymbols)
          .slice(0, NUMBER_OF_PAIRS_TO_TEST)
          .forEach((symbol) => startKrakenMonitoring({ symbol }));
      } catch (error) {
        console.error(error.message);
      }
    });
  })
  .on("error", (error) => {
    console.error(error.message);
  });

function randomiseAssetPairSymbolsIfNeeded(assetPairSymbols) {
  const result = assetPairSymbols.concat();
  if (!RANDOMIZE_PAIRS_TO_TEST) {
    return result;
  }
  for (let index = assetPairSymbols.length - 1; index > 0; index--) {
    const rndIndex = Math.floor(Math.random() * (index + 1));
    const value = result[rndIndex];
    result[rndIndex] = result[index];
    result[index] = value;
  }
  return result;
}
