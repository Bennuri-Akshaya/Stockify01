import express from "express";
import { 
    getUsers, 
    getUserById, 
    createUser, 
    updateUser, 
    deleteUser 
} from "../controllers/User.js";

const router = express.Router();

// // Route to fetch all users
// router.get("/", getUsers);

// // Route to fetch a single user by ID
// router.get("/:id", getUserById);


// Route to create a new user
router.post("/register", createUser);


// Route to update a user
router.put("/:id", updateUser);

// Route to delete a user
router.delete("/:id", deleteUser);

export default router;