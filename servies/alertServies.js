const Alert = require("../models/Alert")

async function getAlerts() {
    // Sort by triggeredAt in descending order and limit to the last 10
    return await Alert.find({triggered: true})
        .sort({triggeredAt: -1})
        .limit(10)
}

// create a new alert in the db
async function createAlert(crypto, targetPrice, direction) {
    const alert = new Alert({ crypto, targetPrice, direction });
    return await alert.save();

}

async function triggerAlerts(prices) {
    if (!prices || typeof prices !== 'object') {
        console.error("Trigger alerts called with invalid prices data.");
        return;
    }
    const alerts = await Alert.find({ triggered: false });
    for (const alert of alerts) {
        const currentPrices = prices[alert.crypto]?.price;
        // ensure we have a currentPrice for the crypto
        if (currentPrices) {
            if (alert.direction === 'above' && currentPrices >= alert.targetPrice) {
                // trigger the alert if price goes increase the target
                alert.triggered = true;
                alert.triggeredAt = new Date();
                await alert.save();
            } else if (alert.direction === 'below' && currentPrices <= alert.targetPrice) {
                // else trigger the alert if the price goes below the target
                alert.triggered = true;
                alert.triggeredAt = new Date();
                await alert.save();
            }
        }
    }
}

module.exports = { getAlerts, createAlert, triggerAlerts };
