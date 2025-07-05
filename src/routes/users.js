import { Router } from "express";
import getUsers from "../services/users/getUsers.js"; 
import createUser from "../services/users/createUser.js";
import getUserById from "../services/users/getUserById.js";
import updateUserById from "../services/users/updateUserById.js";
import deleteUserById from "../services/users/deleteUserById.js";
import authMiddleware from "../middleware/authMiddleware.js"; 
import * as Sentry from "@sentry/node";

const router = Router();

// User => GET => /users => Returns all users and their information, except password
//sentry added
router.get("/", async (req, res, next) => {
    try {
        const { username, email } = req.query;
        const users = await getUsers({ username, email });
        res.status(200).json(users);
    } catch (error) {
        Sentry.captureException(error);
        res.status(500).json({ error: error.message });
        next(error);
    }
});


// User => POST => /user => Creates a new user 
//sentry added
router.post("/", async (req, res, next) => {
    try {
        const { username, password, name, email, phoneNumber, profilePicture, pictureUrl } = req.body;
        // Use profilePicture if provided, otherwise fall back to pictureUrl
        const imageUrl = profilePicture || pictureUrl;
        const newUser = await createUser(username, password, name, email, phoneNumber, imageUrl);
        res.status(201).json(newUser);
    } catch (error) {
        Sentry.captureException(error);
        // Handle validation errors with 400 status
        if (error.message.includes('Missing required fields') || error.message.includes('required')) {
            return res.status(400).json({ error: error.message });
        }
        if (error.message === "Invalid credentials") {
            return res.status(401).json({ error: error.message });
        }
        // Handle Prisma unique constraint errors
        if (error.code === 'P2002') {
            return res.status(400).json({ error: 'User with this email or username already exists' });
        }
        res.status(500).json({ error: error.message });
        next(error);
    }
});

// User => GET => /user/:id => Returns a single user.
// Sentry monitoring added
router.get("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await getUserById(id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        Sentry.captureException(error);
        res.status(500).json({ error: error.message });
        next(error);
    }
});

// User => PUT =>  /user/:id => Updates a user by ID (JWT TOKEN AUTHENTICATION)
// Sentry monitoring added
router.put("/:id", authMiddleware, async (req, res, next) => {
    try {
        const { id } = req.params;
        const { username, password, name, email, phoneNumber, pictureUrl } = req.body;
        const updatedUserById = await updateUserById(id, { username, password, name, email, phoneNumber, pictureUrl });
        if (!updatedUserById) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json(updatedUserById);
    } catch (error) {
        Sentry.captureException(error);
        if (error.message === "Invalid credentials") {
            res.status(401).json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }
        next(error);
    }
});
// User => DELETE => /user/:id => Deletes a user by ID (JWT TOKEN AUTHENTICATION)
// Sentry monitoring added
router.delete("/:id", authMiddleware, async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await deleteUserById(id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json({ message: "User deleted successfully", user });
    } catch (error) {
        Sentry.captureException(error);
        res.status(500).json({ error: error.message });
        next(error);
    }
});

export default router;