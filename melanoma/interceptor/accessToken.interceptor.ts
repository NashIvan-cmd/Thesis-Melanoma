import * as SecureStore from "expo-secure-store";
import { useStorageState } from "@/services/useStorageState";

type UpdateTokenFunction = (newToken: string) => Promise<void>;

// Global variable to store the function reference
let globalUpdateAccessToken: UpdateTokenFunction | null = null;

// Function to set the reference (called by React context)
export const setGlobalUpdateAccessToken = (updateFn: UpdateTokenFunction) => {
  globalUpdateAccessToken = updateFn;
};

// Function to call the update (used by interceptor)
export const updateAccessTokenGlobally = async (newToken: string) => {
  if (globalUpdateAccessToken) {
    await globalUpdateAccessToken(newToken);
  } else {
    console.warn('Global updateAccessToken function not available');
  }
};

export const accessTokenInterceptor = async (response: any) => {
  const { accessToken } = response;
  console.log("Checking if new token is here", accessToken);
  if (!accessToken) return;

  
  // Use the global function instead of direct SecureStore access
  await updateAccessTokenGlobally(accessToken);
  
  return;
};
