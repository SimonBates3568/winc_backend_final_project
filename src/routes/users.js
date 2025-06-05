import { Router } from "express";
import getUsers from "../services/users/getUsers.js"; 
import createUser from "../services/users/createUser.js";
import getUserById from "../services/users/getUserById.js";
import updateUserById from "../services/users/updateUserById.js";
import deleteUserById from "../services/users/deleteUserById.js";


const router = Router();

// GET /users => except password
router.get("/",  async (req, res) => {
  const users = await getUsers();
  res.json(users);
});

// POST /users => create a new user
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

// PUT /users/:id => update user by id
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

// DELETE /users/:id => delete user by id => delete related bookings and reviews
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