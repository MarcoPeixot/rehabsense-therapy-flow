import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ApiClient } from '@/lib/api';
import { Users, Dumbbell, Calendar, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalPacientes: 0,
    totalExercises: 0,
    totalSessions: 0,
    recentSessions: [] as any[],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [pacientes, exercises, sessions] = await Promise.all([
        ApiClient.getPacientes(),
        ApiClient.getExercises(),
        ApiClient.getSessions(),
      ]);

      setStats({
        totalPacientes: pacientes.length,
        totalExercises: exercises.length,
        totalSessions: sessions.length,
        recentSessions: sessions.slice(0, 5),
      });
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      title: 'Total de Pacientes',
      value: stats.totalPacientes,
      icon: Users,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Exercícios Criados',
      value: stats.totalExercises,
      icon: Dumbbell,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
    },
    {
      title: 'Sessões Realizadas',
      value: stats.totalSessions,
      icon: Calendar,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Taxa de Conclusão',
      value: stats.totalSessions > 0 ? '95%' : '0%',
      icon: TrendingUp,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-64 items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Visão geral da sua prática</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {statsCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div className={`rounded-lg ${stat.bgColor} p-2`}>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button onClick={() => navigate('/patients')}>
              <Users className="mr-2 h-4 w-4" />
              Novo Paciente
            </Button>
            <Button variant="outline" onClick={() => navigate('/exercises')}>
              <Dumbbell className="mr-2 h-4 w-4" />
              Criar Exercício
            </Button>
            <Button variant="outline" onClick={() => navigate('/sessions')}>
              <Calendar className="mr-2 h-4 w-4" />
              Agendar Sessão
            </Button>
          </CardContent>
        </Card>

        {/* Recent Sessions */}
        <Card>
          <CardHeader>
            <CardTitle>Sessões Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.recentSessions.length > 0 ? (
              <div className="space-y-4">
                {stats.recentSessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between rounded-lg border border-border p-4"
                  >
                    <div>
                      <p className="font-medium text-foreground">Sessão #{session.id}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(session.scheduledDate).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        session.status === 'completed'
                          ? 'bg-success/10 text-success'
                          : session.status === 'in_progress'
                          ? 'bg-secondary/10 text-secondary'
                          : session.status === 'cancelled'
                          ? 'bg-destructive/10 text-destructive'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {session.status === 'completed'
                        ? 'Concluída'
                        : session.status === 'in_progress'
                        ? 'Em Progresso'
                        : session.status === 'cancelled'
                        ? 'Cancelada'
                        : 'Agendada'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground">
                Nenhuma sessão encontrada
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
