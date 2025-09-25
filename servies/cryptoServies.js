const axios = require("axios");
const redisClient = require("../utils/redisClient");
require("dotenv").config();

const API_URL = "https://api.coingecko.com/api/v3/simple/price"
const API_KEY = process.env.CRYPTO_API_KEY;

async function getCryptoPrices(){
 try {
    const cached = await redisClient.get("cryptoPrices");
    if (cached){
        console.log("Prices served from redis cache.");
        return JSON.parse(cached);
    } 
 } catch (error) {
    console.error("Error checking from redis cache");
 }

//  if not in cache fetch from the api
try {
      if (!API_KEY) {
      console.error("API Key not found in .env file. Please add it as CRYPTO_API_KEY.");
      return null;
    }
    console.log("Fetching prices from api");
    const res = await axios.get(API_URL,{
        params: {
        ids: "bitcoin,ethereum",
        vs_currencies: "usd",
        x_cg_demo_api_key: API_KEY, // Using the API key
      },
    })

    // check if the api response contains the expected data
    if(!res.data.bitcoin || !res.data.ethereum){
        console.error("Unexpected API response format. Bitcoin or Ethereum data is missing.");
        return null;
    }

    const data = {
        bitcoin:{
            price:res.data.bitcoin.usd,
            updated: Date.now()
        },
        ethereum:{
            price:res.data.ethereum.usd,
            updated: Date.now()
        }
    };
    await redisClient.set("cryptoPrices",JSON.stringify(data),"EX",10);
    return data;
    
} catch (error) {
    console.error("Error while fetching prices and API ", error.message);
    return null;
}
}

module.exports = { getCryptoPrices };

