
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
  // console.log('API Base URL from AuthProvider:', import.meta.env.VITE_API_BASE_URL); // Commented out

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
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    if (email === 'demo@example.com' && password === 'demo123') {
      setUser(mockUser); // Use imported mockUser
      localStorage.setItem('authUser', JSON.stringify(mockUser));
      toast({
        title: "Connexion réussie (Mock)",
        description: "Bienvenue dans votre espace de traitement documentaire!",
      });
      setIsLoading(false);
      return true;
    } else {
      toast({
        title: "Erreur de connexion (Mock)",
        description: "Email ou mot de passe incorrect.",
        variant: "destructive",
      });
      setIsLoading(false);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // In a real scenario, you might want to check if email is already used, etc.
    // For mock, we just simulate success.
    console.log("Mock registration attempt:", { name, email, password }); // Log input

    toast({
      title: "Compte créé avec succès! (Mock)",
      description: "Vous pouvez maintenant vous connecter avec les identifiants de démo.",
    });
    setIsLoading(false);
    return { success: true, message: "Mock registration successful. Please use demo credentials to log in." };
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
