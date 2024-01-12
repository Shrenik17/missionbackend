import express from "express";
import {addReport, deleteReport, getReport, getReportById, getReportPdf, updateReport } from "../controller/reportController";
import reportUpload from '../middleware/reportUploadFile';

const router = express.Router();

router.post("/addReport", reportUpload.single('reportPdf'), addReport);

router.get("/getReport", getReport);

router.delete("/deleteReport/:id",deleteReport);

router.get("/getReportPdf/:id", getReportPdf);

router.put("/updateReport/:id",reportUpload.single('reportPdf'),updateReport);

router.get("/getReportById/:id",getReportById);

export default router;
