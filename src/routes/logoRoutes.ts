import express from "express";

import { addLogoImage,deleteLogoImages,getAllLogoImages,getLogoImageById,updateLogoImages } from "../controller/logoController";
import logoUpload from "../middleware/logoUploadFIle";

const router = express.Router();

router.get("/getAllLogoImages",getAllLogoImages);

router.post("/addLogoImage", logoUpload.single("logoImage") ,addLogoImage);

router.delete("/deleteLogoImages/:id",deleteLogoImages);

router.get("/getLogoImageById/:id",getLogoImageById)

router.put("/updateLogoImages/:id", logoUpload.single("logoImage") ,updateLogoImages)

export default router;