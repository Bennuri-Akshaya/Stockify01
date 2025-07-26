import Orders from "../models/OrderModel.js"; // Import the Order model
import Products from "../models/ProductsModel.js"; // Import the Product model

// Create a new order
const generateOrderId = async () => {
    let orderId;
    let isUnique = false;

    while (!isUnique) {
        orderId = Math.floor(Math.random() * 1_000_000_0000); // Generate a 10-digit integer
        const existingOrder = await Orders.findOne({ where: { order_id: orderId } });
        if (!existingOrder) isUnique = true;
    }
    return orderId;
};
export const createOrder = async (req, res) => {
    const { products } = req.body;
    if (!products || products.length === 0) {
        return res.status(400).json({ msg: "No products provided" });
    }

    try {
        let totalOrderPrice = 0;
        const newOrders = [];

        for (const product of products) {
            const { product_name, quantity } = product;

            // Fetch product details using product_name
            const productData = await Products.findOne({ where: { name: product_name } });
            if (!productData) {
                return res.status(404).json({ msg: `Product '${product_name}' not found` });
            }

            const { product_id, price } = productData;
            const total_price = quantity * price;
            totalOrderPrice += total_price;

            const order_id = await generateOrderId(); // Generate a unique 10-digit order ID

            const newOrder = await Orders.create({
                order_id,
                product_id,
                user_id: req.userId,
                quantity,
                total_price,
                order_date: new Date(),
                order_status: 'pending'
            });

            newOrders.push(newOrder);
        }

        res.status(201).json({ msg: "Order created successfully", totalOrderPrice, orders: newOrders });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

//get all orders
export const getOrders = async (req, res) => {
    try {
        let response;
        if (req.role === "admin") {
            // Admin can view all orders
            response = await Orders.findAll({
                attributes: ['order_id', 'user_id', 'product_id', 'quantity', 'total_price', 'order_status', 'order_date'],
            });
        } else {
            // User can only view their own orders
            response = await Orders.findAll({
                attributes: ['order_id', 'product_id', 'quantity', 'total_price', 'order_status', 'order_date'],
                where: { user_id: req.userId },
            });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const getOrderById = async (req, res) => {
    try {
        const order = await Orders.findOne({
            where: { order_id: req.params.id }, // Search by order_id
            attributes: ['order_id', 'product_id', 'quantity', 'total_price', 'order_status', 'order_date'],
        });

        if (!order) return res.status(404).json({ msg: "Order not found" });

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

// Search for orders by a specific date or date range
export const getOrdersByDate = async (req, res) => {
    try {
        const { startDate, endDate } = req.query; // Query params for date range (startDate and endDate)

        let orders;

        if (startDate && endDate) {
            // If both startDate and endDate are provided, search for orders within the date range
            orders = await Orders.findAll({
                where: {
                    [Op.and]: [
                        { createdAt: { [Op.gte]: new Date(startDate) } },  // Start date filter
                        { createdAt: { [Op.lte]: new Date(endDate) } }     // End date filter
                    ]
                }
            });
        } else if (startDate) {
            // If only startDate is provided, search for orders from that specific date onwards
            orders = await Orders.findAll({
                where: {
                    createdAt: { [Op.gte]: new Date(startDate) }
                }
            });
        } else if (endDate) {
            // If only endDate is provided, search for orders up to that specific date
            orders = await Orders.findAll({
                where: {
                    createdAt: { [Op.lte]: new Date(endDate) }
                }
            });
        } else {
            // If no date is provided, fetch all orders (optional, depending on your needs)
            orders = await Orders.findAll();
        }

        // Ensure to check for orders returned
        if (!orders || orders.length === 0) {
            return res.status(404).json({ msg: "No orders found for the specified date(s)" });
        }

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};


// Get all orders placed by a user
export const getUserOrders = async (req, res) => {
    try {
        const orders = await Orders.findAll({
            where: { userId: req.params.userId }
        });

        if (orders.length === 0) return res.status(404).json({ msg: "No orders found for this user" });

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

// Get all orders (admin view)
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Orders.findAll();
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

// Update the status of an order (admin only)
export const updateOrderStatus = async (req, res) => {
    const { status } = req.body;
    try {
        const order = await Orders.findOne({
            where: { uuid: req.params.id }
        });

        if (!order) return res.status(404).json({ msg: "Order not found" });

        order.status = status;  // Update the order's status
        await order.save(); // Save the changes to the database

        res.status(200).json({ msg: "Order status updated successfully", order });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
