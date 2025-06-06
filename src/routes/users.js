import { Router } from "express";
import getUsers from "../services/users/getUsers.js"; 
import createUser from "../services/users/createUser.js";
import getUserById from "../services/users/getUserById.js";
import updateUserById from "../services/users/updateUserById.js";
import deleteUserById from "../services/users/deleteUserById.js";


const router = Router();

// GET /users => except password (query params) => http://localhost:3000/users?username=jdoe or http://localhost:3000/users?email=jane@example.com
router.get("/",  async (req, res) => {
    try {
        const { username, email } = req.query; // Get query params from URL
        const users = await getUsers({ username, email }); // Pass query params to the service
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// POST /users => create a new user (JWT TOKEN AUTHENTICATION REQUIRED!)
router.post("/", async (req, res) => {
  try {
        const { username, password, name, email, phoneNumber, pictureUrl } = req.body;
    const newUser = await createUser(username, password, name, email, phoneNumber, pictureUrl);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//GET /users/:id => get user by id
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const user = await getUserById(id);
         res.status(201).json(user);
    } catch (error) {
        res.status(404).json({ error: "User not found" });
    }
});

// PUT /users/:id => update user by id (JWT TOKEN AUTHENTICATION REQUIRED!)
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { username, password, name, email, phoneNumber, pictureUrl } = req.body;
        const updatedUserById = await updateUserById(id, { username, password, name, email, phoneNumber, pictureUrl });
        res.status(200).json(updatedUserById);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// DELETE /users/:id => delete user by id => delete related bookings and reviews (JWT TOKEN AUTHENTICATION REQUIRED!)
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const user = await deleteUserById(id);
        res.status(200).json({ message: "User deleted successfully", user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


export default router;