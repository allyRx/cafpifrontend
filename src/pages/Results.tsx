
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { 
  Download, 
  FileText, 
  FileSpreadsheet, 
  Search,
  Calendar,
  Filter,
  Eye,
  Share
} from 'lucide-react';
import { mockResultFiles, mockProcessingJobs } from '../data/mockData';
import { useToast } from '../hooks/use-toast';

export const Results: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const { toast } = useToast();

  const filteredFiles = mockResultFiles.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || file.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleDownload = (file: any) => {
    toast({
      title: "Téléchargement démarré",
      description: `Le fichier "${file.name}" est en cours de téléchargement`,
    });
  };

  const handlePreview = (file: any) => {
    toast({
      title: "Aperçu",
      description: `Ouverture de l'aperçu pour "${file.name}"`,
    });
  };

  const getFileIcon = (type: string) => {
    return type === 'excel' 
      ? <FileSpreadsheet className="h-5 w-5 text-green-500" />
      : <FileText className="h-5 w-5 text-red-500" />;
  };

  const getTypeBadge = (type: string) => {
    return type === 'excel' 
      ? <Badge variant="outline" className="text-green-700 border-green-300">Excel</Badge>
      : <Badge variant="outline" className="text-red-700 border-red-300">PDF</Badge>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Résultats de traitement</h1>
        <p className="text-gray-600">
          Téléchargez et consultez vos documents traités
        </p>
      </div>

      {/* Processing Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Fichiers disponibles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{mockResultFiles.length}</div>
            <p className="text-xs text-muted-foreground">Prêts à télécharger</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">En traitement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {mockProcessingJobs.filter(j => j.status === 'processing').length}
            </div>
            <p className="text-xs text-muted-foreground">Traitement en cours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Taille totale</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">12.4 MB</div>
            <p className="text-xs text-muted-foreground">Tous fichiers confondus</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Filtres et recherche</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher un fichier..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Type de fichier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="excel">Excel uniquement</SelectItem>
                <SelectItem value="pdf">PDF uniquement</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48">
                <Calendar className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date de création</SelectItem>
                <SelectItem value="name">Nom du fichier</SelectItem>
                <SelectItem value="size">Taille</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFiles.map((file) => (
          <Card key={file.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  {getFileIcon(file.type)}
                  <CardTitle className="text-base truncate">{file.name}</CardTitle>
                </div>
                {getTypeBadge(file.type)}
              </div>
              <CardDescription>
                Créé le {new Date(file.createdAt).toLocaleDateString('fr-FR')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Taille :</span>
                  <span className="font-medium">{file.size}</span>
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleDownload(file)}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Télécharger
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handlePreview(file)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredFiles.length === 0 && (
        <Card className="p-12 text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aucun résultat trouvé
          </h3>
          <p className="text-gray-600">
            {searchTerm 
              ? "Aucun fichier ne correspond à votre recherche"
              : "Aucun fichier traité pour le moment"
            }
          </p>
        </Card>
      )}
    </div>
  );
};
