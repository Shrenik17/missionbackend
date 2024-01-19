import { NextFunction, Request, Response } from "express";
import { db } from "../database/dbConnection";
import fs from "fs";

export const addLogoImage = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("req", req);
    const { title, shortDesc, logoLink } = req.body;
    if (!req.file || !title || !shortDesc || !logoLink) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({
        type: false,
        error: "Missing required file!",
      });
    } else {
      const fileName = req.file.filename;
      const filePath = `uploads/logo/${fileName}`;
      const query =
        "INSERT INTO logo (title, shortDesc, imagePath, logoLink) VALUES (?)";
      const values = [title, shortDesc, filePath, logoLink];
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
                message: "Cannot add the new image",
              });
            } else {
              return res.status(201).json({
                type: true,
                message: "New logo has been added successfully!",
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

export const getAllLogoImages = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const query =
      "SELECT id, title, shortDesc, imagePath, logoLink FROM logo";
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
              message: "Cannot get the logo details!",
            });
          } else {
            const logoImageData = data.map((images: any) => {
              const photoBuffer = fs.readFileSync(images.imagePath);
              const photoBase64 = photoBuffer.toString("base64");

              return {
                id: images.id,
                title: images.title,

                shortDesc: images.shortDesc,

                logoLink: images.logoLink,
                imagePath: `data:image/png;base64,${photoBase64}`,
              };
            });
            res.status(200).json(logoImageData);
          }
        });
      }
      connection.release();
    });
  } catch (error) {
    next(error);
  }
};

export const deleteLogoImages = (
  req: any,
  res: Response,
  next: NextFunction
) => {
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
        const query = "DELETE FROM logo WHERE id=?";
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
              message: `Successfully deleted image with id ${id}`,
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

export const getLogoImageById = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const query =
      "SELECT id, title, shortDesc, imagePath, logoLink FROM logo WHERE id=?";
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
              message: "Cannot get the logo's details!",
            });
          } else {
            const logoImageData = data.map((images: any) => {
              const photoBuffer = fs.readFileSync(images.imagePath);
              const photoBase64 = photoBuffer.toString("base64");

              return {
                id: images.id,
                title: images.title,
                shortDesc: images.shortDesc,
                logoLink: images.logoLink,
                imagePath: `data:image/png;base64,${photoBase64}`,
              };
            });
            res.status(200).json(logoImageData);
          }
        });
      }
      connection.release();
    });
  } catch (error) {
    next(error);
  }
};

export const updateLogoImages = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("update data", req.body);
  try {
    const id = req.params.id;
    const { title, shortDesc, logoLink } = req.body;
    if (!req.file) {
      const query =
        "UPDATE logo SET title=?, shortDesc=?,logoLink=? WHERE id=?";
      const values = [title, shortDesc, logoLink, id];
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
                message: "Cannot update the image",
              });
            } else {
              return res.status(200).json({
                type: true,
                message: "Gallery has been updated successfully!",
              });
            }
          });
        }
        connection.release();
      });
    } else {
      const fileName = req.file.filename;
      const filePath = `uploads/logo/${fileName}`;
      const query =
        "UPDATE logo SET title=?, shortDesc=?, imagePath=?, logoLink=? WHERE id=?";
      const values = [title, shortDesc, filePath, logoLink, id];
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
                message: "Cannot update the events/news!",
              });
            } else {
              return res.status(200).json({
                type: true,
                message: "Events/News has been updated successfully!",
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
