import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ApiClient } from '@/lib/api';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  TrendingUp, 
  Calendar, 
  Activity,
  FileText
} from 'lucide-react';

interface Patient {
  id: number;
  name: string;
  age: number;
  condition: string;
}

interface Session {
  id: number;
  status: string;
  scheduledAt: string;
  startedAt?: string;
  completedAt?: string;
  exerciseResults: any[];
}

interface Exercise {
  id: number;
  nome: string;
  tipoGripe: string;
  pctForca: number;
  repeticoes: number;
}

export default function PatientProgress() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPatientData();
  }, [id]);

  const loadPatientData = async () => {
    try {
      const [patientData, sessionsData, exercisesData] = await Promise.all([
        ApiClient.getPaciente(Number(id)),
        ApiClient.getPatientSessions(Number(id)),
        ApiClient.getPatientExercises(Number(id)),
      ]);

      setPatient(patientData as Patient);
      setSessions(sessionsData);
      setExercises(exercisesData);
    } catch (error) {
      toast.error('Erro ao carregar dados do paciente');
    } finally {
      setLoading(false);
    }
  };

  if (loading || !patient) {
    return (
      <DashboardLayout>
        <div className="flex h-64 items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      </DashboardLayout>
    );
  }

  const completedSessions = sessions.filter(s => s.status === 'completed').length;
  const totalSessions = sessions.length;
  const completionRate = totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; label: string }> = {
      completed: { variant: 'default', label: 'Concluída' },
      in_progress: { variant: 'secondary', label: 'Em Andamento' },
      scheduled: { variant: 'outline', label: 'Agendada' },
      cancelled: { variant: 'destructive', label: 'Cancelada' },
    };

    const config = variants[status] || variants.scheduled;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/patients')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{patient.name}</h1>
            <p className="text-muted-foreground">
              {patient.age} anos - {patient.condition}
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total de Sessões
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalSessions}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Sessões Concluídas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-success">{completedSessions}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Taxa de Conclusão
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{completionRate.toFixed(0)}%</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Exercícios Ativos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{exercises.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="sessions" className="space-y-6">
          <TabsList>
            <TabsTrigger value="sessions" className="gap-2">
              <Calendar className="h-4 w-4" />
              Sessões
            </TabsTrigger>
            <TabsTrigger value="exercises" className="gap-2">
              <Activity className="h-4 w-4" />
              Exercícios
            </TabsTrigger>
            <TabsTrigger value="progress" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              Progresso
            </TabsTrigger>
          </TabsList>

          {/* Sessions Tab */}
          <TabsContent value="sessions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Sessões</CardTitle>
              </CardHeader>
              <CardContent>
                {sessions.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    Nenhuma sessão registrada
                  </p>
                ) : (
                  <div className="space-y-3">
                    {sessions.map((session) => (
                      <div
                        key={session.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-3">
                            <span className="font-semibold">Sessão #{session.id}</span>
                            {getStatusBadge(session.status)}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Agendada: {formatDate(session.scheduledAt)}
                          </p>
                          {session.completedAt && (
                            <p className="text-sm text-muted-foreground">
                              Concluída: {formatDate(session.completedAt)}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          {session.status === 'completed' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/sessions/${session.id}/report`)}
                              className="gap-2"
                            >
                              <FileText className="h-4 w-4" />
                              Ver Relatório
                            </Button>
                          )}
                          {session.status === 'scheduled' && (
                            <Button
                              size="sm"
                              onClick={() => navigate(`/sessions/${session.id}/execute`)}
                            >
                              Iniciar Sessão
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Exercises Tab */}
          <TabsContent value="exercises" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Exercícios Prescritos</CardTitle>
              </CardHeader>
              <CardContent>
                {exercises.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    Nenhum exercício prescrito
                  </p>
                ) : (
                  <div className="space-y-3">
                    {exercises.map((exercise) => (
                      <div
                        key={exercise.id}
                        className="p-4 border rounded-lg space-y-2"
                      >
                        <h3 className="font-semibold">{exercise.nome}</h3>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Tipo</p>
                            <p className="font-medium capitalize">{exercise.tipoGripe}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Força Alvo</p>
                            <p className="font-medium">{exercise.pctForca}%</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Repetições</p>
                            <p className="font-medium">{exercise.repeticoes}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Análise de Progresso</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-3">Evolução do Tratamento</h3>
                    <p className="text-sm text-muted-foreground">
                      Gráficos e análises detalhadas de progresso serão exibidos aqui.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold text-sm mb-2">Força Média</h4>
                      <div className="text-2xl font-bold text-primary">Em desenvolvimento</div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold text-sm mb-2">Consistência</h4>
                      <div className="text-2xl font-bold text-secondary">Em desenvolvimento</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
