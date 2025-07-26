import Products from "../models/ProductsModel.js";
import Admin from "../models/AdminModel.js"; 
import { Op } from "sequelize";

// Get all products from all admins
export const getAllProducts = async (req, res) => {
    
    try {
        const products = await Products.findAll({
            attributes: ['product_id', 'product_name', 'selling_price', 'stock_quantity'],
            include: [{
                model: Admin,
                attributes: ['name', 'email'] // Optional: Shows the admin who created the product
            }]
        });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

//Get products 
export const getProductsByAdmin = async (req, res) => {
    try {
        const { admin_id } = req.params; // Get admin_id from URL params

        const products = await Products.findAll({
            where: { admin_id: admin_id } // Filter by admin_id
        });

        if (products.length === 0) {
            return res.status(404).json({ msg: "No products found for this admin" });
        }

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};


export const getProductByName = async (req, res) => {
    const { name } = req.query; // Get the product name from query parameters

    try {
        const products = await Products.findAll({
            where: {
                name: {
                    [Op.iLike]: `%${product_name}%`  // Case-insensitive search
                }
            },
            attributes: ['admin_id', 'product_name', 'selling_price', 'stock_quantity'],  // Specify the attributes you want to return
            include: [{
                model: Admin,
                attributes: ['name', 'email']  // Optional: admin details for the product
            }]
        });

        if (products.length === 0) {
            return res.status(404).json({ msg: "No products found" });
        }

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};


// Create a new product (for admins only)
export const createProduct = async (req, res) => {
    try {
    const { product_id,product_name, selling_price,description,stock_quantity,product_image,category,admin_id} = req.body;

        await Products.create({
            product_id,
            admin_id,
            product_name,
            selling_price,
            description,
            stock_quantity,
            product_image,
            category
             // Use admin's ID to associate with the product
        });
        res.status(201).json({ msg: "Product Created Successfully" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

// Update product details (for admins only)
export const updateProduct = async (req, res) => {
    const { name, price, stock } = req.body;

    try {
        const product = await Products.findOne({
            where: { uuid: req.params.id }
        });
        if (!product) return res.status(404).json({ msg: "Product not found" });

        // Check if the logged-in user is the admin associated with the product
        if (req.adminId !== product.admin_id) return res.status(403).json({ msg: "Forbidden" });

        await Products.update(
            { name, price, stock },
            { where: { uuid: req.params.id } }
        );

        res.status(200).json({ msg: "Product updated successfully" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

// Delete a product (for admins only)
export const deleteProduct = async (req, res) => {
    try {
        const product = await Products.findOne({
            where: { admin_id: req.params.id }
        });
        if (!product) return res.status(404).json({ msg: "Product not found" });

        // Check if the logged-in user is the admin associated with the product
        if (req.adminId !== product.admin_id) return res.status(403).json({ msg: "Forbidden" });

        await Products.destroy({
            where: { admin_id: req.params.id }
        });

        res.status(200).json({ msg: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

// Place an order (Update stock when a user orders)
export const placeOrder = async (req, res) => {
    const { productId, quantity } = req.body;

    try {
        // Step 1: Retrieve the product by productId
        const product = await Products.findOne({
            where: { uuid: productId }
        });

        // Step 2: Check if the product exists and if there is enough stock
        if (!product) {
            return res.status(404).json({ msg: "Product not found" });
        }
        if (product.stock < quantity) {
            return res.status(400).json({ msg: "Not enough stock available" });
        }

        // Step 3: Update the product's stock by reducing the ordered quantity
        await Products.update(
            { stock: product.stock - quantity },
            { where: { uuid: productId } }
        );

        // Step 4: Respond with success message
        res.status(200).json({ msg: "Order placed successfully, stock updated" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const getProducts = async (req, res) => {
    try {
        let response;

        // Check if there's a search query for product name
        const { search } = req.query;

        if (search) {
            // Search for products with the name matching the query
            response = await Products.findAll({
                where: {
                    name: {
                        [Op.iLike]: `%${search}%`  // Case-insensitive search
                    }
                }
            });
        } else {
            // If no search query, fetch all products
            response = await Products.findAll();
        }

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
