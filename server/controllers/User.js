import Users from "../models/UserModel.js";
import argon2 from "argon2";
import jwt from "jsonwebtoken";

// Get all users
export const getUsers = async (req, res) => {
    try {
        const users = await Users.findAll({
            attributes: ["user_id", "uuid", "name", "email", "phone", "address", "created_at"]
        });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

// Get user by ID
export const getUserById = async (req, res) => {
    try {
        const user = await Users.findOne({
            where: { user_id: req.params.id },
            attributes: ["user_id", "uuid", "name", "email", "phone", "address", "created_at"]
        });
        if (!user) return res.status(404).json({ msg: "User not found" });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

// Create a new user
export const createUser = async (req, res) => {
    const { user_id,name, email, password, phone, address } = req.body;

    try {
        // Check if email already exists
        const existingUser = await Users.findOne({ where: { email } });
        if (existingUser) return res.status(400).json({ msg: "Email already in use" });

        // Hash the password using Argon2
        const hashedPassword = await argon2.hash(password);

        // Create user
        await Users.create({
            user_id,
            name,
            email,
            password: hashedPassword,
            phone,
            address
        });
        res.status(201).json({ msg: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

// Update user details
export const updateUser = async (req, res) => {
    const { name, email, phone, address } = req.body;

    try {
        const user = await Users.findOne({ where: { user_id: req.params.id } });
        if (!user) return res.status(404).json({ msg: "User not found" });

        await Users.update({ name, email, phone, address }, { where: { user_id: req.params.id } });

        res.status(200).json({ msg: "User updated successfully" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

// Delete user
export const deleteUser = async (req, res) => {
    try {
        const user = await Users.findOne({ where: { user_id: req.params.id } });
        if (!user) return res.status(404).json({ msg: "User not found" });

        await Users.destroy({ where: { user_id: req.params.id } });

        res.status(200).json({ msg: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
