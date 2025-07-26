import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Admins from "./AdminModel.js";  // Importing Admin model to link admin_id

const { DataTypes } = Sequelize;

const Products = db.define("products", {
    product_id: {
        type: DataTypes.INTEGER,
        // autoIncrement: true,
        primaryKey: true,
        allowNull:false
    },
    admin_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Admins,  // Referencing Admin table
            key: 'admin_id'
        },
        onDelete: "CASCADE"  // If an admin is deleted, products related to that admin will be deleted too
    },
    product_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: true, len: [3, 100] }
    },

    selling_price: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: { notEmpty: true }
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: { notEmpty: true }
    },
    stock_quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    product_image: {
        type: DataTypes.STRING,
        allowNull: true
    },
    category: {
        type: DataTypes.STRING,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM("available", "out_of_stock", "discontinued"),
        defaultValue: "available",
        allowNull: false
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW,
        onUpdate: Sequelize.NOW
    }
}, { 
    freezeTableName: true, 
    timestamps: false 
});

// Admin-Product Relationship
Admins.hasMany(Products, { foreignKey: 'admin_id' });  // Admin can have many products
Products.belongsTo(Admins, { foreignKey: 'admin_id' }); // Product belongs to one Admin

export { Admins, Products};

export default Products;
