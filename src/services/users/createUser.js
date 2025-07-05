import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const createUser = async (
  username,
  password,   
  name,       
  email,      
  phoneNumber, 
  pictureUrl
) => {
  // Add validation for required fields
  if (!username || !password || !name || !email || !phoneNumber) {
    throw new Error('Missing required fields: username, password, name, email, and phoneNumber are required');
  }

  const newUser = { 
    username,
    password,   
    name,       
    email,      
    phoneNumber, 
    pictureUrl
  };

  const user = await prisma.user.create({
    data: newUser,
  });
  
  return user;
};

export default createUser;