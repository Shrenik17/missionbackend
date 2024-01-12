// Importing all the dependencies here
import express from "express";
import { addBlog, deleteBlog, getAllBlogs, getSingleBlog } from "../controller/blogController";

// Calling the router function
const router = express.Router();

// ALl the routes are defined below
// This route is used to add a new blog
router.post("/addBlog", addBlog);

// This route is used to get all the blogs details
router.get("/getAllBlogs", getAllBlogs);

// This route is used to get the single blog by using its id
router.get("/getSingleBlog/:id", getSingleBlog);

// THis route is used to delete the blog
router.delete("/deleteBlog/:id", deleteBlog);

// Exporting the router
export default router;
