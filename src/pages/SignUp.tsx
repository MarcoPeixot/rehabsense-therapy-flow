import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Activity } from 'lucide-react';

export default function SignUp() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    registerId: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signUp(formData);
      toast({
        title: 'Conta criada com sucesso!',
        description: 'Bem-vindo à RehabSense.',
      });
      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: 'Erro no cadastro',
        description: error.message || 'Não foi possível criar sua conta. Tente novamente.',
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

          <h1 className="mb-2 text-3xl font-bold text-foreground">Crie sua conta</h1>
          <p className="mb-8 text-muted-foreground">
            Comece a gerenciar seus pacientes de forma profissional
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nome completo</Label>
              <Input
                id="name"
                type="text"
                placeholder="Dr. João Silva"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

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
              <Label htmlFor="registerId">Registro profissional</Label>
              <Input
                id="registerId"
                type="text"
                placeholder="CREFITO-123456"
                value={formData.registerId}
                onChange={(e) => setFormData({ ...formData, registerId: e.target.value })}
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
                minLength={6}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Criando conta...' : 'Criar conta'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Já tem uma conta?{' '}
            <Link to="/login" className="font-medium text-primary hover:underline">
              Faça login
            </Link>
          </p>
        </div>
      </div>

      {/* Right side - Image/Gradient */}
      <div className="hidden lg:block lg:w-1/2">
        <div className="flex h-full items-center justify-center bg-gradient-to-br from-secondary via-secondary to-primary p-12">
          <div className="max-w-md text-white">
            <h2 className="mb-4 text-4xl font-bold">
              Junte-se à RehabSense
            </h2>
            <p className="mb-6 text-lg text-white/90">
              Plataforma completa para terapeutas ocupacionais modernos
            </p>
            <ul className="space-y-3 text-white/90">
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-white"></div>
                Gestão completa de pacientes
              </li>
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-white"></div>
                Exercícios personalizados com IA
              </li>
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-white"></div>
                Acompanhamento em tempo real
              </li>
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-white"></div>
                Relatórios detalhados
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
