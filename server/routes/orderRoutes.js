const express = require("express");
const OrderController = require("../controllers/orderController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", protect, OrderController.createOrder);
router.get("/", protect, OrderController.getCustomerOrders);
router.get("/winery/:wineryId", protect, OrderController.getWineryOrders);

module.exports = router;
