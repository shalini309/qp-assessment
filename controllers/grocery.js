const groceryModel = require("../models/grocery")
const orderModel = require("../models/order")
const { validation } = require("../validator/grocery");

module.exports = {

    /**************    Admin Responsibilities   **************/

    //1
    addGrocery: async (req, res) => {

        try {

            const error = await validation(req.body, "addGrocery");
            if (error) return res.status(422).send({
                code: 422,
                success: false,
                message: error,
            });

            let userExist = await groceryModel.findOne({ name: req.body.name, price: req.body.price })

            if (userExist) {
                return res.status(200).send({
                    code: 0,
                    success: true,
                    message: "Item with same price is already exist.",
                });
            }

            let grocery = new groceryModel(req.body)
            await grocery.save()

            return res.status(200).send({
                code: 200,
                success: true,
                message: "Item added successfully",
                result: grocery,
            });

        } catch (error) {
            return res.status(500).send({
                code: 500,
                success: false,
                message: "Something wents wrong",
            });
        }

    },
    // 2 -> list of all grocery item added by admin
    allGroceryList: async (req, res) => {

        try {

            let { search = '', page = 1, limit = 10, sort } = req.query;
            limit = parseInt(limit);
            skip = (page - 1) * limit || 0;
            sort = { "createdAt": -1 }


            let query = {}
            let searchArray = []

            if (search) {
                searchArray.push(
                    { name: { '$regex': search, "$options": 'i' } },
                    { price: { '$regex': search, "$options": 'i' } }
                )
                query = { $or: searchArray };
            }

            let total = await groceryModel.countDocuments(query)
            let groceryList = await groceryModel.find(query).sort(sort).skip(skip).limit(limit)

            return res.status(200).send({
                code: 200,
                success: true,
                message: "Grocery item list fetched successfully",
                result: {
                    groceryList: groceryList,
                    total: total
                }
            });

        } catch (error) {
            return res.status(500).send({
                code: 500,
                success: false,
                message: "Something wents wrong",
            });
        }
    },

    // 3 -> remove grocery item
    deleteGrocery: async (req, res) => {

        try {

            const error = await validation(req.params, "groceryId");
            if (error) return res.status(422).send({
                code: 422,
                success: false,
                message: error,
            });

            await groceryModel.deleteOne({ _id: req.params.groceryId })

            return res.status(200).send({
                code: 200,
                success: true,
                message: "Grocery item deleted successfully",
                result: {}
            });

        } catch (error) {
            console.log(error)
            return res.status(500).send({
                code: 500,
                success: false,
                message: "Something wents wrong",
            });
        }
    },

    //4 -> update detail
    updateGrocery: async (req, res) => {

        try {

            const error = await validation(req.body, "groceryId");
            if (error) return res.status(422).send({
                code: 422,
                success: false,
                message: error,
            });

            await groceryModel.findByIdAndUpdate(req.body.groceryId, { $set: req.body })

            return res.status(200).send({
                code: 200,
                success: true,
                message: "Item updated successfully",
                result: {},
            });

        } catch (error) {
            console.log(error)
            return res.status(500).send({
                code: 500,
                success: false,
                message: "Something wents wrong",
            });
        }

    },

    //5 -> inventory
    updateInventory: async (req, res) => {

        try {

            const error = await validation(req.params, "groceryId");
            if (error) return res.status(422).send({
                code: 422,
                success: false,
                message: error,
            });

            await groceryModel.findByIdAndUpdate(
                req.params.groceryId,
                { $inc: { inventory: parseInt(req.params.itmeNumber) } },
                { new: true }
            );

            return res.status(200).send({
                code: 200,
                success: true,
                message: "Inventory updated successfully",
                result: {},
            });

        } catch (error) {
            console.log(error)
            return res.status(500).send({
                code: 500,
                success: false,
                message: "Something wents wrong",
            });
        }

    },


    /**************    User Responsibilities   **************/
    
    // 1 -> list of all grocery item added by admin
    allGrocery: async (req, res) => {

        try {

            let { search = '', page = 1, limit = 10, sort } = req.query;
            limit = parseInt(limit);
            skip = (page - 1) * limit || 0;
            sort = { "createdAt": -1 }


            let query = { status: true, inventory: { $gte: 1 } }
            let searchArray = []

            if (search) {
                searchArray.push(
                    { name: { '$regex': search, "$options": 'i' } },
                    { price: { '$regex': search, "$options": 'i' } }
                )
                query = { $or: searchArray };
            }

            let total = await groceryModel.countDocuments(query)
            let groceryList = await groceryModel.find(query).sort(sort).skip(skip).limit(limit)

            return res.status(200).send({
                code: 200,
                success: true,
                message: "Grocery item list fetched successfully",
                result: {
                    groceryList: groceryList,
                    total: total
                }
            });

        } catch (error) {
            console.log(error)
            return res.status(500).send({
                code: 500,
                success: false,
                message: "Something wents wrong",
            });
        }
    },

    //2 -> book multiple item
    createOrder: async (req, res) => {

        try {

            const { items } = req.body;

            if (!items || !Array.isArray(items) || items.length === 0) {
                return res.status(400).send({
                    code: 0,
                    success: false,
                    message: "Invalid order items.",
                    result: {},
                })
            }
            let totalPrice = 0;
            const finalGroceryItem = [];

            for (const orderItem of items) {
                const { groceryItemId, quantity } = orderItem;

                const groceryItem = await groceryModel.findById(groceryItemId);

                if (!groceryItem) {
                    return res.status(404).json({ error: `Grocery item with ID ${groceryItemId} not found.` });
                }

                totalPrice += groceryItem.price * quantity;

                finalGroceryItem.push({
                    groceryItemId: groceryItemId,
                    quantity,
                });
            }

            const newOrder = new orderModel({
                items: finalGroceryItem,
                totalPrice,
            });
            await newOrder.save();

            return res.status(200).send({
                code: 200,
                success: true,
                message: "Order placed successfully",
                result: {},
            });

        } catch (error) {
            console.log(error)
            return res.status(500).send({
                code: 500,
                success: false,
                message: "Something wents wrong",
            });
        }

    }

}