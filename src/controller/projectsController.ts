import { NextFunction, Request, Response } from "express";
import { db } from "../database/dbConnection";
import fs from "fs";

// This is the route to add the new event or news and the path to its image in the database
export const addProjects = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //   console.log("add project", req.body, req.file);
  try {
    const { title, type, projectYear, shortDesc, projectLink } = req.body;
    if (
      !req.file ||
      !title ||
      !type ||
      !projectYear ||
      !shortDesc ||
      !projectLink
    ) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({
        type: false,
        error: "Missing required file!",
      });
    } else {
      const fileName = req.file.filename;
      const filePath = `uploads/projects/${fileName}`;
      const query =
        "INSERT INTO projects (title, projectType, projectYear, shortDesc, imagePath, projectLink) VALUES (?)";
      const values = [
        title,
        type,
        projectYear,
        shortDesc,
        filePath,
        projectLink,
      ];
      db.getConnection(function (err, connection) {
        if (err) {
          return res.status(400).json({
            type: false,
            error: err,
            message: "Cannot establish the connection!",
          });
        } else {
          connection.query(query, [values], (err: any, data: any) => {
            if (err) {
              // console.log(err);
              return res.json({
                type: false,
                error: err,
                message: "Cannot add the new project!",
              });
            } else {
              return res.status(201).json({
                type: true,
                message: "New Project has been added successfully!",
              });
            }
          });
        }
        connection.release();
      });
    }
  } catch (error) {
    next(error);
  }
};

// This is the route to get all the projects
export const getAllProjects = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const query =
      "SELECT id, title, projectYear, projectType, shortDesc, imagePath, projectLink FROM projects";
    db.getConnection(function (err, connection) {
      if (err) {
        return res.status(400).json({
          type: false,
          error: err,
          message: "Cannot establish the connection!",
        });
      } else {
        connection.query(query, (err: any, data: any) => {
          if (err) {
            // console.log(err);
            return res.json({
              type: false,
              error: err,
              message: "Cannot get the project details!",
            });
          } else {
            const projectData = data.map((project: any) => {
              const photoBuffer = fs.readFileSync(project.imagePath); //stored binary data
              const photoBase64 = photoBuffer.toString("base64"); // converts the binary data to a base64-encoded string.

              return {
                id: project.id,
                title: project.title,
                type: project.projectType,
                projectYear: project.projectYear,
                shortDesc: project.shortDesc,
                // participants: project.participants,
                projectLink: project.projectLink,
                imagePath: `data:image/png;base64,${photoBase64}`,
              };
            });
            res.status(200).json(projectData);
          }
        });
      }
      connection.release();
    });
  } catch (error) {
    next(error);
  }
};

// This route is used to delete the events's details from the table
export const deleteProjects = (req: any, res: Response, next: NextFunction) => {
  try {
    db.getConnection(function (err, connection) {
      if (err) {
        return res.status(400).json({
          type: false,
          error: err,
          message: "Cannot establish the connection!",
        });
      } else {
        const id = req.params.id;
        const query = "DELETE FROM projects WHERE id=?";
        connection.query(query, id, (err: any, data: any) => {
          if (err) {
            return res.status(400).json({
              type: false,
              error: err,
              message: "Cannot establish the connection!",
            });
          } else {
            return res.status(200).json({
              type: true,
              message: `Successfully deleted project with id ${id}`,
            });
          }
        });
      }
      connection.release();
    });
  } catch (error) {
    next(error);
  }
};

// This route is used to get the members details from the database on  the basis of the member id
export const getProjectById = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const query =
      "SELECT id, title, projectType, projectYear, shortDesc, imagePath, projectLink FROM projects WHERE id=?";
    db.getConnection(function (err, connection) {
      if (err) {
        return res.status(400).json({
          type: false,
          error: err,
          message: "Cannot establish the connection!",
        });
      } else {
        connection.query(query, [id], (err: any, data: any) => {
          if (err) {
            // console.log(err);
            return res.json({
              type: false,
              error: err,
              message: "Cannot get the event's details!",
            });
          } else {
            const projectData = data.map((project: any) => {
              const photoBuffer = fs.readFileSync(project.imagePath);
              const photoBase64 = photoBuffer.toString("base64");

              return {
                id: project.id,
                title: project.title,
                type: project.type,
                projectYear: project.projectYear,
                shortDesc: project.shortDesc,
                // participants: project.participants,
                projectLink: project.projectLink,
                imagePath: `data:image/png;base64,${photoBase64}`,
              };
            });
            res.status(200).json(projectData);
          }
        });
      }
      connection.release();
    });
  } catch (error) {
    next(error);
  }
};

