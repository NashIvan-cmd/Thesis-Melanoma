import { useImage } from "expo-image";
import { useImageManipulator } from "expo-image-manipulator";


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

export const manipulateIosImage = async(uri: string, imageWidth: number, imageHeight: number) => {
    const context = useImageManipulator(uri);
    const cropWidth = 200;
    const cropHeight = 200;

    const originX = (imageWidth - cropWidth) / 2;
    const originY = (imageHeight - cropHeight) / 2;

    context.crop({
        height: cropHeight, 
        originX, 
        originY, 
        width: cropWidth       
    })

    const image = await context.renderAsync();

    return image;

}