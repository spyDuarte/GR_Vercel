import type { User } from '@/types';

const AUTH_KEY = 'wardrobe-auth-user';
const USER_ID_KEY = 'user-id';

// Demo users storage (in production, this would be in a database)
const users: Map<string, { email: string; password: string; name: string }> = new Map();

export interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
}

export async function signUpWithEmail(email: string, password: string): Promise<AuthResult> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  if (users.has(email)) {
    return { success: false, error: 'Email já cadastrado' };
  }

  if (password.length < 6) {
    return { success: false, error: 'Senha deve ter pelo menos 6 caracteres' };
  }

  const userName = email.split('@')[0] || 'Usuário';
  const user: User = {
    id: Date.now().toString(),
    email,
    name: userName,
  };

  users.set(email, { email, password, name: userName });
  
  // Store in localStorage for persistence
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  localStorage.setItem(USER_ID_KEY, user.id);

  return { success: true, user };
}

export async function signInWithEmail(email: string, password: string): Promise<AuthResult> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const userData = users.get(email);
  
  if (!userData || userData.password !== password) {
    return { success: false, error: 'Email ou senha incorretos' };
  }

  const user: User = {
    id: Date.now().toString(),
    email: userData.email,
    name: userData.name,
  };

  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  localStorage.setItem(USER_ID_KEY, user.id);

  return { success: true, user };
}

export async function signInWithGoogle(): Promise<AuthResult> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));

  // Demo Google user
  const user: User = {
    id: 'google-' + Date.now().toString(),
    email: 'usuario@gmail.com',
    name: 'Usuário Google',
    image: 'https://ui-avatars.com/api/?name=Google+User&background=4285F4&color=fff',
  };

  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  localStorage.setItem(USER_ID_KEY, user.id);

  return { success: true, user };
}

export async function signInWithApple(): Promise<AuthResult> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));

  // Demo Apple user
  const user: User = {
    id: 'apple-' + Date.now().toString(),
    email: 'usuario@icloud.com',
    name: 'Usuário Apple',
    image: 'https://ui-avatars.com/api/?name=Apple+User&background=000&color=fff',
  };

  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  localStorage.setItem(USER_ID_KEY, user.id);

  return { success: true, user };
}

export async function logOut(): Promise<{ success: boolean; error?: string }> {
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem(USER_ID_KEY);
  return { success: true };
}

export function getCurrentUser(): User | null {
  const stored = localStorage.getItem(AUTH_KEY);
  return stored ? JSON.parse(stored) : null;
}

export function isAuthenticated(): boolean {
  return !!getCurrentUser();
}

export function onAuthChange(callback: (user: User | null) => void): () => void {
  // Simple polling for auth changes
  const checkAuth = () => {
    callback(getCurrentUser());
  };

  // Check immediately
  checkAuth();

  // Set up storage event listener
  const handleStorage = (e: StorageEvent) => {
    if (e.key === AUTH_KEY) {
      checkAuth();
    }
  };

  window.addEventListener('storage', handleStorage);

  return () => {
    window.removeEventListener('storage', handleStorage);
  };
}
