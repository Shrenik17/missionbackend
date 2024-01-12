import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { db } from "../database/dbConnection";
import CustomRequest from "../middleware/authentication";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";

// This route is used to signup a new user into the database
export const contactForm = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // console.log(req.body);
    const { name, email, phoneNumber, message } = req.body;
    if (!name || !email || !phoneNumber || !message) {
      return res.status(401).json({
        type: false,
        error: "Missing required fields!",
      });
    } else {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: "revDau360@gmail.com",
          pass: "vryg qxgb njga gkys",
        },
      });
      
      const mailOptions = {
        from: "revDau360@gmail.com",
        to: ["ashu2084@gmail.com","patilshrikant1980@gmail.com","akash.agarwal@revdau.com","patilshrenik17@gmail.com"], 
        subject: "New Form Submission",
        text: `
                        Name: ${name}
                        Email: ${email}
                        Phone: ${phoneNumber}
                        Message: ${message}
                      `,
      };

      transporter.sendMail(mailOptions, function (error: any, info: any) {
        if (error) {
          throw new Error();
        } else {
          db.getConnection(function (error, connection) {
            if (error) {
              return res.status(400).json({
                type: false,
                error: error,
                message: "Cannot establish the connection!",
              });
            } else {
              const createdAt = Date.now();
              const insertQuery = `INSERT INTO form_submissions (userName, email, phoneNumber, message) VALUES (?, ?, ?, ?)`;
              const values = [name, email, phoneNumber, message, createdAt];
              connection.query(
                insertQuery,
                values,
                async (error: any, data: any) => {
                  if (error) {
                    return res.status(400).json({
                      type: false,
                      error: error,
                    });
                  } else if (data) {
                    // console.log("Data aa gaya db se ---->", data);
                    return res.status(200).json({
                      type: true,
                      message: `'Email sent: ' + ${info.response}!`,
                    });
                  } else {
                    return res.status(500).json({
                      type: false,
                      message: "Internal server error!",
                    });
                  }
                }
              );
              connection.release();
            }
          });
        }
      });
    }
  } catch (error) {
    next(error);
  }
};
