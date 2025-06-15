import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Assuming react-router-dom is used
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useAuth } from '../context/AuthContext'; // Uncommented and used
import { useToast } from '../hooks/use-toast';

export const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { register, isLoading } = useAuth(); // Get register function and isLoading state
  const { toast } = useToast(); // Keep for client-side validation toasts
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Please ensure your passwords match.",
        variant: "destructive",
      });
      return;
    }
    if (password.length < 6) {
        toast({
            title: "Password too short",
            description: "Password must be at least 6 characters long.",
            variant: "destructive",
        });
        return;
    }

    try {
      const result = await register(name, email, password);
      if (result.success) {
        // Toast for successful registration is handled by AuthContext's register function
        // We can add a specific navigation success toast here if desired, or just navigate.
        // For example:
        // toast({
        //   title: "Redirection...",
        //   description: "Vous allez être redirigé vers la page de connexion.",
        // });
        navigate('/'); // Navigate to login page on successful registration
      } else {
        // Error toast is handled by AuthContext's register function
        // No need to show another toast here unless it's a specific UI concern
        console.error("Registration failed on page:", result.message);
      }
    } catch (error) {
      // This catch block might be redundant if AuthContext's register handles all errors
      // and returns a structured response. However, it's good for unexpected issues.
      toast({
        title: "Erreur d'inscription",
        description: "Une erreur inattendue est survenue.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/5 via-background to-background">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold tracking-tight text-primary">
            Create your Account
          </CardTitle>
          <CardDescription>
            Join our platform to start managing your documents.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john.doe@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoading}>
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm">
            Already have an account?{' '}
            <Link to="/" className="font-medium text-primary hover:underline">
              Log In
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
