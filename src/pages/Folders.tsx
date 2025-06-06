
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Plus, Folder, FileText, Calendar, MoreVertical } from 'lucide-react';
import { mockFolders } from '../data/mockData';
import { useToast } from '../hooks/use-toast';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';

export const Folders: React.FC = () => {
  const [folders, setFolders] = useState(mockFolders);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newFolder, setNewFolder] = useState({ name: '', description: '' });
  const { toast } = useToast();

  const handleCreateFolder = () => {
    if (!newFolder.name.trim()) {
      toast({
        title: "Erreur",
        description: "Le nom du dossier est requis",
        variant: "destructive",
      });
      return;
    }

    const folder = {
      id: Date.now().toString(),
      name: newFolder.name,
      description: newFolder.description,
      createdAt: new Date().toISOString(),
      fileCount: 0,
      status: 'active' as const
    };

    setFolders([folder, ...folders]);
    setNewFolder({ name: '', description: '' });
    setIsCreateDialogOpen(false);
    
    toast({
      title: "Dossier créé",
      description: `Le dossier "${folder.name}" a été créé avec succès`,
    });
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'outline',
      processing: 'secondary',
      completed: 'default'
    } as const;
    
    const labels = {
      active: 'Actif',
      processing: 'En cours',
      completed: 'Terminé'
    };

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mes dossiers</h1>
          <p className="text-gray-600">
            Organisez vos documents par projet ou catégorie
          </p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nouveau dossier
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer un nouveau dossier</DialogTitle>
              <DialogDescription>
                Organisez vos documents en créant un nouveau dossier de projet
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="folder-name">Nom du dossier</Label>
                <Input
                  id="folder-name"
                  value={newFolder.name}
                  onChange={(e) => setNewFolder({ ...newFolder, name: e.target.value })}
                  placeholder="Ex: Contrats Q1 2024"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="folder-description">Description (optionnel)</Label>
                <Textarea
                  id="folder-description"
                  value={newFolder.description}
                  onChange={(e) => setNewFolder({ ...newFolder, description: e.target.value })}
                  placeholder="Décrivez le contenu et l'objectif de ce dossier..."
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleCreateFolder}>
                Créer le dossier
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {folders.map((folder) => (
          <Card key={folder.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <Folder className="h-5 w-5 text-blue-500" />
                  <CardTitle className="text-lg">{folder.name}</CardTitle>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Ouvrir</DropdownMenuItem>
                    <DropdownMenuItem>Modifier</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">Supprimer</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <CardDescription className="line-clamp-2">
                {folder.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <FileText className="h-4 w-4" />
                    <span>{folder.fileCount} fichiers</span>
                  </div>
                  {getStatusBadge(folder.status)}
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Créé le {new Date(folder.createdAt).toLocaleDateString('fr-FR')}
                  </span>
                </div>
                <Button variant="outline" className="w-full">
                  Ouvrir le dossier
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {folders.length === 0 && (
        <Card className="p-12 text-center">
          <Folder className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aucun dossier pour le moment
          </h3>
          <p className="text-gray-600 mb-4">
            Créez votre premier dossier pour organiser vos documents
          </p>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Créer un dossier
          </Button>
        </Card>
      )}
    </div>
  );
};
