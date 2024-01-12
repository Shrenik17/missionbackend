import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { db } from "../database/dbConnection";
import fs from "fs";
import path from "path";
import CustomRequest from "../middleware/authentication";

// This is the route to add the new event or news and the path to its image in the database
export const addEventNews = (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title, eventNewsType, eventNewsYear, shortDesc, participants, eventNewsLink } = req.body;
        if (!req.file || !title || !eventNewsType || !eventNewsYear || !shortDesc || !participants || !eventNewsLink) {
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(400).json({
                type: false,
                error: "Missing required file!",
            });
        } else {
            const fileName = req.file.filename;
            const filePath = `uploads/events/${fileName}`;
            const query = "INSERT INTO eventsNews (title, eventNewsType, eventNewsYear, shortDesc, participants, imagePath, eventNewsLink) VALUES (?)";
            const values = [title, eventNewsType, eventNewsYear, shortDesc, participants, filePath, eventNewsLink];
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
                                message: "Cannot add the new event or news!",
                            });
                        } else {
                            return res.status(201).json({
                                type: true,
                                message: "New event or news has been added successfully!",
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

// This is the route to get all the events and news
export const getAllEventsNews = (req: Request, res: Response, next: NextFunction) => {
    try {
        const query = "SELECT id, title, eventNewsType, eventNewsYear, shortDesc, participants, imagePath, eventNewsLink FROM eventsNews";
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
                        const eventsData = data.map((events: any) => {
                            const photoBuffer = fs.readFileSync(events.imagePath);
                            const photoBase64 = photoBuffer.toString("base64");

                            return {
                                id: events.id,
                                title: events.title,
                                eventNewsType: events.eventNewsType,
                                eventNewsYear: events.eventNewsYear,
                                shortDesc: events.shortDesc,
                                participants: events.participants,
                                eventNewsLink: events.eventNewsLink,
                                imagePath: `data:image/png;base64,${photoBase64}`,
                            };
                        });
                        res.status(200).json(eventsData);
                    }
                })
            }
            connection.release();
        })
    } catch (error) {
        next(error)
    }
};

// This route is used to delete the events's details from the table
export const deleteEventNews = (req: any, res: Response, next: NextFunction) => {
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
                const query = "DELETE FROM eventsNews WHERE id=?";
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
                            message: `Successfully deleted event or news with id ${id}`,
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

// This route is used to get the members details from the database on  the basis of the member id
export const getEventsNewsById = (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;
        const query = "SELECT id, title, eventNewsType, eventNewsYear, shortDesc, participants, imagePath, eventNewsLink FROM eventsNews WHERE id=?";
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
                        const eventsData = data.map((events: any) => {
                            const photoBuffer = fs.readFileSync(events.imagePath);
                            const photoBase64 = photoBuffer.toString("base64");

                            return {
                                id: events.id,
                                title: events.title,
                                eventNewsType: events.eventNewsType,
                                eventNewsYear: events.eventNewsYear,
                                shortDesc: events.shortDesc,
                                participants: events.participants,
                                eventNewsLink: events.eventNewsLink,
                                imagePath: `data:image/png;base64,${photoBase64}`,
                            };
                        });
                        res.status(200).json(eventsData);
                    }
                })
            }
            connection.release();
        })
    } catch (error) {
        next(error)
    }
};

// This route is used to update the events or news details
export const updateEventNews = (req: Request, res: Response, next: NextFunction) => {
    console.log("update data", req.body)
    try {
        const id = req.params.id;
        const { title, eventNewsType, eventNewsYear, shortDesc, participants, eventNewsLink } = req.body;
        if (!req.file) {
            const query = "UPDATE eventsNews SET title=?, eventNewsType=?, eventNewsYear=?, shortDesc=?, participants=?, eventNewsLink=? WHERE id=?";
            const values = [title, eventNewsType, eventNewsYear, shortDesc, participants, eventNewsLink, id]
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
                                message: "Cannot update the event or news!",
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
            const filePath = `uploads/events/${fileName}`;
            const query = "UPDATE eventsNews SET title=?, eventNewsType=?, eventNewsYear=?, shortDesc=?, participants=?, imagePath=?, eventNewsLink=? WHERE id=?";
            const values = [title, eventNewsType, eventNewsYear, shortDesc, participants, filePath, eventNewsLink, id]
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

// This route is used to get all the years for the years and events
export const getYears = (req: Request, res: Response, next: NextFunction) => {
    try {
        const eventNewsType = req.params.eventNewsType;
        db.getConnection(function (err, connection) {
            if (err) {
                return res.status(400).json({
                    type: false,
                    error: err,
                    message: "Cannot establish the connection!",
                });
            } else {
                // const id = req.params.id;
                const query = "SELECT eventNewsYear FROM eventsNews WHERE eventNewsType=?"
                connection.query(query, [eventNewsType], (err: any, data: any) => {
                    if (err) {
                        return res.status(400).json({
                            type: false,
                            error: err,
                            message: "Cannot establish the connection!",
                        });
                    } else {
                        const commonYears = data.map((item: any) => {
                            return item.eventNewsYear
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
        next(error)
    };
};

// This route is used to get all the events on the basis of years
export const getEventsNewsByYears = (req: Request, res: Response, next: NextFunction) => {
    try {
        const eventNewsYear = req.params.year;
        const eventOrNews = req.params.type;
        const query = "SELECT id, title, eventNewsType, eventNewsYear, shortDesc, participants, imagePath, eventNewsLink FROM eventsNews WHERE eventNewsType=? AND eventNewsYear=?";
        db.getConnection(function (err, connection) {
            if (err) {
                return res.status(400).json({
                    type: false,
                    error: err,
                    message: "Cannot establish the connection!",
                });
            } else {
                connection.query(query, [eventOrNews, eventNewsYear], (err: any, data: any) => {
                    if (err) {
                        // console.log(err);
                        return res.json({
                            type: false,
                            error: err,
                            message: "Cannot get the event's details!",
                        });
                    } else {
                        const eventsNewsData = data.map((events: any) => {
                            const photoBuffer = fs.readFileSync(events.imagePath);
                            const photoBase64 = photoBuffer.toString("base64");

                            return {
                                id: events.id,
                                title: events.title,
                                eventNewsType: events.eventNewsType,
                                eventNewsYear: events.eventNewsYear,
                                shortDesc: events.shortDesc,
                                participants: events.participants,
                                eventNewsLink: events.eventNewsLink,
                                imagePath: `data:image/png;base64,${photoBase64}`,
                            };
                        });
                        res.status(200).json({
                            type: true,
                            data: eventsNewsData
                        });
                    }
                })
            }
            connection.release();
        })
    } catch (error) {
        next(error)
    }
};