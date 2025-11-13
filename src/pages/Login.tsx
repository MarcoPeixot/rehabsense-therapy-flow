import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Activity } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signIn(formData.email, formData.password);
      toast({
        title: 'Login realizado!',
        description: 'Bem-vindo de volta à RehabSense.',
      });
      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: 'Erro no login',
        description: error.message || 'Verifique suas credenciais e tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side - Form */}
      <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-12">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8">
            <Link to="/" className="flex items-center gap-2">
              <Activity className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-foreground">RehabSense</span>
            </Link>
          </div>

          <h1 className="mb-2 text-3xl font-bold text-foreground">Bem-vindo de volta</h1>
          <p className="mb-8 text-muted-foreground">
            Entre com suas credenciais para acessar sua conta
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Não tem uma conta?{' '}
            <Link to="/signup" className="font-medium text-primary hover:underline">
              Cadastre-se gratuitamente
            </Link>
          </p>
        </div>
      </div>

      {/* Right side - Image/Gradient */}
      <div className="hidden lg:block lg:w-1/2">
        <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary via-primary to-secondary p-12">
          <div className="max-w-md text-white">
            <h2 className="mb-4 text-4xl font-bold">
              Transforme sua prática clínica
            </h2>
            <p className="text-lg text-white/90">
              Gerencie pacientes, crie exercícios personalizados com IA e acompanhe o
              progresso de forma simples e eficiente.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
