import { v2 as cloudinary } from 'cloudinary'
import dotenv from 'dotenv'

dotenv.config();

export interface MoleData {
  id: string;
  body_orientation: string;
  body_part: string;
  mole_owner: string;
  x_coordinate: number;
  y_coordinate: number;
  cloudId: string;
  publicId: string;
  createdAt: string;
  // Add a signedUrl field that's optional since we'll be adding it
  signedUrl?: string;
}

cloudinary.config({
    cloud_name: "ds8siv5vp",
    security: true,
    api_key: process.env.CLOUDINARY_API,
    api_secret: process.env.CLOUDINARY_SECRET 
})

export const cloudinaryUpload = async(base64: string, moleOwner: string): Promise<{ publicId: string; secureUrl: string }> => {
    try {
      const result = await cloudinary.uploader.upload(base64, {
        folder: "moles",
        tags: [moleOwner],
        context: `moleOwner=${moleOwner}`,
        type: 'authenticated',
        // access_control: [{ access_type: "token" }]x
      });
      
      const cloudData = {
        publicId: result.public_id,
        secureUrl: result.secure_url
      };
      
      return cloudData;
    } catch (error) {
      console.error("Error @ cloudinary upload", error);
      throw error;
    }
};

export const signedUrlGenerator = async(arr: MoleData[]): Promise<MoleData[]> => {
  try {
    
    const signedArr = arr.map(item => {
      const newItem = { ...item };
      
      const signedUrl = cloudinary.url(newItem.publicId, {
        sign_url: true,
        secure: true,
        type: 'authenticated',
        resource_type: 'image'
      });

      newItem.signedUrl = signedUrl;

      return newItem;
    })

    return signedArr;
  } catch (error) {
    console.error("Error signing URLs:", error);
    return arr;
  }
}