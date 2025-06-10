import { Router } from "express";
import userData from "../data/users.json" with { type: "json" };
import jwt from "jsonwebtoken";

const router = Router();

router.post("/", (req, res) => {
  const secretKey = process.env.AUTH_SECRET_KEY || "my-secret-key";
  const { username, password } = req.body;
  const { users } = userData;

  // Validate that username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  // Find user with matching credentials
  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials!" });
  }

  // Generate JWT token
  const token = jwt.sign({ userId: user.id }, secretKey);

  res.status(200).json({ message: "Successfully logged in!", token });
});

export default router;