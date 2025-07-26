import Admins  from "../models/AdminModel.js"; // Import the Admin model
import argon2 from "argon2";

// // Get all admins (for admin-level users only)
// export const getAllAdmins = async (req, res) => {
//     try {
//         const admins = await Admins.findAll({
//             attributes: ['uuid', 'name', 'email', 'shop_name', 'address']
//         });
//         res.status(200).json(admins);
//     } catch (error) {
//         res.status(500).json({ msg: error.message });
//     }
// }

//  Get admin details by UUID
// export const getAdminById = async (req, res) => {
//     try {
//         const admin = await Admins.findOne({
//             where: {
//                 uuid: req.params.id
//             },
//             attributes: ['uuid', 'name', 'email', 'shop_name', 'address']
//         });
//         if (!admin) return res.status(404).json({ msg: "Admin not found" });    
//         res.status(200).json(admin);
//     } catch (error) {
//         res.status(500).json({ msg: error.message });
//     }
// }

// // Get admin details by admin_id (primary key or unique identifier)
// export const getAdminById = async (req, res) => {
//     try {
//         const admin = await Admins.findOne({
//             where: {
//                 admin_id: req.params.id // Searching by admin_id, not uuid
//             },
//             attributes: ['admin_id', 'name', 'email', 'shop_name', 'address'] // Ensure to return relevant fields
//         });

//         if (!admin) return res.status(404).json({ msg: "Admin not found" });
        
//         res.status(200).json(admin); // Return the admin details if found
//     } catch (error) {
//         res.status(500).json({ msg: error.message }); // Catch and handle errors
//     }
// }


// Create a new admin
export const createAdmin = async (req, res) => {
    const { name, email, password,phone, shop_name, address } = req.body;

    try {
        // Check if admin already exists
        const existingAdmin = await Admins.findOne({ where: { email } });
        if (existingAdmin) return res.status(400).json({ msg: "Admin with this email already exists" });

         // Hash the password using Argon2
         const hashedPassword = await argon2.hash(password);

        // Create a new admin
        const newAdmin = await Admins.create({
            name,
            email,
            password: hashedPassword, 
            phone, // Ensure to hash the password before saving it (not done here for simplicity)
            shop_name,
            address
        });
        res.status(201).json({ msg: "Admin created successfully", admin: newAdmin });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

//Login of admin
export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find admin by email
    const admin = await Admins.findOne({ where: { email } });
    if (!admin) {
      return res.status(404).json({ msg: "Admin not found" });
    }

    // Compare password with hashed password in DB
    const isPasswordValid = await argon2.verify(admin.password, password);
    if (!isPasswordValid) {
      return res.status(401).json({ msg: "Incorrect password" });
    }

    // Login successful
    res.status(200).json({ msg: "Login successful", admin });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Update admin details
export const updateAdmin = async (req, res) => {
    const { name, email,phone,shop_name, address } = req.body;

    try {
        const admin = await Admins.findOne({
            where: {
                uuid: req.params.id
            }
        });

        if (!admin) return res.status(404).json({ msg: "Admin not found" });

        // Update the admin details
        await Admins.update({
            name,
            email,
            phone,
            shop_name,
            address
        }, {
            where: { uuid: req.params.id }
        });

        res.status(200).json({ msg: "Admin updated successfully" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

// Delete an admin
export const deleteAdmin = async (req, res) => {
    try {
        const admin = await Admins.findOne({
            where: {
                admin_id: req.params.id
            }
        });

        if (!admin) return res.status(404).json({ msg: "Admin not found" });

        // Delete the admin
        await Admins.destroy({
            where: {
                admin_id: req.params.id
            }
        });

        res.status(200).json({ msg: "Admin deleted successfully" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}