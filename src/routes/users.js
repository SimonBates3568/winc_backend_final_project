import { Router } from "express";
import getUsers from "../services/users/getUsers.js"; 
import createUser from "../services/users/createUser.js";
import getUserById from "../services/users/getUserById.js";
import updateUserById from "../services/users/updateUserById.js";
import deleteUserById from "../services/users/deleteUserById.js";
import authMiddleware from "../middleware/errorHandler.js";


const router = Router();

// GET /users => Get all users with optional query parameters for filtering and no password
router.get("/", async (req, res) => {
    try {
        const { username, email } = req.query;
        const users = await getUsers({ username, email });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /users
router.post("/", authMiddleware, async (req, res) => {
    try {
        const { username, password, name, email, phoneNumber, pictureUrl } = req.body;
        const newUser = await createUser(username, password, name, email, phoneNumber, pictureUrl);
        res.status(201).json(newUser);
    } catch (error) {
        if (error.message === "Invalid credentials") {
            res.status(401).json({ error: error.message });
        } else {
            res.status(400).json({ error: error.message });
        }
    }
});

// GET /users/:id
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const user = await getUserById(id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT /users/:id
router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { username, password, name, email, phoneNumber, pictureUrl } = req.body;
        const updatedUserById = await updateUserById(id, { username, password, name, email, phoneNumber, pictureUrl });
        if (!updatedUserById) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json(updatedUserById);
    } catch (error) {
        if (error.message === "Invalid credentials") {
            res.status(401).json({ error: error.message });
        } else {
            res.status(400).json({ error: error.message });
        }
    }
});

// DELETE /users/:id
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const user = await deleteUserById(id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json({ message: "User deleted successfully", user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;