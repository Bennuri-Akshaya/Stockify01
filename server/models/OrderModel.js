import { Sequelize, DataTypes } from 'sequelize'; 
import db from '../config/Database.js';
import Products from "./ProductsModel.js";
import Users from './UserModel.js';

const Orders = db.define('orders', {
    order_id: { // Primary key for orders
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    product_id: {  // Foreign key for product
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Products,
            key: 'product_id'
        },
        onDelete: 'CASCADE',
        
    },
    user_id: { // Foreign key for user (who placed the order)
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Users,
            key: 'user_id'
        },
        onDelete: 'CASCADE',
    },
    quantity: {  // Quantity of the product ordered
        type: DataTypes.INTEGER,
        allowNull: false
    },
    total_price: {  // Total price for the order (product price * quantity)
        type: DataTypes.FLOAT,
        allowNull: false
    },
    order_status: {  // Status of the order (e.g., pending, completed, canceled)
        type: DataTypes.STRING,
        defaultValue: 'pending',
        allowNull: false
    },
    order_date: {  // Date of the order
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
}, {
    freezeTableName: true
});
 
export default Orders;