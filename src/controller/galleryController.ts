import { NextFunction, Request, Response } from "express";
import { db } from "../database/dbConnection";
import fs from "fs";

export const addGalleryImage = (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log("req",req);
        const { title, shortDesc, galleryImageLink } = req.body;
        if (!req.file || !title || !shortDesc || !galleryImageLink) {
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(400).json({
                type: false,
                error: "Missing required file!",
            });
        } else {
            const fileName = req.file.filename;
            const filePath = `uploads/gallery/${fileName}`;
            const query = "INSERT INTO gallery (title, shortDesc, imagePath, galleryImageLink) VALUES (?)";
            const values = [title, shortDesc, filePath, galleryImageLink];
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
                                message: "New image has been added successfully!",
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

export const getAllGalleryImages = (req: Request, res: Response, next: NextFunction) => {
    try {
        const query = "SELECT id, title, shortDesc, imagePath, galleryImageLink FROM gallery";
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
                            message: "Cannot get the events details!",
                        });
                    } else {
                        const galleryData = data.map((images: any) => {
                            const photoBuffer = fs.readFileSync(images.imagePath);
                            const photoBase64 = photoBuffer.toString("base64");

                            return {
                                id: images.id,
                                title: images.title,
                               
                                shortDesc: images.shortDesc,
                              
                                galleryImageLink: images.galleryImageLink,
                                imagePath: `data:image/png;base64,${photoBase64}`,
                            };
                        });
                        res.status(200).json(galleryData);
                    }
                })
            }
            connection.release();
        })
    } catch (error) {
        next(error)
    }
};


export const deleteGalleryImages = (req: any, res: Response, next: NextFunction) => {
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
                const query = "DELETE FROM gallery WHERE id=?";
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
        next(error)
    }
};

export const getGalleryImageById = (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;
        const query = "SELECT id, title, shortDesc, imagePath, galleryImageLink FROM gallery WHERE id=?";
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
                        const galleryData = data.map((images: any) => {
                            const photoBuffer = fs.readFileSync(images.imagePath);
                            const photoBase64 = photoBuffer.toString("base64");

                            return {
                                id: images.id,
                                title: images.title,
                                shortDesc: images.shortDesc,
                                galleryImageLink: images.galleryImageLink,
                                imagePath: `data:image/png;base64,${photoBase64}`,
                            };
                        });
                        res.status(200).json(galleryData);
                    }
                })
            }
            connection.release();
        })
    } catch (error) {
        next(error)
    }
};

export const updateGalleryImages = (req: Request, res: Response, next: NextFunction) => {
    console.log("update data", req.body)
    try {
        const id = req.params.id;
        const { title,shortDesc, galleryImageLink } = req.body;
        if (!req.file) {
            const query = "UPDATE gallery SET title=?, shortDesc=?,galleryImageLink=? WHERE id=?";
            const values = [title, shortDesc, galleryImageLink, id]
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
                                message: "Event/News has been updated successfully!",
                            });
                        }
                    });
                }
                connection.release();
            });
        } else {
            const fileName = req.file.filename;
            const filePath = `uploads/gallery/${fileName}`;
            const query = "UPDATE gallery SET title=?, shortDesc=?, imagePath=?, galleryImageLink=? WHERE id=?";
            const values = [title,shortDesc, filePath, galleryImageLink, id]
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
        next(error)
    }
};