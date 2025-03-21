const express = require("express");
const { placeOrder, getDistributorOrders, updateOrderStatus } = require("../Controller/Distributor");

const router = express.Router();

router.post("/place", placeOrder);
router.get("/:distributorId", getDistributorOrders);
router.put("/update/:orderId", updateOrderStatus);

module.exports = router;
