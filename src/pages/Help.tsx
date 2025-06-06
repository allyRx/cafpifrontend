
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion';
import { 
  HelpCircle, 
  MessageCircle, 
  Book, 
  Video, 
  Mail,
  Phone,
  Search,
  ExternalLink,
  Clock,
  CheckCircle
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';

export const Help: React.FC = () => {
  const { toast } = useToast();
  const [supportForm, setSupportForm] = useState({
    subject: '',
    category: '',
    message: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmitSupport = () => {
    if (!supportForm.subject || !supportForm.message) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Demande envoyée",
      description: "Votre demande de support a été envoyée. Nous vous répondrons sous 24h.",
    });

    setSupportForm({ subject: '', category: '', message: '' });
  };

  const faqItems = [
    {
      question: "Comment téléverser mes premiers documents ?",
      answer: "Rendez-vous sur la page 'Téléversement', sélectionnez un dossier de destination, puis glissez-déposez vos fichiers PDF ou images. Le traitement démarre automatiquement."
    },
    {
      question: "Quels formats de fichiers sont supportés ?",
      answer: "Nous supportons les fichiers PDF, PNG, JPG et JPEG. Les documents peuvent faire jusqu'à 50MB chacun selon votre plan d'abonnement."
    },
    {
      question: "Comment fonctionne le traitement automatique ?",
      answer: "Notre IA analyse vos documents, extrait les données importantes et génère des fichiers Excel structurés avec les informations trouvées."
    },
    {
      question: "Puis-je annuler mon abonnement à tout moment ?",
      answer: "Oui, vous pouvez annuler votre abonnement à tout moment depuis la page Abonnement. Vous conserverez l'accès jusqu'à la fin de votre période de facturation."
    },
    {
      question: "Mes données sont-elles sécurisées ?",
      answer: "Absolument. Toutes vos données sont chiffrées en transit et au repos. Nous respectons le RGPD et ne partageons jamais vos données avec des tiers."
    },
    {
      question: "Comment télécharger mes résultats ?",
      answer: "Une fois le traitement terminé, allez sur la page 'Résultats' et cliquez sur le bouton de téléchargement pour chaque fichier généré."
    }
  ];

  const tutorials = [
    {
      title: "Premiers pas avec DocProcess AI",
      description: "Guide complet pour débuter",
      duration: "5 min",
      type: "video"
    },
    {
      title: "Organiser ses documents en dossiers",
      description: "Créer et gérer vos dossiers",
      duration: "3 min",
      type: "article"
    },
    {
      title: "Interpréter les résultats de traitement",
      description: "Comprendre les fichiers générés",
      duration: "7 min",
      type: "video"
    },
    {
      title: "Optimiser ses documents pour l'IA",
      description: "Conseils pour de meilleurs résultats",
      duration: "4 min",
      type: "article"
    }
  ];

  const filteredFaq = faqItems.filter(item =>
    item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Aide & Support</h1>
        <p className="text-gray-600">
          Trouvez des réponses à vos questions ou contactez notre équipe
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="text-center">
            <Book className="h-8 w-8 text-blue-500 mx-auto" />
            <CardTitle className="text-lg">Documentation</CardTitle>
            <CardDescription>
              Guides détaillés et API
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              <ExternalLink className="mr-2 h-4 w-4" />
              Consulter
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="text-center">
            <Video className="h-8 w-8 text-green-500 mx-auto" />
            <CardTitle className="text-lg">Tutoriels vidéo</CardTitle>
            <CardDescription>
              Apprenez en regardant
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              <ExternalLink className="mr-2 h-4 w-4" />
              Voir les vidéos
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="text-center">
            <MessageCircle className="h-8 w-8 text-purple-500 mx-auto" />
            <CardTitle className="text-lg">Chat en direct</CardTitle>
            <CardDescription>
              Support instantané
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              <MessageCircle className="mr-2 h-4 w-4" />
              Démarrer le chat
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* FAQ Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <HelpCircle className="h-5 w-5" />
            <span>Questions fréquentes</span>
          </CardTitle>
          <CardDescription>
            Trouvez rapidement des réponses aux questions les plus courantes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher dans la FAQ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Accordion type="single" collapsible className="w-full">
            {filteredFaq.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {filteredFaq.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Aucune question trouvée pour "{searchTerm}"
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tutorials */}
      <Card>
        <CardHeader>
          <CardTitle>Tutoriels et guides</CardTitle>
          <CardDescription>
            Apprenez à utiliser DocProcess AI efficacement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tutorials.map((tutorial, index) => (
              <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium">{tutorial.title}</h3>
                  <Badge variant="outline">
                    {tutorial.type === 'video' ? <Video className="h-3 w-3 mr-1" /> : <Book className="h-3 w-3 mr-1" />}
                    {tutorial.type}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3">{tutorial.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    {tutorial.duration}
                  </div>
                  <Button size="sm" variant="outline">
                    Consulter
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Contact Support */}
      <Card>
        <CardHeader>
          <CardTitle>Contacter le support</CardTitle>
          <CardDescription>
            Notre équipe vous répond sous 24h
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="subject">Sujet *</Label>
                <Input
                  id="subject"
                  value={supportForm.subject}
                  onChange={(e) => setSupportForm({ ...supportForm, subject: e.target.value })}
                  placeholder="Décrivez brièvement votre problème"
                />
              </div>
              
              <div>
                <Label htmlFor="category">Catégorie</Label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={supportForm.category}
                  onChange={(e) => setSupportForm({ ...supportForm, category: e.target.value })}
                >
                  <option value="">Sélectionner une catégorie</option>
                  <option value="technical">Problème technique</option>
                  <option value="billing">Facturation</option>
                  <option value="feature">Demande de fonctionnalité</option>
                  <option value="other">Autre</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-medium text-green-800">Temps de réponse</p>
                  <p className="text-sm text-green-600">Moins de 24h</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">support@docprocess.ai</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">+33 1 23 45 67 89</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="message">Message *</Label>
            <Textarea
              id="message"
              value={supportForm.message}
              onChange={(e) => setSupportForm({ ...supportForm, message: e.target.value })}
              placeholder="Décrivez votre problème en détail..."
              rows={5}
            />
          </div>

          <Button onClick={handleSubmitSupport} className="w-full md:w-auto">
            <MessageCircle className="mr-2 h-4 w-4" />
            Envoyer la demande
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
