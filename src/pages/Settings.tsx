
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Switch } from '../components/ui/switch';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { 
  User, 
  Shield, 
  Download, 
  Trash2,
  Key,
  Globe,
  Save,
  Camera
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/use-toast';
import { exportUserData, deleteUserAccount, changePassword, updateUserProfile, getUserProfile } from '../services/userService';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '../components/ui/dialog';

export const Settings: React.FC = () => {
  const { user, logout, setUser } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    company: 'Mon Entreprise',
    phone: '+33 1 23 45 67 89',
    bio: 'Utilisateur de cafpi pour automatiser le traitement de documents.'
  });

  const { data: profileData, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['userProfile'],
    queryFn: getUserProfile,
    onSuccess: (data) => {
      setProfile(data);
    }
  });

  const updateProfileMutation = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: (data) => {
      toast({
        title: "Profil mis à jour",
        description: "Vos informations personnelles ont été sauvegardées",
      });
      setUser(data);
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
    onError: (error) => {
      toast({
        title: "Erreur de mise à jour",
        description: (error as Error).message,
        variant: "destructive",
      });
    },
  });

  const handleSaveProfile = () => {
    updateProfileMutation.mutate(profile);
  };

  const exportDataMutation = useMutation({
    mutationFn: exportUserData,
    onSuccess: () => {
      toast({
        title: "Export démarré",
        description: "Vos données sont en cours d'export. Vous recevrez un email avec le lien de téléchargement.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur d'export",
        description: (error as Error).message,
        variant: "destructive",
      });
    },
  });

  const deleteAccountMutation = useMutation({
    mutationFn: deleteUserAccount,
    onSuccess: () => {
      toast({
        title: "Compte supprimé",
        description: "Votre compte a été supprimé avec succès.",
      });
      logout();
    },
    onError: (error) => {
      toast({
        title: "Erreur de suppression",
        description: (error as Error).message,
        variant: "destructive",
      });
    },
  });

  const handleExportData = () => {
    exportDataMutation.mutate();
  };

  const handleDeleteAccount = () => {
    deleteAccountMutation.mutate();
  };

  const passwordFormSchema = z.object({
    currentPassword: z.string().min(1, "Mot de passe actuel requis"),
    newPassword: z.string().min(8, "Le nouveau mot de passe doit contenir au moins 8 caractères"),
    confirmPassword: z.string()
  }).refine(data => data.newPassword === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

  type PasswordFormValues = z.infer<typeof passwordFormSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
  });

  const changePasswordMutation = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      toast({
        title: "Mot de passe changé",
        description: "Votre mot de passe a été changé avec succès.",
      });
      reset();
    },
    onError: (error) => {
      toast({
        title: "Erreur de changement de mot de passe",
        description: (error as Error).message,
        variant: "destructive",
      });
    },
  });

  const onSubmitPasswordChange = (data: PasswordFormValues) => {
    changePasswordMutation.mutate(data);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
        <p className="text-gray-600">
          Gérez vos préférences et paramètres de compte
        </p>
      </div>

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Informations personnelles</span>
          </CardTitle>
          <CardDescription>
            Gérez vos informations de profil et vos préférences d'affichage
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-8 w-8 text-primary" />
              </div>
              <Button size="icon" variant="outline" className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full">
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            <div>
              <h3 className="font-medium">{profile.name}</h3>
              <p className="text-sm text-gray-600">{profile.email}</p>
              <Badge variant="outline" className="mt-1">
                Plan {user?.subscription.plan || 'Gratuit'}
              </Badge>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom complet</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Entreprise</Label>
              <Input
                id="company"
                value={profile.company}
                onChange={(e) => setProfile({ ...profile, company: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Biographie</Label>
            <Textarea
              id="bio"
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              rows={3}
            />
          </div>

          <Button onClick={handleSaveProfile}>
            <Save className="mr-2 h-4 w-4" />
            Sauvegarder les modifications
          </Button>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Sécurité</span>
          </CardTitle>
          <CardDescription>
            Gérez vos paramètres de sécurité et de confidentialité
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <p className="font-medium mb-2">Mot de passe</p>
              <Dialog onOpenChange={() => reset()}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Key className="mr-2 h-4 w-4" />
                    Changer le mot de passe
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <form onSubmit={handleSubmit(onSubmitPasswordChange)}>
                    <DialogHeader>
                      <DialogTitle>Changer le mot de passe</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="current-password">Mot de passe actuel</Label>
                        <Input id="current-password" type="password" {...register("currentPassword")} />
                        {errors.currentPassword && <p className="text-red-500 text-sm">{errors.currentPassword.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-password">Nouveau mot de passe</Label>
                        <Input id="new-password" type="password" {...register("newPassword")} />
                        {errors.newPassword && <p className="text-red-500 text-sm">{errors.newPassword.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                        <Input id="confirm-password" type="password" {...register("confirmPassword")} />
                        {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit" disabled={changePasswordMutation.isPending}>
                        {changePasswordMutation.isPending ? "Sauvegarde en cours..." : "Sauvegarder"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

          </div>
        </CardContent>
      </Card>

    </div>
  );
};
