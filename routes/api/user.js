const express = require('express');
const router = express.Router();
const groceryController = require("../../controllers/grocery")

router.get("/groceries", groceryController.allGrocery)
router.post("/create/order", groceryController.createOrder)

module.exports = router;