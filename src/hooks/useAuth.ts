import { useState, useEffect, useCallback } from 'react';
import {
  onAuthChange,
  signUpWithEmail,
  signInWithEmail,
  signInWithGoogle,
  signInWithApple,
  logOut,
  type User,
} from '@/lib/firebase';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthActions {
  signUp: (email: string, password: string) => Promise<{ success: boolean; error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error: string | null }>;
  signInGoogle: () => Promise<{ success: boolean; error: string | null }>;
  signInApple: () => Promise<{ success: boolean; error: string | null }>;
  logout: () => Promise<{ success: boolean; error: string | null }>;
}

export function useAuth(): AuthState & AuthActions {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChange((currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    const { error } = await signUpWithEmail(email, password);
    if (error) {
      return { success: false, error };
    }
    return { success: true, error: null };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await signInWithEmail(email, password);
    if (error) {
      return { success: false, error };
    }
    return { success: true, error: null };
  }, []);

  const signInGoogle = useCallback(async () => {
    const { error } = await signInWithGoogle();
    if (error) {
      return { success: false, error };
    }
    return { success: true, error: null };
  }, []);

  const signInApple = useCallback(async () => {
    const { error } = await signInWithApple();
    if (error) {
      return { success: false, error };
    }
    return { success: true, error: null };
  }, []);

  const logout = useCallback(async () => {
    const { error } = await logOut();
    if (error) {
      return { success: false, error };
    }
    return { success: true, error: null };
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    signUp,
    signIn,
    signInGoogle,
    signInApple,
    logout,
  };
}
