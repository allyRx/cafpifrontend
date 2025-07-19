
import React, { useState, useEffect } from 'react'; // Added useEffect
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
// Folder type will be imported by folderService if defined in ../types
// If not, we might need to import it here or define a local one.
// import { Folder as FolderType } from '../types'; // Assuming this path is correct
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Plus, Folder as FolderIcon, FileText, Calendar, MoreVertical } from 'lucide-react'; // Renamed Folder to FolderIcon to avoid conflict
// import { mockFolders } from '../data/mockData'; // Removed mock data import
import { getFolders, createFolder } from '../services/folderService'; // Import service functions
import { Folder as FolderType } from '../types'; // Assuming Folder type is available from here for setFolders
import { useToast } from '../hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';

export const Folders: React.FC = () => {
  const [folders, setFolders] = useState<FolderType[]>([]); // Initialize with empty array and type
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newFolder, setNewFolder] = useState({ name: '', description: '' });
  const { toast } = useToast();

  useEffect(() => {
    const loadFolders = async () => {
      try {
        const fetchedFolders = await getFolders();
        setFolders(fetchedFolders);
      } catch (error) {
        toast({
          title: "Erreur de chargement",
          description: (error as Error).message || "Impossible de charger les dossiers.",
          variant: "destructive",
        });
      }
    };
    loadFolders();
  }, [toast]); // Added toast to dependency array

  const handleCreateFolder = async () => { // Make it async
    if (!newFolder.name.trim()) {
      toast({
        title: "Erreur",
        description: "Le nom du dossier est requis",
        variant: "destructive",
      });
      return;
    }

    try {
      // Assuming backend returns the full folder object including id, createdAt etc.
      const created = await createFolder({ name: newFolder.name, description: newFolder.description });
      setFolders(prevFolders => [created, ...prevFolders]); // Add to the start of the list
      setNewFolder({ name: '', description: '' });
      setIsCreateDialogOpen(false);

      toast({
        title: "Dossier créé",
        description: `Le dossier "${created.name}" a été créé avec succès`,
      });
    } catch (error) {
      toast({
        title: "Erreur de création",
        description: (error as Error).message || "Impossible de créer le dossier.",
        variant: "destructive",
      });
    }
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

      {folders.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Liste des dossiers</CardTitle>
            <CardDescription>
              {folders.length} dossier{folders.length > 1 ? 's' : ''} au total
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Fichiers</TableHead>
                  
                  <TableHead>Date de création</TableHead>
                  <TableHead className="w-[70px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {folders.map((folder) => (
                  <TableRow key={folder.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <FolderIcon className="h-4 w-4 text-blue-500" />
                        <span className="font-medium">{folder.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-muted-foreground max-w-xs truncate">
                        {folder.description || 'Aucune description'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <FileText className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">{folder.fileCount}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {new Date(folder.createdAt).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
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
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <Card className="p-12 text-center">
          <FolderIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
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
