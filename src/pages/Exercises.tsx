import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ApiClient } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Plus, Sparkles, Dumbbell, Trash2, Clock } from 'lucide-react';

export default function Exercises() {
  const { toast } = useToast();
  const [exercises, setExercises] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [aiDialogOpen, setAiDialogOpen] = useState(false);

  const [manualForm, setManualForm] = useState({
    name: '',
    description: '',
    targetArea: '',
    duration: '',
    pacienteId: '',
  });

  const [aiForm, setAiForm] = useState({
    condition: '',
    targetArea: '',
    difficulty: 'medium',
    pacienteId: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [exercisesData, patientsData] = await Promise.all([
        ApiClient.getExercises(),
        ApiClient.getPacientes(),
      ]);
      setExercises(exercisesData);
      setPatients(patientsData);
    } catch (error) {
      toast({
        title: 'Erro ao carregar dados',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await ApiClient.createExercise({
        name: manualForm.name,
        description: manualForm.description,
        targetArea: manualForm.targetArea,
        duration: parseInt(manualForm.duration),
        pacienteId: parseInt(manualForm.pacienteId),
      });

      toast({
        title: 'Exercício criado!',
        description: 'O exercício foi adicionado com sucesso.',
      });

      setDialogOpen(false);
      setManualForm({
        name: '',
        description: '',
        targetArea: '',
        duration: '',
        pacienteId: '',
      });
      loadData();
    } catch (error: any) {
      toast({
        title: 'Erro ao criar exercício',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleAiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      toast({
        title: 'Gerando exercício...',
        description: 'A IA está criando um exercício personalizado.',
      });

      await ApiClient.generateExercise({
        condition: aiForm.condition,
        targetArea: aiForm.targetArea,
        difficulty: aiForm.difficulty,
        pacienteId: parseInt(aiForm.pacienteId),
      });

      toast({
        title: 'Exercício gerado com IA!',
        description: 'O exercício personalizado foi criado com sucesso.',
      });

      setAiDialogOpen(false);
      setAiForm({
        condition: '',
        targetArea: '',
        difficulty: 'medium',
        pacienteId: '',
      });
      loadData();
    } catch (error: any) {
      toast({
        title: 'Erro ao gerar exercício',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja deletar este exercício?')) return;

    try {
      await ApiClient.deleteExercise(id);
      toast({
        title: 'Exercício deletado',
      });
      loadData();
    } catch (error) {
      toast({
        title: 'Erro ao deletar exercício',
        variant: 'destructive',
      });
    }
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
            <h1 className="text-3xl font-bold text-foreground">Exercícios</h1>
            <p className="text-muted-foreground">Crie e gerencie exercícios terapêuticos</p>
          </div>
          <div className="flex gap-2">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Criar Manual
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Criar Exercício Manual</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleManualSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="patient">Paciente</Label>
                    <Select
                      value={manualForm.pacienteId}
                      onValueChange={(value) =>
                        setManualForm({ ...manualForm, pacienteId: value })
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
                    <Label htmlFor="name">Nome do exercício</Label>
                    <Input
                      id="name"
                      value={manualForm.name}
                      onChange={(e) =>
                        setManualForm({ ...manualForm, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea
                      id="description"
                      value={manualForm.description}
                      onChange={(e) =>
                        setManualForm({ ...manualForm, description: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="targetArea">Área alvo</Label>
                    <Input
                      id="targetArea"
                      value={manualForm.targetArea}
                      onChange={(e) =>
                        setManualForm({ ...manualForm, targetArea: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duração (minutos)</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={manualForm.duration}
                      onChange={(e) =>
                        setManualForm({ ...manualForm, duration: e.target.value })
                      }
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Criar Exercício
                  </Button>
                </form>
              </DialogContent>
            </Dialog>

            <Dialog open={aiDialogOpen} onOpenChange={setAiDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Gerar com IA
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Gerar Exercício com IA</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAiSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="ai-patient">Paciente</Label>
                    <Select
                      value={aiForm.pacienteId}
                      onValueChange={(value) =>
                        setAiForm({ ...aiForm, pacienteId: value })
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
                    <Label htmlFor="condition">Condição</Label>
                    <Input
                      id="condition"
                      value={aiForm.condition}
                      onChange={(e) =>
                        setAiForm({ ...aiForm, condition: e.target.value })
                      }
                      placeholder="Ex: recuperação de AVC"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ai-targetArea">Área alvo</Label>
                    <Input
                      id="ai-targetArea"
                      value={aiForm.targetArea}
                      onChange={(e) =>
                        setAiForm({ ...aiForm, targetArea: e.target.value })
                      }
                      placeholder="Ex: motricidade fina"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="difficulty">Dificuldade</Label>
                    <Select
                      value={aiForm.difficulty}
                      onValueChange={(value) =>
                        setAiForm({ ...aiForm, difficulty: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Fácil</SelectItem>
                        <SelectItem value="medium">Médio</SelectItem>
                        <SelectItem value="hard">Difícil</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" className="w-full">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Gerar Exercício
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Exercises Grid */}
        {exercises.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {exercises.map((exercise) => (
              <Card key={exercise.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-semibold">
                    {exercise.name}
                  </CardTitle>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/10">
                    <Dumbbell className="h-5 w-5 text-secondary" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {exercise.description}
                  </p>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Área alvo</p>
                    <p className="font-medium">{exercise.targetArea}</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {exercise.duration} minutos
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(exercise.id)}
                    className="w-full text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="mr-1 h-3 w-3" />
                    Deletar
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex h-32 items-center justify-center">
              <p className="text-muted-foreground">Nenhum exercício criado ainda</p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
