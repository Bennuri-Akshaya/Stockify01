import express from "express";
import { createAdmin, loginAdmin, updateAdmin, deleteAdmin } from "../controllers/Admin.js";

const router = express.Router();


// Route to create a new admin
router.post("/register", createAdmin);

//Route to login a admin
router.post("/login",loginAdmin);

// Route to update an admin by admin_id
router.put("/:id", updateAdmin);

// Route to delete an admin by admin_id
router.delete("/:id", deleteAdmin);


// // Route to get all admins
// router.get("/", getAllAdmins);

// // Route to get a specific admin by admin_id (primary key)
// router.get("/:id", getAdminById);

export default router;
