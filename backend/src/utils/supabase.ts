import { supabase } from './supaSupabaseClient';
import { v4 as uuidv4 } from 'uuid';
import { Buffer } from 'buffer';

/*
 * Upload a base64 image to Supabase Storage.
 * @param base64 - base64 string (photoUri)
 * @param moleOwner - identifier (user ID or username)
 * @returns Object containing both public and signed URLs, plus path info
 */

export const uploadBase64ImageToSupabase = async (
  base64: string,
  moleOwner: string
): Promise<{ publicUrl: string; signedUrl: string; path: string }> => {
  try {
    const matches = base64.match(/^data:(.+);base64,(.+)$/);
    if (!matches) throw new Error('Invalid base64 image format');

    const mimeType = matches[1]; // e.g. image/jpeg
    const imageData = matches[2]; // base64 string only
    const buffer = Buffer.from(imageData, 'base64');

    const fileExtension = mimeType.split('/')[1]; // jpeg, png, etc.
    const fileName = `${uuidv4()}.${fileExtension}`;

    // Example path: moles/user_abc123/uuid.jpg
    const filePath = `moles/${moleOwner}/${fileName}`;

    const { data, error } = await supabase.storage
      .from('melanoma-thesis')
      .upload(filePath, buffer, {
        contentType: mimeType,
        upsert: false, // don't overwrite if same name exists
      });

    if (error) throw error;

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('melanoma-thesis')
      .getPublicUrl(filePath);

    // Get signed URL (private, time-limited access)
    const { data: signedData, error: signedError } = await supabase.storage
      .from('melanoma-thesis')
      .createSignedUrl(filePath, 60 * 60 * 24 * 7); // URL valid for 7 days

    if (signedError) throw signedError;

    return {
      publicUrl: urlData.publicUrl,
      signedUrl: signedData.signedUrl,
      path: filePath,
    };
  } catch (err) {
    console.error('Image upload failed:', err);
    throw err;
  }
};


export const deleteImageFromSupabase = async (cloudId: string) => {
  const { data, error } = await supabase.storage
    .from('melanoma-thesis')
    .remove([cloudId]);

  if (error) {
    console.error('Error removing file:', error);
    throw error;
  }

  return data;
};
