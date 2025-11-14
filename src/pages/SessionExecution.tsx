import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ApiClient } from '@/lib/api';
import { toast } from 'sonner';
import { Play, Pause, SkipForward, CheckCircle, Activity } from 'lucide-react';
import { SensorMonitor } from '@/components/SensorMonitor';

interface Exercise {
  id: number;
  nome: string;
  tipoGripe: string;
  segDuracao: number;
  pctForca: number;
  repeticoes: number;
  observacoes?: string;
}

interface ExerciseResult {
  id: number;
  exerciseId: number;
  status: string;
  exercise: Exercise;
}

interface Session {
  id: number;
  status: string;
  paciente: { name: string; age: number; condition: string };
  exerciseResults: ExerciseResult[];
}

export default function SessionExecution() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isExercising, setIsExercising] = useState(false);
  const [timer, setTimer] = useState(0);
  const [currentRep, setCurrentRep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [sensorData, setSensorData] = useState<any>(null);

  useEffect(() => {
    loadSession();
  }, [id]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isExercising && currentExercise) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev >= currentExercise.exercise.segDuracao) {
            handleRepComplete();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isExercising, currentExerciseIndex]);

  const loadSession = async () => {
    try {
      const data = await ApiClient.getSession(Number(id)) as Session;
      setSession(data);
      
      if (data.status === 'scheduled') {
        await ApiClient.startSession(Number(id));
        setSession({ ...data, status: 'in_progress' });
      }
    } catch (error) {
      toast.error('Erro ao carregar sessão');
      navigate('/sessions');
    } finally {
      setLoading(false);
    }
  };

  const handleRepComplete = () => {
    if (!currentExercise) return;
    
    if (currentRep < currentExercise.exercise.repeticoes) {
      setCurrentRep(currentRep + 1);
      setTimer(0);
      setIsExercising(false);
      toast.success(`Repetição ${currentRep} completa!`);
    } else {
      handleExerciseComplete();
    }
  };

  const handleExerciseComplete = async () => {
    try {
      await ApiClient.completeSessionExercise(
        Number(id),
        currentExercise!.exerciseId,
        {
          status: 'completed',
          metrics: {
            avgForce: sensorData?.avgForce || 0,
            maxForce: sensorData?.maxForce || 0,
            minForce: sensorData?.minForce || 0,
            consistency: 0.9,
            completionRate: 1.0,
          },
        }
      );

      toast.success('Exercício concluído!');
      
      if (currentExerciseIndex < session!.exerciseResults.length - 1) {
        setCurrentExerciseIndex(currentExerciseIndex + 1);
        setCurrentRep(1);
        setTimer(0);
        setIsExercising(false);
      } else {
        await handleSessionComplete();
      }
    } catch (error) {
      toast.error('Erro ao completar exercício');
    }
  };

  const handleSkipExercise = async () => {
    try {
      await ApiClient.completeSessionExercise(
        Number(id),
        currentExercise!.exerciseId,
        { status: 'skipped' }
      );

      toast.info('Exercício pulado');
      
      if (currentExerciseIndex < session!.exerciseResults.length - 1) {
        setCurrentExerciseIndex(currentExerciseIndex + 1);
        setCurrentRep(1);
        setTimer(0);
      } else {
        await handleSessionComplete();
      }
    } catch (error) {
      toast.error('Erro ao pular exercício');
    }
  };

  const handleSessionComplete = async () => {
    try {
      await ApiClient.completeSession(Number(id));
      toast.success('Sessão concluída com sucesso!');
      navigate(`/sessions/${id}/report`);
    } catch (error) {
      toast.error('Erro ao completar sessão');
    }
  };

  const handleSensorData = async (data: any) => {
    setSensorData(data);
    
    // Salvar leitura do sensor
    try {
      await ApiClient.saveSensorReading(
        Number(id),
        currentExercise!.exerciseId,
        data
      );
    } catch (error) {
      console.error('Erro ao salvar leitura do sensor:', error);
    }
  };

  if (loading || !session) {
    return (
      <DashboardLayout>
        <div className="flex h-64 items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      </DashboardLayout>
    );
  }

  const currentExercise = session.exerciseResults[currentExerciseIndex];
  const progress = ((currentExerciseIndex + 1) / session.exerciseResults.length) * 100;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Execução da Sessão</h1>
          <p className="text-muted-foreground">
            Paciente: {session.paciente.name} - {session.paciente.condition}
          </p>
        </div>

        {/* Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Progresso da Sessão</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Exercício {currentExerciseIndex + 1} de {session.exerciseResults.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} />
          </CardContent>
        </Card>

        {/* Current Exercise */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              {currentExercise.exercise.nome}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Tipo de Gripe</p>
                <p className="text-lg font-semibold capitalize">{currentExercise.exercise.tipoGripe}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Força Alvo</p>
                <p className="text-lg font-semibold">{currentExercise.exercise.pctForca}%</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Duração</p>
                <p className="text-lg font-semibold">{currentExercise.exercise.segDuracao}s</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Repetições</p>
                <p className="text-lg font-semibold">{currentRep}/{currentExercise.exercise.repeticoes}</p>
              </div>
            </div>

            {currentExercise.exercise.observacoes && (
              <div className="rounded-lg bg-muted/50 p-4">
                <p className="text-sm text-muted-foreground mb-1">Observações:</p>
                <p className="text-sm">{currentExercise.exercise.observacoes}</p>
              </div>
            )}

            {/* Timer */}
            <div className="text-center">
              <div className="text-6xl font-bold text-primary mb-2">
                {timer}s
              </div>
              <Progress 
                value={(timer / currentExercise.exercise.segDuracao) * 100} 
                className="h-2"
              />
            </div>

            {/* Controls */}
            <div className="flex gap-3 justify-center">
              {!isExercising ? (
                <Button onClick={() => setIsExercising(true)} size="lg" className="gap-2">
                  <Play className="h-5 w-5" />
                  Iniciar Repetição
                </Button>
              ) : (
                <Button onClick={() => setIsExercising(false)} variant="outline" size="lg" className="gap-2">
                  <Pause className="h-5 w-5" />
                  Pausar
                </Button>
              )}
              <Button onClick={handleSkipExercise} variant="outline" size="lg" className="gap-2">
                <SkipForward className="h-5 w-5" />
                Pular
              </Button>
              <Button onClick={handleExerciseComplete} variant="default" size="lg" className="gap-2">
                <CheckCircle className="h-5 w-5" />
                Concluir Exercício
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Sensor Monitor */}
        {isExercising && (
          <SensorMonitor
            exerciseId={currentExercise.exerciseId}
            targetForce={currentExercise.exercise.pctForca}
            onDataUpdate={handleSensorData}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
