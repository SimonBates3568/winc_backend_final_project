import { PrismaClient } from '@prisma/client';
  const prisma = new PrismaClient();

const createUser = async (
        username,
        password,   
        name ,       
        email ,      
        phoneNumber, 
        pictureUrl ) => {
  const newUser = { 
        username,
        password,   
        name ,       
        email ,      
        phoneNumber, 
        pictureUrl   };
  const user = await prisma.user.create({
    data: newUser,
  });
  console.log(user);
  return user;
};

export default createUser;