// This route is used to update the events or news details
export const updateProjects = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("update data", req.body);
  try {
    const id = req.params.id;
    const { title, type, projectYear, shortDesc, projectLink } = req.body;
    if (!req.file) {
      const query =
        "UPDATE projects SET title=?, projectType=?, projectYear=?, shortDesc=?,projectLink=? WHERE id=?";
      const values = [title, type, projectYear, shortDesc, projectLink, id];
      db.getConnection(function (err, connection) {
        if (err) {
          return res.status(400).json({
            type: false,
            error: err,
            message: "Cannot establish the connection!",
          });
        } else {
          connection.query(query, values, (err: any, data: any) => {
            if (err) {
              return res.status(401).json({
                type: false,
                error: err,
                message: "Cannot update the Project!",
              });
            } else {
              return res.status(200).json({
                type: true,
                message: "Project has been updated successfully!",
              });
            }
          });
        }
        connection.release();
      });
    } else {
      const fileName = req.file.filename;
      const filePath = `uploads/projects/${fileName}`;
      const query =
        "UPDATE projects SET title=?, projectType=?,projectYear=?, shortDesc=?,imagePath=?, projectLink=? WHERE id=?";
      const values = [
        title,
        type,
        projectYear,
        shortDesc,
        filePath,
        projectLink,
        id,
      ];
      db.getConnection(function (err, connection) {
        if (err) {
          return res.status(400).json({
            type: false,
            error: err,
            message: "Cannot establish the connection!",
          });
        } else {
          connection.query(query, values, (err: any, data: any) => {
            if (err) {
              return res.status(401).json({
                type: false,
                error: err,
                message: "Cannot update the events!",
              });
            } else {
              return res.status(200).json({
                type: true,
                message: "events has been updated successfully!",
              });
            }
          });
        }
        connection.release();
      });
    }
  } catch (error) {
    next(error);
  }
};

// This route is used to get all the years for the years and events
export const getYears = (req: Request, res: Response, next: NextFunction) => {
  try {
    const type = req.params.type;
    db.getConnection(function (err, connection) {
      if (err) {
        return res.status(400).json({
          type: false,
          error: err,
          message: "Cannot establish the connection!",
        });
      } else {
        // const id = req.params.id;
        const query = "SELECT projectYear FROM projects WHERE projectType=?";
        connection.query(query, [type], (err: any, data: any) => {
          if (err) {
            return res.status(400).json({
              type: false,
              error: err,
              message: "Cannot establish the connection!",
            });
          } else {
            const commonYears = data.map((item: any) => {
              return item.projectYear;
            });
            // console.log(commonYears.sort())
            const uniqueYears = [...new Set(commonYears.sort())];
            return res.status(200).json({
              type: true,
              data: uniqueYears,
            });
          }
        });
      }
      connection.release();
    });
  } catch (error) {
    next(error);
  }
};

// This route is used to get all the projects on the basis of years
export const getProjectsByYears = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const projectYear = req.params.year;
    const typeOfProject = req.params.type; //typeOfProject -> is used to avoid confusion bcs projectType is already used above
    const query =
      "SELECT id, title, type, projectYear, shortDesc, imagePath, projectLink FROM projects WHERE type=? AND projectYear=?";
    db.getConnection(function (err, connection) {
      if (err) {
        return res.status(400).json({
          type: false,
          error: err,
          message: "Cannot establish the connection!",
        });
      } else {
        connection.query(
          query,
          [typeOfProject, projectYear],
          (err: any, data: any) => {
            if (err) {
              // console.log(err);
              return res.json({
                type: false,
                error: err,
                message: "Cannot get the event's details!",
              });
            } else {
              const projectData = data.map((project: any) => {
                const photoBuffer = fs.readFileSync(project.imagePath);
                const photoBase64 = photoBuffer.toString("base64");

                return {
                  // id: events.id,
                  // title: events.title,
                  // type: events.type,
                  // projectYear: events.projectYear,
                  // shortDesc: events.shortDesc,
                  // participants: events.participants,
                  // projectLink: events.projectLink,
                  // imagePath: `data:image/png;base64,${photoBase64}`,
                  id: project.id,
                  title: project.title,
                  type: project.projectType,
                  projectYear: project.projectYear,
                  shortDesc: project.shortDesc,
                  projectLink: project.projectLink,
                  imagePath: `data:image/png;base64,${photoBase64}`,
                };
              });
              res.status(200).json({
                type: true,
                data: projectData,
              });
            }
          }
        );
      }
      connection.release();
    });
  } catch (error) {
    next(error);
  }
};
