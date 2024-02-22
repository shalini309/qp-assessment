const express = require('express');
const router = express.Router();
const groceryController = require("../../controllers/grocery")

router.post("/grocery/add", groceryController.addGrocery)
router.get("/groceries", groceryController.allGroceryList)
router.delete("/grocery/delete/:groceryId", groceryController.deleteGrocery)
router.put("/grocery/update", groceryController.updateGrocery)
router.patch("/grocery/inventroy/:groceryId/:itmeNumber", groceryController.updateInventory)

module.exports = router;