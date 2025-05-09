import { useContext, createContext, type PropsWithChildren, useState } from 'react';
import { useStorageState } from '@/services/useStorageState';

import { API_URL } from '@env';

const AuthContext = createContext<{
  signIn: (username: string, password: string) => Promise<boolean>;
  signOut: () => void;
  session?: string | null;
  accessToken?: string | null;
  userId?: string | null;
  username?: string | null;
  email?: string | null;
  isLoading: boolean;
}>({
  signIn: async (): Promise<boolean> => false,
  signOut: () => null,
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
  const [[isLoading, session], setSession] = useStorageState('session');
  const [[isX, accessToken], setAccessToken] = useStorageState('accessToken');
  const [[isY, userId], setUserId] = useStorageState("userId");
  const [[isZ, username], setUsername] = useStorageState("username");
  const [[isA, email], setEmail] = useStorageState("email");
  console.log("Session value ", session);
  console.log({ accessToken, userId });

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
                'cookie': session ? session : ''
              },
              body: JSON.stringify({
                username: username,
                password: password,
              })
            });
            
             const data = await result.json();

             console.log('Data', data);
             console.log("Server response", result.status);
              if (result.status == 202) {
                setSession(data.refreshToken);
                // // console.log("What is happening to AT", data.accessToken);
                setAccessToken(data.accessToken);
                setUserId(data.userId);
                setUsername("John Kenneth Doe");
                setEmail("JohnDoe@gmail.com");

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
          setSession(null);
          setAccessToken(null);
        },
        session,
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
