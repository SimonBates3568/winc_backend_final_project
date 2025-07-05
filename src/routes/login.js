import { Router } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const router = Router();
//Login post /login => Returns a token upon a successful user login
// TODO: Add Sentry monitoring to this route if needed

router.post('/', async (req, res) => {
  try {
    const secretKey = process.env.AUTH_SECRET_KEY || "my-secret-key";
    const { username, password } = req.body;

 // debugging
    console.log('Request body:', req.body);
    console.log('Content-Type:', req.get('Content-Type'));

    // Validate that username and password are provided
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required." });
    }

    // Find user with matching credentials
    const user = await prisma.user.findUnique({
      where: {
        username: username
      }
    });

    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials!" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, secretKey);

    res.status(200).json({ message: "Successfully logged in!", token });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;