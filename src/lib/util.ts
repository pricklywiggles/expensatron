import {BigNumber} from 'bignumber.js';

export const fetchBTCPrice = async (usdPrice: BigNumber): Promise<BigNumber> => 
  fetch(`https://blockchain.info/tobtc?currency=USD&value=${usdPrice}`)
    .then(data => data.json())
    .then(res => new BigNumber(res))
    .catch(err => {
      console.error("Error getting bitcoin price", err); 
      return new BigNumber(0);
    });
