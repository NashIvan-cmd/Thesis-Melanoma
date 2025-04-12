import { useImageManipulator } from "expo-image-manipulator";
import * as ImageManipulator from "expo-image-manipulator";

export const convertToBase64 = async (uri: string): Promise<string> => {
    const response = await fetch(uri);
    const blob = await response.blob();
  
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string); // data:image/jpeg;base64,...
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

export const manipulateIosImage = async (uri: string, imageWidth: number, imageHeight: number) => {
  console.log({ imageWidth, imageHeight });
  const cropWidth = imageWidth * 0.6;
  const cropHeight = imageHeight * 0.6;
  const originX = (imageWidth - cropWidth) / 2;
  const originY = (imageHeight - cropHeight) / 2;


  const result = await ImageManipulator.manipulateAsync(
    uri,
    [
      { crop: { originX: originX, originY: originY, width: cropWidth, height: cropHeight } },
      { rotate: 0 }, // helps apply rotation metadata (EXIF fix)
    ],
    { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
  );
  
  return result; // Has { uri, width, height }
};