import express from "express";
import galleryUpload from '../middleware/galleryUploadFile';
import { addGalleryImage,deleteGalleryImages,getAllGalleryImages,getGalleryImageById,updateGalleryImages  } from "../controller/galleryController";

const router = express.Router();

router.get("/getAllGalleryImages",getAllGalleryImages);

router.post("/addGalleryImage", galleryUpload.single("galleryImage") ,addGalleryImage);

router.delete("/deleteGalleryImages/:id",deleteGalleryImages);

router.get("/getGalleryImageById/:id",getGalleryImageById)

router.put("/updateGalleryImages/:id", galleryUpload.single("galleryImage") ,updateGalleryImages)

export default router;