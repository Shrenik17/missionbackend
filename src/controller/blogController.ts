import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { db } from "../database/dbConnection";
import CustomRequest from "../middleware/authentication";

// This route is used to add a new blog
export const addBlog = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { blogHeading, postedDate, writtenBy, htmlContent } = req.body;
    if (!blogHeading || !postedDate || !writtenBy || !htmlContent) {
      return res.status(400).json({
        type: false,
        error: "Missing required file!",
      });
    } else {
      const query =
        "INSERT INTO blogs (blogHeading, postedDate, writtenBy, htmlContent) VALUES (?)";
      const values = [blogHeading, postedDate, writtenBy, htmlContent];
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
                message: "Cannot add the new blog!",
              });
            } else {
              return res.status(201).json({
                type: true,
                message: "New blog has been added successfully!",
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

// This route is used to get all the blogs details
export const getAllBlogs = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const query =
      "SELECT blog_id, blogHeading, postedDate, writtenBy, htmlContent FROM blogs";
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
              message: "Cannot get all the blogs",
            });
          } else {
            const blogsData = data.map((blog: any) => {
              const convertedDate = new Date(
                blog.postedDate
              ).toLocaleDateString();
              return {
                blog_id: blog.blog_id,
                blogHeading: blog.blogHeading,
                postedDate: convertedDate,
                writtenBy: blog.writtenBy,
                htmlContent: blog.htmlContent,
              };
            });
            return res.status(200).json({
              type: true,
              data: blogsData,
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

// This route is used to get the single blog by using its id
export const getSingleBlog = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const blogId = req.params.id;
    const query =
      "SELECT blog_id, blogHeading, postedDate, writtenBy, htmlContent FROM blogs WHERE blog_id=?";
    db.getConnection(function (err, connection) {
      if (err) {
        return res.status(400).json({
          type: false,
          error: err,
          message: "Cannot establish the connection!",
        });
      } else {
        connection.query(query, [blogId], (err: any, data: any) => {
          if (err) {
            return res.json({
              type: false,
              error: err,
              message: "Cannot get the blogs details!",
            });
          } else {
            const convertedDate = new Date(
              data[0].postedDate
            ).toLocaleDateString();
            const blogData = {
              blog_id: data[0].blog_id,
              blogHeading: data[0].blogHeading,
              postedDate: convertedDate,
              writtenBy: data[0].writtenBy,
              htmlContent: data[0].htmlContent,
            };
            return res.status(200).json({
              type: true,
              data: blogData,
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

// THis route is used to delete the blog
export const deleteBlog = (req: Request, res: Response, next: NextFunction) => {
  try {
    db.getConnection(function (err, connection) {
      if (err) {
        return res.status(400).json({
          type: false,
          error: err,
          message: "Cannot establish the connection!",
        });
      } else {
        const blogId = req.params.id;
        const query = "DELETE FROM blogs WHERE blog_id=?";
        connection.query(query, blogId, (err: any, data: any) => {
          if (err) {
            return res.status(400).json({
              type: false,
              error: err,
              message: "Cannot delete the blog!",
            });
          } else {
            return res.status(200).json({
              type: true,
              message: `Successfully deleted blog with id ${blogId}`,
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
