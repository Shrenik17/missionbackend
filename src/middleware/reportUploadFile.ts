import multer from "multer";

// Multer storage
const storage = multer.diskStorage({
  destination: (req: any, file: any, cb: any) => {
    cb(null, "uploads/reports");
  },
  filename: (req: any, file: any, cb: any) => {
    const originalname = file.originalname.replace(/\s/g, "_");
    cb(null, Date.now() + "_" + originalname);
  },
});

// Multer upload instance
const reportUpload = multer({ storage,limits: {
  fieldSize: 1024 * 1024 * 5, // Adjust the field size limit as needed
  fileSize: 1024 * 1024 * 5,
}, });

export default reportUpload;