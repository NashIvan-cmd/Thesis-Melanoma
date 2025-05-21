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


export const deleteUserMolesFolder = async (userId: string) => {
  const folderPath = `moles/${userId}/`; // the user's folder path

  // Step 1: List all files inside the user's folder
  const { data: files, error: listError } = await supabase.storage
    .from('melanoma-thesis')
    .list(folderPath);

  if (listError) {
    console.error('Error listing files:', listError);
    throw listError;
  }

  if (!files || files.length === 0) {
    console.log('No files found to delete.');
    return;
  }

  // Step 2: Construct full file paths to delete
  const filesToDelete = files.map(file => folderPath + file.name);

  // Step 3: Delete all files at once
  const { data: deleteData, error: deleteError } = await supabase.storage
    .from('melanoma-thesis')
    .remove(filesToDelete);

  if (deleteError) {
    console.error('Error deleting files:', deleteError);
    throw deleteError;
  }

  return deleteData;
};
