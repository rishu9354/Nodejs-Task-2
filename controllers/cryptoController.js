const { getCryptoPrices } = require("../servies/cryptoServies");
const { getAlerts, createAlert, triggerAlerts } = require("../servies/alertServies");

// fetch the prices from API and return them

const fetchPrices = async (req, res) => {
    try {
        const prices = await getCryptoPrices();
        // check price sent or not 
        console.log("Prices being sent to frontend: ",prices);
        

        if (!prices) {
            res.status(500).json({ error: "Could not retrieve crypto prices" })
        } 
        await triggerAlerts(prices)
        res.json(prices);

    } catch (error) {
        console.error("Controller Error fetching prices:", err);
        res.status(500).json({ error: "Server Error from cryptoController" })

    }

}



// fetch the triggerd alert from the db

const fetchAlerts = async (req, res) => {
    try {
        const alerts = await getAlerts();
        res.json(alerts)
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch alerts." })
    }
}

// add new alert to the db
const addAlerts = async (req, res) => {
    try {
        const { crypto, targetPrice, direction } = req.body;
        if (!crypto || !targetPrice || !direction) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        const newAlert = await createAlert(crypto, targetPrice, direction);
        res.status(201).json(newAlert);
    } catch (error) {
        res.status(500).json({ error: "Failed to add alert" });
    }
}

module.exports = {
    fetchPrices,
    fetchAlerts,
    addAlerts
}