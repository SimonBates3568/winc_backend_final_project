import { Router } from "express";
import { authenticateUser } from '../services/login/authenticateUser.js';


const router = Router();

const validateLoginRequest = (req) => {
  const { username, password } = req.body;
  
  if (!req.body || typeof req.body !== 'object') {
    return { isValid: false, message: "Request body is required." };
  }
  
  if (!username || !password) {
    return { isValid: false, message: "Username and password are required." };
  }
  
  if (typeof username !== 'string' || typeof password !== 'string') {
    return { isValid: false, message: "Username and password must be strings." };
  }
  
  if (username.trim() === '' || password.trim() === '') {
    return { isValid: false, message: "Username and password cannot be empty." };
  }
  
  return { isValid: true, username: username.trim(), password: password.trim() };
};

router.post('/', async (req, res) => {
  try {
    const validation = validateLoginRequest(req);
    if (!validation.isValid) {
      return res.status(400).json({ message: validation.message });
    }
    
    const { username, password } = validation;
    
    const result = await authenticateUser(username, password);
    
    if (!result.success) {
      return res.status(401).json({ message: result.message });
    }
    
    res.status(200).json({ 
      message: result.message, 
      token: result.token 
    });
    
  } catch (error) {
    console.error('Login route error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;