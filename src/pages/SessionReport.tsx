import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ApiClient } from '@/lib/api';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  Download, 
  CheckCircle, 
  XCircle, 
  TrendingUp, 
  Calendar,
  User,
  Activity
} from 'lucide-react';

interface SessionReport {
  sessionId: number;
  paciente: {
    name: string;
    age: number;
    condition: string;
  };
  startedAt: string;
  completedAt: string;
  duration: number;
  exercisesCompleted: number;
  exercisesSkipped: number;
  totalExercises: number;
  exerciseDetails: Array<{
    nome: string;
    tipoGripe: string;
    status: string;
    metrics?: {
      avgForce: number;
      maxForce: number;
      minForce: number;
      consistency: number;
      completionRate: number;
    };
  }>;
  overallPerformance: {
    avgForce: number;
    consistency: number;
    completionRate: number;
  };
  recommendations: string[];
}

export default function SessionReport() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [report, setReport] = useState<SessionReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReport();
  }, [id]);

  const loadReport = async () => {
    try {
      const data = await ApiClient.getSessionReport(Number(id)) as SessionReport;
      setReport(data);
    } catch (error) {
      toast.error('Erro ao carregar relatório');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    toast.info('Funcionalidade de download em desenvolvimento');
  };

  if (loading || !report) {
    return (
      <DashboardLayout>
        <div className="flex h-64 items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      </DashboardLayout>
    );
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/sessions')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Relatório da Sessão</h1>
              <p className="text-muted-foreground">Análise detalhada de desempenho</p>
            </div>
          </div>
          <Button onClick={handleDownloadPDF} className="gap-2">
            <Download className="h-4 w-4" />
            Baixar PDF
          </Button>
        </div>

        {/* Patient Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Informações do Paciente
            </CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Nome</p>
              <p className="font-semibold">{report.paciente.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Idade</p>
              <p className="font-semibold">{report.paciente.age} anos</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Condição</p>
              <p className="font-semibold">{report.paciente.condition}</p>
            </div>
          </CardContent>
        </Card>

        {/* Session Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Resumo da Sessão
            </CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Início</p>
              <p className="font-semibold">{formatDateTime(report.startedAt)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Término</p>
              <p className="font-semibold">{formatDateTime(report.completedAt)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Duração</p>
              <p className="font-semibold">{formatDuration(report.duration)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Exercícios</p>
              <p className="font-semibold">
                {report.exercisesCompleted}/{report.totalExercises} concluídos
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Desempenho Geral
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">Força Média</p>
                <div className="text-4xl font-bold text-primary">
                  {report.overallPerformance?.avgForce?.toFixed(1) || '0.0'}%
                </div>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">Consistência</p>
                <div className="text-4xl font-bold text-secondary">
                  {((report.overallPerformance?.consistency || 0) * 100).toFixed(0)}%
                </div>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">Taxa de Conclusão</p>
                <div className="text-4xl font-bold text-success">
                  {((report.overallPerformance?.completionRate || 0) * 100).toFixed(0)}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Exercise Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Detalhes dos Exercícios
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {report.exerciseDetails && report.exerciseDetails.length > 0 ? (
              report.exerciseDetails.map((exercise, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{exercise.nome}</h3>
                    <p className="text-sm text-muted-foreground capitalize">
                      Tipo: {exercise.tipoGripe}
                    </p>
                  </div>
                  <Badge variant={exercise.status === 'completed' ? 'default' : 'secondary'}>
                    {exercise.status === 'completed' ? (
                      <><CheckCircle className="h-3 w-3 mr-1" /> Concluído</>
                    ) : (
                      <><XCircle className="h-3 w-3 mr-1" /> Pulado</>
                    )}
                  </Badge>
                </div>

                {exercise.metrics && (
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-3 border-t">
                    <div>
                      <p className="text-xs text-muted-foreground">Força Média</p>
                      <p className="text-sm font-semibold">{exercise.metrics.avgForce.toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Força Máxima</p>
                      <p className="text-sm font-semibold">{exercise.metrics.maxForce.toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Força Mínima</p>
                      <p className="text-sm font-semibold">{exercise.metrics.minForce.toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Consistência</p>
                      <p className="text-sm font-semibold">
                        {(exercise.metrics.consistency * 100).toFixed(0)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Conclusão</p>
                      <p className="text-sm font-semibold">
                        {(exercise.metrics.completionRate * 100).toFixed(0)}%
                      </p>
                    </div>
                  </div>
                )}
              </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                Nenhum detalhe de exercício disponível
              </p>
            )}
          </CardContent>
        </Card>

        {/* Recommendations */}
        {report.recommendations && report.recommendations.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recomendações</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {report.recommendations.map((rec, index) => (
                  <li key={index} className="flex gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span className="text-sm">{rec}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
