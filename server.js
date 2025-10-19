const express = require("express");
const db = require("./config/mongodbConfig")
const path = require("path");
// const {createClient} = require("redis")
const app = express();
const routes = require("./routes/index");
const { getCryptoPrices } = require("./servies/cryptoServies");
const {triggerAlerts} = require("./servies/alertServies")


// Ejs setup
app.set('view engine','ejs');
app.set("views", path.join(__dirname, "views"));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));
app.use(express.json());

// routes
app.use("/api",routes)
app.get("/",(req,res)=>{
    res.render("index")
})

// A background job to periodically fetch prices and trigger alerts

const updatePriceAndCheckAlert = async () =>{
    try {
        console.log("Fetching prices and alerts. ");
        const prices = await getCryptoPrices();
        if(prices){
            await triggerAlerts(prices);
            console.log("Alerts checked Successfully.");
        }
        
    } catch (error) {
        console.error("Error in update prices and alerts check: ",error);
        
    }
}

// Run the background job every 15 seconds
// The CoinGecko API for free tier is usually rate-limited to 50 calls/minute,
// so 15 seconds is a safe interval (4 calls per minute).
// setInterval(updatePriceAndCheckAlert,15000)

db.once('open', () => {
    app.listen(5000, () => console.log("Server running on port 5000"));
});