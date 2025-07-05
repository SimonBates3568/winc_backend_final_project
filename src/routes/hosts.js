import { Router } from "express";
import getHosts from "../services/hosts/getHosts.js";
import createHost from "../services/hosts/createHost.js";
import getHostById from "../services/hosts/getHostById.js";
import updateHostById from "../services/hosts/updateHostById.js";
import deleteHostById from "../services/hosts/deleteHostById.js";
import authMiddleware from "../middleware/authMiddleware.js";
import * as Sentry from "@sentry/node";

const router = Router();

// Host => GET => /hosts => Returns all hosts and their information, except password
//sentry added
router.get("/", async (req, res, next) => {
    try {
        const hosts = await getHosts();
        res.status(200).json(hosts);
    } catch (error) {
        Sentry.captureException(error);
        res.status(500).json({ error: error.message });
        next(error);
    }
});

// Host => POST => /hosts => Creates a new host (JWT TOKEN AUTHENTICATION)
// Sentry added
router.post("/", authMiddleware, async (req, res, next) => {
    try {
        console.log("REQ BODY:", req.body); 
        const { username, password, name, email, phoneNumber, pictureUrl, profilePicture, aboutMe } = req.body;
        
        // Add input validation for required fields
        if (!username || !password || !name || !email) {
            return res.status(400).json({ 
                error: "Missing required fields: username, password, name, and email are required" 
            });
        }
        
        // Use profilePicture if provided, otherwise fall back to pictureUrl
        const imageUrl = profilePicture || pictureUrl;
        const newHost = await createHost(username, password, name, email, phoneNumber, imageUrl, aboutMe);
        res.status(201).json(newHost);
    } catch (error) {
        Sentry.captureException(error);
        console.error("Detailed error:", error);
        // Add proper error categorization
        if (error.message.includes("validation") || error.code === 'P2002') {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }
        next(error);
    }
});

// Host => GET /hosts/:id => returns a single host by ID
// Sentry added
router.get("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        const host = await getHostById(id);
        if (!host) {
            return res.status(404).json({ error: "Host not found" });
        }
        res.status(200).json(host);
    } catch (error) {
        Sentry.captureException(error);
        res.status(500).json({ error: error.message });
        next(error);
    }
});

// Host => PUT => /hosts/:id => Updates a host by ID (JWT TOKEN AUTHENTICATION)
// Sentry added
router.put("/:id", authMiddleware, async (req, res, next) => {
    try {
        const { id } = req.params;
        const { username, password, name, email, phoneNumber, pictureUrl } = req.body;
        console.log("Updating host with ID:", id); // Add this
        const updatedHost = await updateHostById(id, { username, password, name, email, phoneNumber, pictureUrl });
        if (!updatedHost) {
            return res.status(404).json({ error: "Host not found" });
        }
        res.status(200).json(updatedHost);
    } catch (error) {
        console.log("Error details:", error); // Add this
        console.log("Error code:", error.code); // Add this
        console.log("Error message:", error.message); // Add this
        Sentry.captureException(error);
        // Add proper error categorization
        if (error.message.includes("not found") || error.code === 'P2025') {
            res.status(404).json({ error: "Host not found" });
        } else if (error.message.includes("validation") || error.code === 'P2002') {
            res.status(400).json({ error: error.message });
        } else if (error.message === "Invalid credentials") {
            res.status(401).json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }
        next(error);
    }
});

// Host => DELETE => /hosts/:id => Deletes a host by ID (JWT TOKEN AUTHENTICATION)
// Sentry added
router.delete("/:id", authMiddleware, async (req, res, next) => {
    try {
        const { id } = req.params;
        const host = await deleteHostById(id);
        if (!host) {
            return res.status(404).json({ error: "Host not found" });
        }
        res.status(200).json({ message: "Host deleted successfully", host });
    } catch (error) {
        Sentry.captureException(error);
        // Add proper error categorization
        if (error.message.includes("not found") || error.code === 'P2025') {
            res.status(404).json({ error: "Host not found" });
        } else {
            res.status(500).json({ error: error.message });
        }
        next(error);
    }
});



export default router;