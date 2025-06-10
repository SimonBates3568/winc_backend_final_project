import { Router } from "express";
import getHosts from "../services/hosts/getHosts.js";
import createHost from "../services/hosts/createHost.js";
import getHostById from "../services/hosts/getHostById.js";
import updateHostById from "../services/hosts/updateHostById.js";
import deleteHostById from "../services/hosts/deleteHostById.js";
import authMiddleware from "../middleware/errorHandler.js";

const router = Router();

//GET /hosts => returns all hosts
router.get("/", async (req, res) => {
    try {
        const hosts = await getHosts();
        res.status(200).json(hosts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /hosts => create a new host(JWT TOKEN AUTHENTICATION)
router.post("/",  authMiddleware, async (req, res) => {
    try {
        console.log("REQ BODY:", req.body); 
        // Destructure all required fields from req.body
        const { username, password, name, email, phoneNumber, pictureUrl, aboutMe } = req.body;
        // Pass as a single object to createHost
        const newHost = await createHost({ username, password, name, email, phoneNumber, pictureUrl, aboutMe });
        res.status(201).json(newHost);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// GET /hosts/:id => get host by id
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const host = await getHostById(id);
        if (!host) {
            return res.status(404).json({ error: "Host not found" });
        }
        res.status(200).json(host);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT /hosts/:id => update host by id (JWT TOKEN AUTHENTICATION)
router.put("/:id",  authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { username, password, name, email, phoneNumber, pictureUrl } = req.body;
        const updatedHost = await updateHostById(id, { username, password, name, email, phoneNumber, pictureUrl });
        if (!updatedHost) {
            return res.status(404).json({ error: "Host not found" });
        }
        res.status(200).json(updatedHost);
    } catch (error) {
        if (error.message === "Invalid credentials") {
            res.status(401).json({ error: error.message });
        } else {
            res.status(400).json({ error: error.message });
        }
    }
});

// DELETE /hosts/:id => delete host by id (JWT TOKEN AUTHENTICATION)
router.delete("/:id",  authMiddleware, async (req, res) => {
    try {
  
        const { id } = req.params;
        const host = await deleteHostById(id);
        if (!host) {
            return res.status(404).json({ error: "Host not found" });
        }
        res.status(200).json({ message: "Host deleted successfully", host });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



export default router;