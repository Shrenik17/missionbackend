import { NextFunction, Request, Response } from "express";
import { db } from "../database/dbConnection";
import fs from "fs";

export const addReport = (req: Request, res: Response, next: NextFunction) => {
    // console.log(req.file);
    // console.log(req.body);
    
    try {
      const { title, publishedBy ,reportYear , shortDesc } = req.body;
      if (!req.file || !title || !publishedBy || !reportYear || !shortDesc ) {
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }
        return res.status(400).json({
          type: false,
          error: "Missing required file!",
        });
      } else {
        const fileName = req.file.filename;
        const filePath = `uploads/reports/${fileName}`;
        const query = "INSERT INTO reports (title, publishedBy,reportYear,shortDesc,pdfPath) VALUES (?)";
        const values = [title, publishedBy,reportYear,shortDesc,filePath];
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
                  message: "Cannot add the new report!",
                });
              } else {
                return res.status(201).json({
                  type: true,
                  message: "New report has been added successfully!",
                });
              }
            });
          }
          connection.release();
        });
      }
    } catch (error) {
      next(error)
    }
  };
  


  export const getReport = (req: any, res: Response, next: NextFunction) => {
    try {
      const query = "SELECT id, title, publishedBy,reportYear,shortDesc,pdfPath FROM reports";
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
                message: "Cannot get the report details!",
              });
            } else {
              const reportData = data.map((report: any) => {
                const pdfBuffer = fs.readFileSync(report.pdfPath);
                const pdfBase64 = pdfBuffer.toString("base64");
  
                return {
                  id: report.id,
                  title: report.title,
                  publishedBy: report.publishedBy,
                  reportYear: report.reportYear,
                  shortDesc: report.shortDesc,
                  pdfData: `data:application/pdf;base64,${pdfBase64}`,
                };
              });
              return res.status(200).json({
                type: true,
                data: reportData
              });
       
              
            }
          })
        }
        connection.release();
      });
    } catch (error) {
      next(error)
    }
  };

  export const getReportById = (req: any, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const query = "SELECT id, title, publishedBy,reportYear,shortDesc,pdfPath FROM reports WHERE id=?";
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
                message: "Cannot get the reports details!",
              });
            } else {
              const reportData = data.map((report: any) => {
                const pdfBuffer = fs.readFileSync(report.pdfPath);
                const pdfBase64 = pdfBuffer.toString("base64");
  
                return {
                  id: report.id,
                  title: report.title,
                  publishedBy: report.publishedBy,
                  reportYear: report.reportYear,
                  shortDesc: report.shortDesc,
                  pdfData: `data:application/pdf;base64,${pdfBase64}`,
                };
              });
              return res.status(200).json({
                //type: true,
                data: reportData
              });
            }
          });
        }
        connection.release();
      });
    } catch (error) {
      next(error)
    }
  };
  export const getReportPdf = (req: any, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const query = "SELECT pdfPath FROM reports WHERE id=?";
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
              return res.json({
                type: false,
                error: err,
                message: "Cannot get the reports details!",
              });
            } else {
              const filePath = data[0].pdfPath;
                        var file = fs.readFileSync(filePath);
                        res.contentType("application/pdf");
                        res.send(file);
            }
          });
        }
        connection.release();
      });
    } catch (error) {
      next(error)
    }
  };

 
  export const deleteReport = (req: any, res: Response, next: NextFunction) => {
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
          const query = "DELETE FROM reports WHERE id=?";
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
                message: `Successfully deleted report with id ${id}`,
              });
            }
          });
        }
        connection.release();
      });
    } catch (error) {
      next(error)
    }
  };


  export const updateReport = (req: any, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const { title, publishedBy ,reportYear , shortDesc } = req.body;
      if (!req.file) {
        const query = "UPDATE reports SET title=?, publishedBy=?,reportYear=?,shortDesc=? WHERE id=?";
        const values = [title, publishedBy,reportYear,shortDesc];
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
                return res.json({
                  type: false,
                  error: err,
                  message: "Cannot update the report!",
                });
              } else {
                return res.status(200).json({
                  type: true,
                  message: "Report has been updated successfully!",
                });
              }
            });
          }
          connection.release();
        });
      } else {
        const fileName = req.file.filename;
        const filePath = `uploads/reports/${fileName}`;
        const query = "UPDATE reports SET title=?, publishedBy=?, reportYear=?, shortDesc=?, pdfPath=?  WHERE id=?";
        const values = [title, publishedBy,reportYear,shortDesc,filePath];
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
                return res.json({
                  type: false,
                  error: err,
                  message: "Cannot update the report!",
                });
              } else {
                return res.status(200).json({
                  type: true,
                  message: "report has been updated successfully!",
                });
              }
            });
          }
          connection.release();
        });
      }
    } catch (error) {
      next(error)
    }
  };