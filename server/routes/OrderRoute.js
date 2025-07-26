
const router = express.Router();
import express from 'express';
import { 
    createOrder, 
    getOrderById, 
    getOrders, 
    getOrdersByDate 
} from '../controllers/Order.js';
// import { verifyUser, verifyAdmin } from '../middleware/authMiddleware.js';

// Admin routes
// Route to fetch all orders (for admin)
router.get('/', getOrders);

// Route to search orders by date range (startDate, endDate) (for admin)
router.get('/searchByDate', getOrdersByDate); 

// Route to fetch a single order by ID (for admin)
router.get('/:id', getOrderById);

// User routes
// Route to create a new order (user can place an order)
router.post('/', createOrder);

// Route to fetch all orders placed by the user
router.get('/user', getOrders);

// Route to search orders by date range (startDate, endDate) (for user)
router.get('/user/searchByDate', getOrdersByDate);

// Route to fetch a single order by ID (for user)
router.get('/user/:id', getOrderById);

export default router;
