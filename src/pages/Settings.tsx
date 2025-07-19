
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

export const Settings: React.FC = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    company: 'Mon Entreprise',
    phone: '+33 1 23 45 67 89',
    bio: 'Utilisateur de DocProcess AI pour automatiser le traitement de documents.'
  });

  const [privacy, setPrivacy] = useState({
    profileVisible: false,
    dataSharing: false,
    analyticsTracking: true
  });

  const handleSaveProfile = () => {
    toast({
      title: "Profil mis à jour",
      description: "Vos informations personnelles ont été sauvegardées",
    });
  };

  const handleExportData = () => {
    toast({
      title: "Export démarré",
      description: "Vos données sont en cours d'export. Vous recevrez un email avec le lien de téléchargement.",
    });
  };

  const handleDeleteAccount = () => {
    toast({
      title: "Suppression de compte",
      description: "Un email de confirmation a été envoyé",
      variant: "destructive",
    });
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
              <Button variant="outline">
                <Key className="mr-2 h-4 w-4" />
                Changer le mot de passe
              </Button>
            </div>

            <Separator />

            <div className="space-y-4">
              <h4 className="font-medium">Confidentialité</h4>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Profil visible</p>
                  <p className="text-sm text-gray-600">Rendre votre profil visible aux autres utilisateurs</p>
                </div>
                <Switch
                  checked={privacy.profileVisible}
                  onCheckedChange={(checked) => 
                    setPrivacy({ ...privacy, profileVisible: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Partage de données</p>
                  <p className="text-sm text-gray-600">Autoriser le partage de données anonymisées</p>
                </div>
                <Switch
                  checked={privacy.dataSharing}
                  onCheckedChange={(checked) => 
                    setPrivacy({ ...privacy, dataSharing: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Suivi analytique</p>
                  <p className="text-sm text-gray-600">Permettre le suivi pour améliorer l'expérience</p>
                </div>
                <Switch
                  checked={privacy.analyticsTracking}
                  onCheckedChange={(checked) => 
                    setPrivacy({ ...privacy, analyticsTracking: checked })
                  }
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Download className="h-5 w-5" />
            <span>Gestion des données</span>
          </CardTitle>
          <CardDescription>
            Exportez ou supprimez vos données
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="font-medium mb-2">Exporter mes données</p>
            <p className="text-sm text-gray-600 mb-4">
              Téléchargez une copie de toutes vos données
            </p>
            <Button variant="outline" onClick={handleExportData}>
              <Download className="mr-2 h-4 w-4" />
              Exporter les données
            </Button>
          </div>

          <Separator />

          <div>
            <p className="font-medium mb-2 text-red-600">Zone dangereuse</p>
            <p className="text-sm text-gray-600 mb-4">
              Supprimez définitivement votre compte et toutes vos données
            </p>
            <Button variant="destructive" onClick={handleDeleteAccount}>
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer mon compte
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
