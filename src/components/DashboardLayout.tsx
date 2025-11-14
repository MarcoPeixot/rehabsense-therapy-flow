import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { AccessibilityButton } from '@/components/AccessibilityButton';
import {
  Activity,
  LayoutDashboard,
  Users,
  Dumbbell,
  Calendar,
  LogOut,
} from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
    navigate('/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Pacientes', href: '/patients', icon: Users },
    { name: 'Exercícios', href: '/exercises', icon: Dumbbell },
    { name: 'Sessões', href: '/sessions', icon: Calendar },
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Skip to main content link for accessibility */}
      <a href="#main-content" className="skip-to-content">
        Pular para o conteúdo principal
      </a>

      {/* Sidebar - Navigation menu for application */}
      <aside 
        className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-sidebar"
        role="navigation"
        aria-label="Menu principal de navegação"
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
            <Activity className="h-8 w-8 text-sidebar-foreground" aria-hidden="true" />
            <span className="text-xl font-bold text-sidebar-foreground">RehabSense</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4" aria-label="Menu de navegação">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sidebar-ring ${
                    active
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                      : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                  }`}
                  aria-current={active ? 'page' : undefined}
                  aria-label={`Navegar para ${item.name}`}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          <div className="border-t border-sidebar-border p-4" role="contentinfo" aria-label="Informações do usuário">
            <div className="mb-3 rounded-lg bg-sidebar-accent/50 p-3">
              <p className="text-sm font-medium text-sidebar-foreground">{user?.name}</p>
              <p className="text-xs text-sidebar-foreground/70">{user?.email}</p>
            </div>

            {/* Accessibility Controls */}
            <div className="mb-3 space-y-2">
              <AccessibilityButton />
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="w-full justify-start gap-2 text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-all focus:ring-2 focus:ring-sidebar-ring"
              aria-label="Sair da conta"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Sair
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="ml-64 flex-1">
        <main id="main-content" className="p-8" role="main" aria-label="Conteúdo principal" tabIndex={-1}>
          {children}
        </main>
      </div>
    </div>
  );
}
