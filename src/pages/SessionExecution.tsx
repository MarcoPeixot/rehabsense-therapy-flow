import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ApiClient } from '@/lib/api';
import { toast } from 'sonner';
import { Play, Pause, SkipForward, CheckCircle, Activity, XCircle } from 'lucide-react';
import { SensorMonitor } from '@/components/SensorMonitor';
import { BluetoothConnection } from '@/components/BluetoothConnection';
import { SensorData } from '@/services/bluetooth';

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
  const [bluetoothConnected, setBluetoothConnected] = useState(false);
  const [sensorReadings, setSensorReadings] = useState<SensorData[]>([]);

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

      if (data.status === 'scheduled') {
        await ApiClient.startSession(Number(id));
        const updatedData = { ...data, status: 'in_progress' };
        setSession(updatedData);
      } else {
        setSession(data);
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

  const handleBluetoothSensorUpdate = (data: SensorData) => {
    // Adiciona leitura ao array
    setSensorReadings(prev => [...prev, data]);

    // Atualiza dados do sensor para métricas
    setSensorData({
      avgForce: (data.polegar + data.indicador + data.medio + data.anular + data.mindinho) / 5,
      maxForce: Math.max(data.polegar, data.indicador, data.medio, data.anular, data.mindinho),
      minForce: Math.min(data.polegar, data.indicador, data.medio, data.anular, data.mindinho),
      ...data
    });

    // Salvar leitura do sensor no backend SOMENTE se exercício estiver rodando E sessão em andamento
    if (isExercising && currentExercise && session?.status === 'in_progress') {
      handleSensorData(data);
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Execução da Sessão</h1>
            <p className="text-muted-foreground">
              Paciente: {session.paciente.name} • {session.paciente.age} anos • {session.paciente.condition}
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate('/sessions')}>
            Voltar
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Coluna Esquerda - Bluetooth e Progresso */}
          <div className="lg:col-span-1 space-y-6">
            {/* Bluetooth Connection */}
            <BluetoothConnection
              onSensorUpdate={handleBluetoothSensorUpdate}
              onConnectionChange={setBluetoothConnected}
            />

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

            {/* Lista de Exercícios */}
            <Card>
              <CardHeader>
                <CardTitle>Exercícios da Sessão</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {session.exerciseResults.map((result, index) => (
                    <div
                      key={result.id}
                      className={`p-3 rounded-lg border ${
                        index === currentExerciseIndex
                          ? 'border-primary bg-primary/5'
                          : result.status === 'completed'
                          ? 'border-success bg-success/5'
                          : result.status === 'skipped'
                          ? 'border-muted'
                          : 'border-border'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">{result.exercise.nome}</p>
                          <p className="text-xs text-muted-foreground capitalize">
                            {result.exercise.tipoGripe} • {result.exercise.segDuracao}s • {result.exercise.repeticoes}x
                          </p>
                        </div>
                        {result.status === 'completed' && (
                          <CheckCircle className="h-4 w-4 text-success" />
                        )}
                        {result.status === 'skipped' && (
                          <XCircle className="h-4 w-4 text-muted-foreground" />
                        )}
                        {index === currentExerciseIndex && (
                          <Activity className="h-4 w-4 text-primary animate-pulse" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Coluna Direita - Exercício Atual */}
          <div className="lg:col-span-2 space-y-6">
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

        {/* Real-time Sensor Data Display */}
        {bluetoothConnected && sensorData && (
          <Card>
            <CardHeader>
              <CardTitle>Dados dos Sensores em Tempo Real</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Polegar</p>
                  <p className="text-2xl font-bold text-primary">{sensorData.polegar}%</p>
                  <Progress value={sensorData.polegar} className="mt-2" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Indicador</p>
                  <p className="text-2xl font-bold text-primary">{sensorData.indicador}%</p>
                  <Progress value={sensorData.indicador} className="mt-2" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Médio</p>
                  <p className="text-2xl font-bold text-primary">{sensorData.medio}%</p>
                  <Progress value={sensorData.medio} className="mt-2" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Anular</p>
                  <p className="text-2xl font-bold text-primary">{sensorData.anular}%</p>
                  <Progress value={sensorData.anular} className="mt-2" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Mindinho</p>
                  <p className="text-2xl font-bold text-primary">{sensorData.mindinho}%</p>
                  <Progress value={sensorData.mindinho} className="mt-2" />
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-4 pt-4 border-t">
                <div>
                  <p className="text-sm text-muted-foreground">Força Média</p>
                  <p className="text-xl font-bold">{sensorData.avgForce?.toFixed(1)}%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Força Máxima</p>
                  <p className="text-xl font-bold">{sensorData.maxForce}%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Força Mínima</p>
                  <p className="text-xl font-bold">{sensorData.minForce}%</p>
                </div>
              </div>
              </CardContent>
            </Card>
          )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
