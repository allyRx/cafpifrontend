
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { useToast } from '../hooks/use-toast';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface AuthContextType {
  user: User | null;
  token: string | null;
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
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const savedUser = localStorage.getItem('authUser');
    const savedToken = localStorage.getItem('authToken');
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
      const { user, token } = response.data;
      setUser(user);
      setToken(token);
      localStorage.setItem('authUser', JSON.stringify(user));
      localStorage.setItem('authToken', token);
      toast({
        title: "Connexion réussie",
        description: "Bienvenue dans votre espace de traitement documentaire!",
      });
      setIsLoading(false);
      return true;
    } catch (error) {
      toast({
        title: "Erreur de connexion",
        description: "Email ou mot de passe incorrect.",
        variant: "destructive",
      });
      setIsLoading(false);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/auth/register`, { name, email, password });
      toast({
        title: "Compte créé avec succès!",
        description: "Vous pouvez maintenant vous connecter.",
      });
      setIsLoading(false);
      return { success: true };
    } catch (error: any) {
      toast({
        title: "Erreur d'inscription",
        description: error.response?.data?.errors?.[0]?.msg || "Une erreur est survenue.",
        variant: "destructive",
      });
      setIsLoading(false);
      return { success: false, message: error.response?.data?.errors?.[0]?.msg || "Une erreur est survenue." };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('authUser');
    localStorage.removeItem('authToken');
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
    token,
    login,
    logout,
    isLoading,
    updateSubscription,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
