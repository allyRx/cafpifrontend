import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import {
  Upload as UploadIcon,
  FileText,
  Image,
  X,
  Folder as FolderIconLucide
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { UploadedFile, Folder as FolderType } from '../types';
import { getFolders } from '../services/folderService';
import { uploadFile, submitForAnalysis } from '../services/uploadService';
import { useAuth } from '../context/AuthContext';

export const Upload: React.FC = () => {
  const [selectedFolder, setSelectedFolder] = useState<string>('');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [folders, setFolders] = useState<FolderType[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const loadFolders = async () => {
      try {
        const fetchedFolders = await getFolders();
        setFolders(fetchedFolders);
      } catch (error) {
        toast({
          title: "Erreur de chargement des dossiers",
          description: (error as Error).message || "Impossible de charger les dossiers.",
          variant: "destructive",
        });
      }
    };
    loadFolders();
  }, [toast]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handleFiles = (rawFiles: File[]) => {
    if (!selectedFolder) {
      toast({
        title: "Dossier requis",
        description: "Veuillez sélectionner un dossier de destination",
        variant: "destructive",
      });
      return;
    }

    const filteredFiles = rawFiles.filter(file =>
      !uploadedFiles.some(f => f.name === file.name && f.size === file.size)
    );

    if (filteredFiles.length === 0) {
      toast({
        title: "Aucun nouveau fichier",
        description: "Tous les fichiers sont déjà ajoutés.",
        variant: "default",
      });
      return;
    }

    const newFileEntries: UploadedFile[] = filteredFiles.map(file => ({
      id: `temp-${Date.now().toString()}-${Math.random()}`,
      name: file.name,
      type: file.type,
      size: file.size,
      status: 'uploaded',
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
    }));

    setUploadedFiles(prev => [...prev, ...newFileEntries]);

    newFileEntries.forEach(async (fileEntry) => {
      const originalFile = filteredFiles.find(f => f.name === fileEntry.name && f.size === fileEntry.size);
      if (!originalFile) return;

      try {
        const backendFile = await uploadFile(originalFile, selectedFolder);
        setUploadedFiles(prev =>
          prev.map(f => (f.id === fileEntry.id ? { ...backendFile, preview: f.preview } : f))
        );

        const reader = new FileReader();
        reader.readAsDataURL(originalFile);
        reader.onloadend = async () => {
          const base64String = reader.result?.toString().split(',')[1];
          if (base64String) {
            toast({
              title: "Lancement de l'analyse",
              description: `Le traitement de ${originalFile.name} a commencé.`,
            });
            try {
              await submitForAnalysis({
                dossier_number: selectedFolder,
                borrower_name: user?.name || 'Utilisateur inconnu',
                document_base64: base64String,
                filename: originalFile.name,
                comments: `Fichier envoyé au dossier ${selectedFolder}`,
              });
              toast({
                title: "Analyse soumise",
                description: `Le fichier ${originalFile.name} a été soumis.`,
              });
            } catch (analysisError) {
              toast({
                title: `Erreur d'analyse: ${originalFile.name}`,
                description: (analysisError as Error).message,
                variant: "destructive",
              });
            }
          }
        };
      } catch (error) {
        setUploadedFiles(prev =>
          prev.map(f => (f.id === fileEntry.id ? { ...f, status: 'error' } : f))
        );
        toast({
          title: `Erreur téléversement: ${fileEntry.name}`,
          description: (error as Error).message,
          variant: "destructive",
        });
      }
    });
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const getFileIcon = (type: string) => {
    return type.startsWith('image/')
      ? <Image className="h-5 w-5 text-green-500" />
      : <FileText className="h-5 w-5 text-blue-500" />;
  };

  const getStatusBadge = (status: string) => {
    const configs = {
      uploaded: { label: 'Téléversé', variant: 'outline' as const },
      processing: { label: 'Traitement', variant: 'secondary' as const },
      completed: { label: 'Terminé', variant: 'default' as const },
      error: { label: 'Erreur', variant: 'destructive' as const }
    };

    const config = configs[status as keyof typeof configs] || configs.uploaded;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Téléversement de documents</h1>
        <p className="text-gray-600">
          Téléversez vos PDF et images pour traitement automatique
        </p>
      </div>

      {/* Sélection du dossier */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FolderIconLucide className="h-5 w-5" />
            <span>Dossier de destination</span>
          </CardTitle>
          <CardDescription>
            Sélectionnez le dossier dans lequel organiser vos documents
          </CardDescription>
        </CardHeader>
        <CardContent>
         <Select value={selectedFolder} onValueChange={(value) => {
  console.log("Selected folder ID:", value); // Ajoutez ce log pour débogage
  setSelectedFolder(value);
}}>
  <SelectTrigger className="w-full">
    <SelectValue placeholder="Choisir un dossier..." />
  </SelectTrigger>
  <SelectContent>
    {folders.length === 0 ? (
      <SelectItem value="loading" disabled>
        Chargement des dossiers...
      </SelectItem>
    ) : (
      folders.map(folder => (
        <SelectItem 
          key={folder._id} 
          value={folder._id.toString()} // Force la conversion en string si nécessaire
        >
          {folder.name}
        </SelectItem>
      ))
    )}
  </SelectContent>
</Select>
        </CardContent>
      </Card>

      {/* Zone de dépôt */}
      <Card>
        <CardHeader>
          <CardTitle>Téléverser des fichiers</CardTitle>
          <CardDescription>
            Glissez-déposez vos fichiers ou cliquez pour parcourir
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
              isDragging
                ? 'border-primary bg-primary/5'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <UploadIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Glissez-déposez vos fichiers ici
            </h3>
            <p className="text-gray-600 mb-4">
              Formats supportés : PDF, PNG, JPG, JPEG
            </p>
            <input
              type="file"
              multiple
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={handleFileInput}
              className="hidden"
              id="file-upload"
            />
            <Button asChild>
              <label htmlFor="file-upload" className="cursor-pointer">
                Parcourir les fichiers
              </label>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Liste des fichiers */}
      {uploadedFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Fichiers téléversés ({uploadedFiles.length})</CardTitle>
            <CardDescription>
              Statut du traitement de vos documents
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {uploadedFiles.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    {file.preview ? (
                      <img
                        src={file.preview}
                        alt={file.name}
                        className="h-12 w-12 object-cover rounded"
                      />
                    ) : (
                      getFileIcon(file.type)
                    )}
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-gray-500">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    {file.status === 'processing' && (
                      <div className="flex items-center space-x-2">
                        <Progress value={65} className="w-20" />
                        <span className="text-sm text-gray-500">65%</span>
                      </div>
                    )}
                    {getStatusBadge(file.status)}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFile(file.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
