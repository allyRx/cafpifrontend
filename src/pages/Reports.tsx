
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Calendar } from '../components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { Progress } from '../components/ui/progress';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  Download, 
  FileText, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Calendar as CalendarIcon,
  Filter,
  Crown
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export const Reports: React.FC = () => {
  const [dateRange, setDateRange] = useState('30d');
  const [selectedDate, setSelectedDate] = useState<Date>();

  // Données fictives pour les graphiques
  const processingData = [
    { name: 'Lun', completed: 12, failed: 1 },
    { name: 'Mar', completed: 15, failed: 2 },
    { name: 'Mer', completed: 8, failed: 0 },
    { name: 'Jeu', completed: 20, failed: 1 },
    { name: 'Ven', completed: 18, failed: 3 },
    { name: 'Sam', completed: 5, failed: 0 },
    { name: 'Dim', completed: 7, failed: 1 }
  ];

  const performanceData = [
    { month: 'Jan', documents: 65, avgTime: 2.3 },
    { month: 'Fév', documents: 89, avgTime: 2.1 },
    { month: 'Mar', documents: 123, avgTime: 1.8 },
    { month: 'Avr', documents: 145, avgTime: 1.6 },
    { month: 'Mai', documents: 168, avgTime: 1.4 },
    { month: 'Juin', documents: 187, avgTime: 1.3 }
  ];

  const documentTypes = [
    { name: 'Factures', value: 35, color: '#3B82F6' },
    { name: 'Contrats', value: 25, color: '#10B981' },
    { name: 'Rapports', value: 20, color: '#F59E0B' },
    { name: 'Autres', value: 20, color: '#EF4444' }
  ];

  const stats = {
    totalDocuments: 187,
    avgProcessingTime: 1.3,
    successRate: 96.8,
    savedTime: 45.2
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-2">
            <Crown className="h-8 w-8 text-yellow-500" />
            <span>Rapports Premium</span>
          </h1>
          <p className="text-gray-600">
            Analyses détaillées et statistiques avancées de vos traitements
          </p>
        </div>
        <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
          Fonctionnalité Premium
        </Badge>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filtres</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Période" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">7 derniers jours</SelectItem>
                <SelectItem value="30d">30 derniers jours</SelectItem>
                <SelectItem value="90d">3 derniers mois</SelectItem>
                <SelectItem value="1y">Dernière année</SelectItem>
                <SelectItem value="custom">Période personnalisée</SelectItem>
              </SelectContent>
            </Select>

            {dateRange === 'custom' && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, 'PPP', { locale: fr }) : 'Sélectionner une date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            )}

            <Button>
              <Download className="mr-2 h-4 w-4" />
              Exporter PDF
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">Documents traités</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{stats.totalDocuments}</div>
            <p className="text-xs text-blue-600">+12% vs mois dernier</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">Temps moyen</CardTitle>
            <Clock className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{stats.avgProcessingTime}min</div>
            <p className="text-xs text-green-600">-23% vs mois dernier</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-800">Taux de réussite</CardTitle>
            <CheckCircle className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">{stats.successRate}%</div>
            <Progress value={stats.successRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-800">Temps économisé</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">{stats.savedTime}h</div>
            <p className="text-xs text-orange-600">Ce mois-ci</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Processing Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Traitements par jour</CardTitle>
            <CardDescription>
              Évolution des traitements réussis et échoués
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={processingData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="completed" fill="#10B981" name="Réussis" />
                <Bar dataKey="failed" fill="#EF4444" name="Échoués" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Document Types Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Répartition par type</CardTitle>
            <CardDescription>
              Types de documents traités
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={documentTypes}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {documentTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Performance Evolution */}
      <Card>
        <CardHeader>
          <CardTitle>Évolution des performances</CardTitle>
          <CardDescription>
            Nombre de documents traités et temps moyen par mois
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Bar yAxisId="left" dataKey="documents" fill="#3B82F6" name="Documents" />
              <Line 
                yAxisId="right" 
                type="monotone" 
                dataKey="avgTime" 
                stroke="#F59E0B" 
                strokeWidth={3}
                name="Temps moyen (min)"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Detailed Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Rapports détaillés</CardTitle>
          <CardDescription>
            Téléchargez des rapports complets pour vos analyses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Rapport mensuel</h3>
              <p className="text-sm text-gray-600 mb-4">
                Analyse complète des performances du mois
              </p>
              <Button variant="outline" className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Télécharger
              </Button>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Analyse des erreurs</h3>
              <p className="text-sm text-gray-600 mb-4">
                Détail des échecs de traitement
              </p>
              <Button variant="outline" className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Télécharger
              </Button>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">ROI et économies</h3>
              <p className="text-sm text-gray-600 mb-4">
                Calcul du retour sur investissement
              </p>
              <Button variant="outline" className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Télécharger
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
