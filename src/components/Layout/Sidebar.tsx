
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Folder, 
  Upload, 
  FileText, 
  Settings,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../ui/badge';

interface SidebarProps {
  collapsed: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const { user } = useAuth();

  const menuItems = [
    { icon: Home, label: 'Tableau de bord', path: '/dashboard' },
    { icon: Folder, label: 'Mes dossiers', path: '/folders' },
    { icon: Upload, label: 'Téléversement', path: '/upload', requiresPremium: false },
    { icon: FileText, label: 'Résultats', path: '/results' },
    { icon: Settings, label: 'Paramètres', path: '/settings' },
  ];

  const isFeatureAvailable = (requiresPremium: boolean) => {
    if (!requiresPremium) return true;
    return user?.subscription.plan === 'premium' && user?.subscription.status === 'active';
  };

  return (
    <div className={cn(
      "bg-white border-r border-border h-[calc(100vh-4rem)] transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      <nav className="mt-8">
        <ul className="space-y-2 px-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const available = isFeatureAvailable(item.requiresPremium || false);
            
            return (
              <li key={item.path}>
                <NavLink
                  to={available ? item.path : '#'}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      isActive && available
                        ? "bg-primary text-primary-foreground"
                        : "text-gray-600 hover:bg-gray-100",
                      !available && "opacity-50 cursor-not-allowed"
                    )
                  }
                  onClick={(e) => !available && e.preventDefault()}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!collapsed && (
                    <>
                      <span className="ml-3 flex-1">{item.label}</span>
                      {item.requiresPremium && !available && (
                        <Badge variant="secondary" className="text-xs">Pro</Badge>
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};
