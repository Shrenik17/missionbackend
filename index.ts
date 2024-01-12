// Importing all the liberaries
import express, { Express } from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import {
  LoginLogoutRoutes,
  contactRoutes,
  blogRoutes,
  memberRoutes,
  eventsNewsRoutes,
  projectsRoutes,
  galleryRoutes,
  reportRoutes,
  
} from "./src/routes/indexRoutes";
import { config } from "./src/config/config";
import ErrorHandler from "./src/middleware/errorHandler";

// Calling the configurations
const app: Express = express();
app.use(express.json());
app.use(bodyParser.json());
dotenv.config();
app.use(cookieParser());
app.use(helmet());
// Setting all the headers here
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", ["*"]);
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST");
  res.header("Access-Control-Allow-Headers", ["Content-Type", "Authorization"]);
  res.header("Access-Control-Expose-Headers", ["Authorization"]);
  next();
});

// Cors are defined below
var corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// All routes are defined below
app.get("/", (req, res) => {
  res.status(200).json({
    message: `Main server running fine at ${config.baseUrl}:${config.port}`,
  });
});
app.use("/auth", LoginLogoutRoutes);
app.use("/contact", contactRoutes);
app.use("/blog", blogRoutes);
app.use("/members", memberRoutes);
app.use("/events", eventsNewsRoutes);
app.use("/projects", projectsRoutes);
app.use("/gallery",galleryRoutes);
app.use("/report",reportRoutes)

// Calling the global error handler middleware here
app.use(ErrorHandler);

// Server is calling below
app.listen(config.port, () => {
  console.log(
    `[server]: Server is running at ${config.baseUrl}:${config.port}`
  );
});
