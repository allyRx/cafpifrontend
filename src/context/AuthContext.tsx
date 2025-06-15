
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { mockUser } from '../data/mockData';
import { useToast } from '../hooks/use-toast';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  updateSubscription: (plan: 'free' | 'basic' | 'premium') => void;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; message?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Log the API base URL to confirm it's accessible
  console.log('API Base URL from AuthProvider:', import.meta.env.VITE_API_BASE_URL);

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté au chargement
    const savedUser = localStorage.getItem('authUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const loginUrl = `${apiBaseUrl}/auth/login`;

    try {
      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Assuming data.user contains the user info and data.token exists if needed later
        // The backend currently sends: { success: true, message: '...', token: '...', user: { id, name, email, subscription }}
        // Or for skipped JWT: { success: true, message: '... (JWT skipped)', user: { id, name, email, subscription }}
        setUser(data.user);
        localStorage.setItem('authUser', JSON.stringify(data.user));
        // localStorage.setItem('authToken', data.token); // If token is to be stored
        toast({
          title: "Connexion réussie",
          description: data.message || "Bienvenue dans votre espace de traitement documentaire!",
        });
        setIsLoading(false);
        return true;
      } else {
        toast({
          title: "Erreur de connexion",
          description: data.error || data.errors?.[0]?.msg || "Email ou mot de passe incorrect",
          variant: "destructive",
        });
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      console.error('Login API call failed:', error);
      toast({
        title: "Erreur de connexion",
        description: "Impossible de se connecter au serveur. Veuillez réessayer plus tard.",
        variant: "destructive",
      });
      setIsLoading(false);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const registerUrl = `${apiBaseUrl}/auth/register`;

    try {
      const response = await fetch(registerUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }), // Assuming backend expects 'name'
      });

      const data = await response.json();

      if (response.ok && data.id) { // Backend register currently returns the user object on success
        toast({
          title: "Compte créé avec succès!",
          description: "Vous pouvez maintenant vous connecter.",
        });
        setIsLoading(false);
        return { success: true, message: "Registration successful. Please log in." };
      } else {
        // Handle errors from express-validator (data.errors) or other backend errors (data.error or data.msg)
        const errorMessage = data.error || data.errors?.[0]?.msg || data.message || "Impossible de créer le compte.";
        toast({
          title: "Erreur d'inscription",
          description: errorMessage,
          variant: "destructive",
        });
        setIsLoading(false);
        return { success: false, message: errorMessage };
      }
    } catch (error) {
      console.error('Register API call failed:', error);
      toast({
        title: "Erreur d'inscription",
        description: "Impossible de se connecter au serveur. Veuillez réessayer plus tard.",
        variant: "destructive",
      });
      setIsLoading(false);
      return { success: false, message: 'Network error or server unreachable' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authUser');
    toast({
      title: "Déconnexion",
      description: "Vous avez été déconnecté avec succès",
    });
  };

  const updateSubscription = (plan: 'free' | 'basic' | 'premium') => {
    if (user) {
      const updatedUser = {
        ...user,
        subscription: {
          ...user.subscription,
          plan,
          status: 'active' as const
        }
      };
      setUser(updatedUser);
      localStorage.setItem('authUser', JSON.stringify(updatedUser));
      toast({
        title: "Abonnement mis à jour",
        description: `Votre plan ${plan} est maintenant actif`,
      });
    }
  };

  const value = {
    user,
    login,
    logout,
    isLoading,
    updateSubscription,
    register, // Added register to context value
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
