import express from 'express';
import { 
    getAllProducts,
    getProductsByAdmin,
    getProductByName,
    createProduct,
    updateProduct,
    deleteProduct
} from '../controllers/Product.js';

const router = express.Router();

// Route to fetch all products or search products by name
router.get('/', getAllProducts);


// Products Route
router.post("/api/products", (req, res) => {
    const { name, price, stock } = req.body;

    if (!name || !price || !stock) {
        return res.status(400).json({ msg: "Please provide all fields" });
    }

    res.status(201).json({ msg: "Product created", product: { name, price, stock } });
});

// Route to fetch a single product by UUID
// router.get('/:id', getProductById);

// Route to create a new product (admin)
router.post('/', createProduct);

// Route to update an existing product (admin)
router.put('/:id', updateProduct);

// Route to delete a product (admin)
router.delete('/:id', deleteProduct);

//Route to get product by name 
router.get("/:product_name", getProductByName);

//Route to get prodcut from admin_id
router.get("/admin/:admin_id", getProductsByAdmin);

export default router;
