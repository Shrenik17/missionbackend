import multer from "multer";

// Multer storage
const storage = multer.diskStorage({
    destination: (req: any, file: any, cb: any) => {
        cb(null, "uploads/logo");
    },
    filename: (req: any, file: any, cb: any) => {
        const originalname = file.originalname.replace(/\s/g, "_");
        cb(null, Date.now() + "_" + originalname);
    },
});

// Multer upload instance
const logoUpload = multer({ storage });

export default logoUpload;
