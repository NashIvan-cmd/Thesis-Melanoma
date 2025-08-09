import { useContext, createContext, type PropsWithChildren, useState, useEffect,  } from 'react';
import { useStorageState } from '@/services/useStorageState';
import * as SecureStore from "expo-secure-store";
import { setGlobalUpdateAccessToken } from '@/interceptor/accessToken.interceptor';

import { API_URL } from '@env';

const AuthContext = createContext<{
  signIn: (username: string, password: string) => Promise<boolean>;
  signOut: () => void;
  updateAccessToken: (newToken: string) => Promise<void>; // ← Fix: Add parameter
  getCurrentToken: () => Promise <string>
  session?: string | null;
  accessToken?: string | null;
  userId?: string | null;
  username?: string | null;
  email?: string | null;
  isLoading: boolean;
}>({
  signIn: async (): Promise<boolean> => false,
  signOut: () => null,
  updateAccessToken: async (newToken: string): Promise<void> => {}, // ← Fix: Add parameter
  getCurrentToken: async () : Promise<string> => {return "string"},
  session: null,
  accessToken: null,
  userId: null,
  username: null,
  email: null,
  isLoading: false,
});

// This hook can be used to access the user info.
export function useSession() {
  const value = useContext(AuthContext);
  if (process.env.NODE_ENV !== 'production') {
    if (!value) {
      throw new Error('useSession must be wrapped in a <SessionProvider />');
    }
  }

  return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
  // Custom Hook
  // const [[isLoading, session], setSession] = useStorageState('session');
  const [[isLoading, accessToken], setAccessToken] = useStorageState('accessToken');
  const [[isY, userId], setUserId] = useStorageState("userId");
  const [[isZ, username], setUsername] = useStorageState("username");
  const [[isA, email], setEmail] = useStorageState("email");
  // console.log("Session value ", session);
  console.log({ accessToken, userId });

  const getCurrentAccessToken = async (): Promise<string> => {
    try {
      const currentToken = await SecureStore.getItemAsync('accessToken');

      if (!currentToken) {
        return "No token";
      }
      return currentToken;
    } catch (error) {
      console.error('Failed to get current access token:', error);
      return "No token";
    }
  };
  // Define the update function
  const updateAccessToken = async (newToken: string) => {
    // Only update via useStorageState — no need for SecureStore again if hook handles both
    setAccessToken(newToken);
    console.log("Access token updated to:", newToken);
  };

  // Set the global reference when component mounts
  useEffect(() => {
    setGlobalUpdateAccessToken(updateAccessToken);
    
    // Cleanup on unmount
    return () => {
      setGlobalUpdateAccessToken(async () => {});
    };
  }, []);

  return (
    <AuthContext.Provider

      value={{
        signIn:  async(username: string, password: string): Promise<boolean> => {
          // Perform sign-in logic here
          console.log("Attemp to sign in")
          try {
             const result =  await fetch(`${API_URL}/v1/auth/account`, {
              method: "POST",
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                username: username,
                password: password,
              })
            });
            
             const data = await result.json();

             console.log('Data', data);
             console.log("RESULT: ", result.formData);
             console.log("Server response", result.status);
              if (result.status == 200) {
                console.log("Setting On Secure Store and Session");
                console.log(data.refreshToken);
                console.log(data.username);
                console.log(data.message);
                // setSession(data.refreshToken);
                // // console.log("What is happening to AT", data.accessToken);
                setAccessToken(data.accessToken);
                setUserId(data.userId);
                setUsername(data.username);
                setEmail(data.email);

                // setSession("abs");
                // setAccessToken("abs");
                // setUserId("abs");
                return true;
              }
              return false;
    
          } catch (error) {
            console.error("Error @ sign-in", error);
            return false;
          }
         
        },
        signOut: () => {
          // setSession(null);
          setAccessToken(null);
        },
        // session,
        updateAccessToken,
        getCurrentToken: getCurrentAccessToken,
        accessToken,
        userId,
        username,
        email,
        isLoading
      }}>
      {children}
    </AuthContext.Provider>
  );
}
