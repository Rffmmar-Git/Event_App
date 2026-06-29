import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "eventhub/banners",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  } as any,
});

export const bannerUpload = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});