import React, { createContext, useCallback, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-community/async-storage";
import api from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  avatar_url: string;
}

interface AuthState {
    token: string;
    user: User;
  }
  
  interface SignInCredentials {
    email: string;
    password: string;
  }
  
  interface AuthContextData {
    user: User;
    loading: boolean;
    signIn(credentials: SignInCredentials): Promise<void>;
    signOut(): void;
  }
  
  const AuthContext = createContext<AuthContextData>({} as AuthContextData);
  
  const AuthProvider: React.FC = ({ children }) => {
    const [data, setData] = useState<AuthState>({} as AuthState);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      async function loadStoragedData(): Promise<void> {
        const [token, user] = await AsyncStorage.multiGet([
          '@GoBarber:token',
          '@GoBarber:user',
        ]);

        // api.defaults.headers.authorization = `Bearer ${token}` ;

  
        if (token[1] && user[1]) {
          console.log('aqui que zoa?');
          console.log({ token: token[1], user: JSON.parse(user[1]) })
          setData({ token: token[1], user: JSON.parse(user[1]) })
        }
        setLoading(false);
      }
  
      loadStoragedData();
      
    }, []);
  
    const signIn = useCallback(async ({ email, password }) => {

      const response = await api.post<AuthState>('sessions', {
        email,
        password,
      }); 
       
      const {token, user} = response.data;

      console.log('auth.signin')
     

      await AsyncStorage.multiSet([
        ['@GoBarber:token', token],
        ['@GoBarber:user', JSON.stringify(user)],
      ]);
  
      console.log(token)
      console.log(user)

      setData({ token, user });
      
    }, []);

    const signOut = useCallback(async() => {
      AsyncStorage.multiRemove([
        '@GoBarber:user',
        '@GoBarber:token',
      ]);

      setData ({} as AuthState);
    }, []);
  
    return (
      <AuthContext.Provider value={{ user: data.user, signIn, signOut, loading }}>
        {children}
      </AuthContext.Provider>
    );
};

function useAuth(): AuthContextData {
    const context = useContext(AuthContext);

    if (!context) {
      throw new Error("useAuth must be send within a AuthProvider"); 
    }

    return context;
}

export { AuthProvider, useAuth}
