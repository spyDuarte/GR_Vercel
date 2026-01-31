import { useState, useEffect, useCallback } from 'react';
import {
  signUpWithEmail,
  signInWithEmail,
  signInWithGoogle,
  signInWithApple,
  logOut,
  getCurrentUser,
  onAuthChange,
  type AuthResult,
} from '@/lib/auth';
import type { User } from '@/types';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthActions {
  signUp: (email: string, password: string) => Promise<AuthResult>;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signInGoogle: () => Promise<AuthResult>;
  signInApple: () => Promise<AuthResult>;
  logout: () => Promise<{ success: boolean; error?: string }>;
}

export function useAuth(): AuthState & AuthActions {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setIsLoading(false);

    // Listen for auth changes
    const unsubscribe = onAuthChange((newUser) => {
      setUser(newUser);
    });

    return () => unsubscribe();
  }, []);

  const signUp = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    setIsLoading(true);
    const result = await signUpWithEmail(email, password);
    setIsLoading(false);
    return result;
  }, []);

  const signIn = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    setIsLoading(true);
    const result = await signInWithEmail(email, password);
    setIsLoading(false);
    return result;
  }, []);

  const signInGoogle = useCallback(async (): Promise<AuthResult> => {
    setIsLoading(true);
    const result = await signInWithGoogle();
    setIsLoading(false);
    return result;
  }, []);

  const signInApple = useCallback(async (): Promise<AuthResult> => {
    setIsLoading(true);
    const result = await signInWithApple();
    setIsLoading(false);
    return result;
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    const result = await logOut();
    setUser(null);
    setIsLoading(false);
    return result;
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
