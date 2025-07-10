import jwt from "jsonwebtoken";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const authenticateUser = async (username, password) => {
  try {
    const user = await prisma.user.findUnique({
      where: { username }
    });
    
    if (!user || user.password !== password) {
      return { success: false, message: "Invalid credentials!" };
    }
    
    const secretKey = process.env.AUTH_SECRET_KEY || "my-secret-key";
    const token = jwt.sign({ userId: user.id }, secretKey);
    
    return { success: true, token, message: "Successfully logged in!" };
  } catch (error) {
    console.error('Authentication service error:', error);
    throw new Error('Authentication failed');
  }
};

export { authenticateUser };
