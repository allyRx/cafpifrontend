
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { 
  Check, 
  X, 
  Crown, 
  Zap, 
  Shield,
  CreditCard,
  Calendar,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { subscriptionPlans } from '../data/mockData';
import { useToast } from '../hooks/use-toast';

export const Subscription: React.FC = () => {
  const { user, updateSubscription } = useAuth();
  const { toast } = useToast();

  const handleSubscribe = (planId: string) => {
    // Simulation de l'intégration Stripe
    toast({
      title: "Redirection vers Stripe",
      description: "Vous allez être redirigé vers la page de paiement sécurisée",
    });
    
    // Simulation d'un succès après 2 secondes
    setTimeout(() => {
      updateSubscription(planId as 'free' | 'basic' | 'premium');
    }, 2000);
  };

  const handleManageSubscription = () => {
    toast({
      title: "Portail client Stripe",
      description: "Ouverture du portail de gestion d'abonnement",
    });
  };

  const getCurrentPlanUsage = () => {
    const limits = {
      free: { documents: 5, storage: 1 },
      basic: { documents: 100, storage: 10 },
      premium: { documents: -1, storage: 100 }
    };
    
    const plan = user?.subscription.plan || 'free';
    const limit = limits[plan];
    const usage = { documents: 12, storage: 3.2 };
    
    return { limit, usage };
  };

  const { limit, usage } = getCurrentPlanUsage();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Abonnement</h1>
        <p className="text-gray-600">
          Gérez votre abonnement et choisissez le plan qui vous convient
        </p>
      </div>

      {/* Current Subscription Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>Votre abonnement actuel</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm font-medium text-gray-600">Plan actuel</p>
              <div className="flex items-center space-x-2 mt-1">
                <p className="text-2xl font-bold capitalize">
                  {user?.subscription.plan || 'Gratuit'}
                </p>
                <Badge variant={user?.subscription.status === 'active' ? 'default' : 'destructive'}>
                  {user?.subscription.status === 'active' ? 'Actif' : 'Inactif'}
                </Badge>
              </div>
            </div>
            
            {user?.subscription.endDate && (
              <div>
                <p className="text-sm font-medium text-gray-600">Prochaine facturation</p>
                <div className="flex items-center space-x-2 mt-1">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <p className="text-lg font-medium">
                    {new Date(user.subscription.endDate).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={handleManageSubscription}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Gérer l'abonnement
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Utilisation ce mois-ci</CardTitle>
          <CardDescription>
            Votre consommation par rapport aux limites de votre plan
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Documents traités</span>
              <span className="text-sm text-gray-600">
                {usage.documents} / {limit.documents === -1 ? '∞' : limit.documents}
              </span>
            </div>
            <Progress 
              value={limit.documents === -1 ? 30 : (usage.documents / limit.documents) * 100} 
              className="h-2"
            />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Stockage utilisé</span>
              <span className="text-sm text-gray-600">
                {usage.storage} GB / {limit.storage === -1 ? '∞' : `${limit.storage} GB`}
              </span>
            </div>
            <Progress 
              value={limit.storage === -1 ? 20 : (usage.storage / limit.storage) * 100} 
              className="h-2"
            />
          </div>
        </CardContent>
      </Card>

      {/* Pricing Plans */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Plans disponibles</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {subscriptionPlans.map((plan) => {
            const isCurrentPlan = user?.subscription.plan === plan.id;
            const isPremium = plan.id === 'premium';
            
            return (
              <Card 
                key={plan.id} 
                className={`relative ${plan.popular ? 'ring-2 ring-primary' : ''} ${isCurrentPlan ? 'bg-primary/5' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">
                      <Crown className="mr-1 h-3 w-3" />
                      Populaire
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center">
                  <CardTitle className="flex items-center justify-center space-x-2">
                    {isPremium && <Zap className="h-5 w-5 text-yellow-500" />}
                    <span>{plan.name}</span>
                  </CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-gray-600">{plan.period}</span>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                    {plan.limitations.map((limitation, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <X className="h-4 w-4 text-red-500 flex-shrink-0" />
                        <span className="text-sm text-gray-500">{limitation}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="pt-4">
                    {isCurrentPlan ? (
                      <Button disabled className="w-full">
                        <Shield className="mr-2 h-4 w-4" />
                        Plan actuel
                      </Button>
                    ) : (
                      <Button 
                        className="w-full"
                        variant={plan.popular ? 'default' : 'outline'}
                        onClick={() => handleSubscribe(plan.id)}
                      >
                        {plan.id === 'free' ? 'Rétrograder' : 'Mettre à niveau'}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Billing Information */}
      <Card>
        <CardHeader>
          <CardTitle>Informations de facturation</CardTitle>
          <CardDescription>
            Gérez vos informations de paiement et consultez votre historique
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <CreditCard className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-medium">Carte de crédit</p>
                  <p className="text-sm text-gray-600">**** **** **** 4242</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Modifier
              </Button>
            </div>
            
            <Button variant="outline" className="w-full">
              Voir l'historique de facturation
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
