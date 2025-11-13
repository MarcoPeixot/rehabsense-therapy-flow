import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Activity, Brain, Users, LineChart, Shield, Zap } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Activity className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">RehabSense</span>
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => navigate('/login')}>
              Entrar
            </Button>
            <Button onClick={() => navigate('/signup')}>
              Começar Agora
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-6 text-5xl font-bold leading-tight text-foreground md:text-6xl">
            Terapia Ocupacional
            <span className="block text-primary">Inteligente e Eficiente</span>
          </h1>
          <p className="mb-8 text-xl text-muted-foreground">
            Plataforma completa para gestão de pacientes, exercícios personalizados com IA e
            acompanhamento detalhado de sessões terapêuticas.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" onClick={() => navigate('/signup')} className="text-lg">
              Criar Conta Grátis
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/login')}>
              Fazer Login
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-4xl font-bold text-foreground">
            Tudo que você precisa em um só lugar
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-card-foreground">
                Gestão de Pacientes
              </h3>
              <p className="text-muted-foreground">
                Cadastre e acompanhe todos os seus pacientes com histórico completo e
                informações organizadas.
              </p>
            </div>

            <div className="rounded-lg border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10">
                <Brain className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-card-foreground">
                Exercícios com IA
              </h3>
              <p className="text-muted-foreground">
                Gere exercícios personalizados automaticamente usando inteligência artificial
                baseada nas necessidades de cada paciente.
              </p>
            </div>

            <div className="rounded-lg border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <LineChart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-card-foreground">
                Acompanhamento Detalhado
              </h3>
              <p className="text-muted-foreground">
                Monitore o progresso com gráficos, relatórios e leituras de sensores em tempo
                real durante as sessões.
              </p>
            </div>

            <div className="rounded-lg border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10">
                <Activity className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-card-foreground">
                Sessões Organizadas
              </h3>
              <p className="text-muted-foreground">
                Agende, inicie e complete sessões com facilidade. Registre notas e observações
                importantes.
              </p>
            </div>

            <div className="rounded-lg border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-card-foreground">
                Segurança e Privacidade
              </h3>
              <p className="text-muted-foreground">
                Seus dados e dos seus pacientes protegidos com criptografia e autenticação
                segura.
              </p>
            </div>

            <div className="rounded-lg border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10">
                <Zap className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-card-foreground">
                Rápido e Intuitivo
              </h3>
              <p className="text-muted-foreground">
                Interface moderna e fácil de usar. Menos tempo com papelada, mais tempo com
                seus pacientes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl rounded-2xl bg-gradient-to-r from-primary to-secondary p-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-white">
              Pronto para transformar sua prática?
            </h2>
            <p className="mb-8 text-lg text-white/90">
              Junte-se a centenas de terapeutas que já usam a RehabSense para oferecer o
              melhor cuidado aos seus pacientes.
            </p>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => navigate('/signup')}
              className="bg-white text-primary hover:bg-white/90"
            >
              Começar Gratuitamente
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2024 RehabSense. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
