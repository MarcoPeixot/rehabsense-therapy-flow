import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ApiClient } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Plus, Calendar as CalendarIcon, Play, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Sessions() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [exercises, setExercises] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    pacienteId: '',
    scheduledDate: '',
    exerciseIds: [] as string[],
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [sessionsData, patientsData, exercisesData] = await Promise.all([
        ApiClient.getSessions(),
        ApiClient.getPacientes(),
        ApiClient.getExercises(),
      ]);
      setSessions(sessionsData);
      setPatients(patientsData);
      setExercises(exercisesData);
    } catch (error) {
      toast({
        title: 'Erro ao carregar dados',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await ApiClient.createSession({
        pacienteId: parseInt(formData.pacienteId),
        scheduledDate: new Date(formData.scheduledDate).toISOString(),
        exerciseIds: formData.exerciseIds.map((id) => parseInt(id)),
      });

      toast({
        title: 'Sessão agendada!',
        description: 'A sessão foi criada com sucesso.',
      });

      setDialogOpen(false);
      setFormData({
        pacienteId: '',
        scheduledDate: '',
        exerciseIds: [],
      });
      loadData();
    } catch (error: any) {
      toast({
        title: 'Erro ao criar sessão',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleStartSession = async (id: number) => {
    try {
      await ApiClient.startSession(id);
      toast({
        title: 'Sessão iniciada!',
      });
      loadData();
    } catch (error) {
      toast({
        title: 'Erro ao iniciar sessão',
        variant: 'destructive',
      });
    }
  };

  const handleCompleteSession = async (id: number) => {
    try {
      await ApiClient.completeSession(id);
      toast({
        title: 'Sessão concluída!',
      });
      loadData();
    } catch (error) {
      toast({
        title: 'Erro ao concluir sessão',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      scheduled: 'bg-muted text-muted-foreground',
      in_progress: 'bg-secondary/10 text-secondary',
      completed: 'bg-success/10 text-success',
      cancelled: 'bg-destructive/10 text-destructive',
    };

    const labels = {
      scheduled: 'Agendada',
      in_progress: 'Em Progresso',
      completed: 'Concluída',
      cancelled: 'Cancelada',
    };

    return (
      <span className={`rounded-full px-3 py-1 text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

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
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Sessões</h1>
            <p className="text-muted-foreground">Gerencie suas sessões terapêuticas</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nova Sessão
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Agendar Nova Sessão</DialogTitle>
                <DialogDescription>
                  Crie uma nova sessão terapêutica para um paciente
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="patient">Paciente</Label>
                  <Select
                    value={formData.pacienteId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, pacienteId: value })
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um paciente" />
                    </SelectTrigger>
                    <SelectContent>
                      {patients.map((patient) => (
                        <SelectItem key={patient.id} value={patient.id.toString()}>
                          {patient.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Data e hora</Label>
                  <Input
                    id="date"
                    type="datetime-local"
                    value={formData.scheduledDate}
                    onChange={(e) =>
                      setFormData({ ...formData, scheduledDate: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Exercícios (opcional)</Label>
                  <div className="max-h-40 space-y-2 overflow-y-auto rounded-md border border-input p-3">
                    {exercises.map((exercise) => (
                      <label
                        key={exercise.id}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={formData.exerciseIds.includes(exercise.id.toString())}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({
                                ...formData,
                                exerciseIds: [...formData.exerciseIds, exercise.id.toString()],
                              });
                            } else {
                              setFormData({
                                ...formData,
                                exerciseIds: formData.exerciseIds.filter(
                                  (id) => id !== exercise.id.toString()
                                ),
                              });
                            }
                          }}
                          className="rounded border-input"
                        />
                        <span className="text-sm">{exercise.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <Button type="submit" className="w-full">
                  Agendar Sessão
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Sessions List */}
        {sessions.length > 0 ? (
          <div className="space-y-4">
            {sessions.map((session) => (
              <Card key={session.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <CalendarIcon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          Sessão #{session.id}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {new Date(session.scheduledAt || session.scheduledDate).toLocaleString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(session.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      {session.paciente && (
                        <div>
                          <p className="text-sm text-muted-foreground">Paciente</p>
                          <p className="font-medium">{session.paciente.name}</p>
                        </div>
                      )}
                      {session.exerciseResults && session.exerciseResults.length > 0 && (
                        <div>
                          <p className="text-sm text-muted-foreground">Exercícios</p>
                          <p className="font-medium">{session.exerciseResults.length} exercício(s)</p>
                        </div>
                      )}
                      {session.notes && (
                        <p className="mt-2 text-sm">{session.notes}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {session.status === 'scheduled' && (
                        <Button
                          size="sm"
                          onClick={() => handleStartSession(session.id)}
                        >
                          <Play className="mr-1 h-3 w-3" />
                          Iniciar
                        </Button>
                      )}
                      {session.status === 'in_progress' && (
                        <Button
                          size="sm"
                          onClick={() => handleCompleteSession(session.id)}
                        >
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Concluir
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex h-32 items-center justify-center">
              <p className="text-muted-foreground">Nenhuma sessão agendada</p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
