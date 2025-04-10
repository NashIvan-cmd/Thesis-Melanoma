import { v2 as cloudinary } from 'cloudinary'
import dotenv from 'dotenv'

dotenv.config();

cloudinary.config({
    cloud_name: "ds8siv5vp",
    security: true,
    api_key: process.env.CLOUDINARY_API,
    api_secret: process.env.CLOUDINARY_SECRET 
})

export const cloudinaryUpload = async (base64: string, moleOwner: string): Promise<string> => {
    try {
      const result = await cloudinary.uploader.upload(base64, {
        folder: "moles",
        tags: [moleOwner],
        context: `moleOwner=${moleOwner}`,
        type: "private"
      });
      
      return result.secure_url;
    } catch (error) {
      console.error("Error @ cloudinary upload", error);
      throw error;
    }
  };
  


