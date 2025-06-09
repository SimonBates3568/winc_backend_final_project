import { Router } from "express";

const router = Router();
//  query params => /properties?location=Malibu, California&pricePerNight=310.25&amenities=Wifi
// GET /properties => returns all properties

//POST /properties => create a new property (JWT TOKEN AUTHENTICATION REQUIRED!)

//GET /properties/:id => get property by id
//PUT /properties/:id => update property by id(JWT TOKEN AUTHENTICATION REQUIRED!)
//DELETE /properties/:id => delete property by id(JWT TOKEN AUTHENTICATION REQUIRED!)


export default router;