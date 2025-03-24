import { DataTypes } from "sequelize";
import { Database } from "../../database/db.js";


//Tabla
const database = new Database();
const Products = database.db.define("Products", {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    price:{
        type: DataTypes.INTEGER,
        allowNull:false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    unity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

Products.sync();

export default Products;