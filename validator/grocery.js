const { Validator } = require("node-input-validator");

const addGrocerySchema = {
    name: "required",
    price: "required",
    inventory: "required",
};
const groceryIdSchema = {
    groceryId: "required"
};

const validationSchema = {
    addGrocery: addGrocerySchema,
    groceryId: groceryIdSchema
};

const validation = async (data, type) => {
    const v = new Validator(data, validationSchema[type]);
    const valid = await v.check();
    if (!valid) {
        return v.errors[Object.keys(v.errors)[0]].message;
    } else {
        return false;
    }
};

module.exports = { validation };
