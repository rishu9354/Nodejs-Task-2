const exprees = require("express")
const router = exprees.Router();

const {fetchPrices,fetchAlerts,addAlerts} = require("../controllers/cryptoController")

router.get("/prices",fetchPrices);
router.get("/alerts",fetchAlerts);
router.post("/add/alerts",addAlerts); // This route will now require crypto, targetPrice, and direction


module.exports = router