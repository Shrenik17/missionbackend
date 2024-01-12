
// Importing all the dependencies here
import express from "express";

import {
  addProjects,
  deleteProjects,
  getAllProjects,
  getProjectById,
  updateProjects,
  getYears,
  getProjectsByYears,
} from "../controller/projectsController";
import projectUpload from "../middleware/projectUploadFile";

// Calling the router function
const router = express.Router();

// ALl the routes are defined below
// This is the route to get all the events and news
router.get("/getAllProjects", getAllProjects);

// This is the route to add the new event or news and the path to its image in the database
router.post("/addProjects", projectUpload.single("projectImage"), addProjects);

// This route is used to delete the events's details from the table
router.delete("/deleteProject/:id", deleteProjects);

// This route is used to get the events/news details from the database on the basis of the member id
router.get("/getProjectByID/:id", getProjectById);

// This route is used to update the events or news details
router.put(
  "/updateProjects/:id",
  projectUpload.single("projectImage"),
  updateProjects
);

// This route is used to get all the years for the years and events
router.get("/getYears/:Type", getYears);

// This route is used to get all the events on the basis of years
router.get("/getProjectsByYear/:year/:type", getProjectsByYears);


// Exporting the router
export default router;
