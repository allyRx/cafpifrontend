
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LoginForm } from './Auth/LoginForm';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiresPremium?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiresPremium = false 
}) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  if (requiresPremium && user.subscription.plan !== 'premium') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Fonctionnalité Premium requise
          </h2>
          <p className="text-gray-600 mb-6">
            Cette fonctionnalité nécessite un abonnement Premium.
          </p>
          <a href="/subscription" className="text-primary hover:underline">
            Mettre à niveau mon abonnement →
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
