// Importing all the dependencies here
import express from "express";
import { LoginMainRoute, login, signup } from "../controller/login_logout";
import { authentication } from "../middleware/authentication";

// Calling the router function
const router = express.Router();

// ALl the routes are defined below
// Main route to test the working of the login_logout route
router.get('/', LoginMainRoute);

// This route is used to signup a new user into the database
router.post("/signup", signup);

// This route is used to login in to the db
router.post("/login", login);

// Exporting the router
export default router;