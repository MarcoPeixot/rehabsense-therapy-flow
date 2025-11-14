import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity } from 'lucide-react';

interface SensorData {
  polegar: number;
  indicador: number;
  medio: number;
  anular: number;
  mindinho: number;
  rawValues?: {
    polegar: number;
    indicador: number;
    medio: number;
    anular: number;
    mindinho: number;
  };
}

interface SensorMonitorProps {
  exerciseId: number;
  targetForce: number;
  onDataUpdate?: (data: SensorData & { avgForce: number; maxForce: number; minForce: number }) => void;
}

export function SensorMonitor({ exerciseId, targetForce, onDataUpdate }: SensorMonitorProps) {
  const [sensorData, setSensorData] = useState<SensorData>({
    polegar: 0,
    indicador: 0,
    medio: 0,
    anular: 0,
    mindinho: 0,
  });
  const [history, setHistory] = useState<number[]>([]);

  useEffect(() => {
    // Simulação de leitura de sensor em tempo real
    // Em produção, isso seria substituído por comunicação real com o hardware
    const interval = setInterval(() => {
      const newData: SensorData = {
        polegar: Math.floor(Math.random() * 30 + (targetForce - 15)),
        indicador: Math.floor(Math.random() * 30 + (targetForce - 15)),
        medio: Math.floor(Math.random() * 30 + (targetForce - 20)),
        anular: Math.floor(Math.random() * 30 + (targetForce - 20)),
        mindinho: Math.floor(Math.random() * 30 + (targetForce - 25)),
        rawValues: {
          polegar: Math.floor(Math.random() * 1000 + 2500),
          indicador: Math.floor(Math.random() * 1000 + 2300),
          medio: Math.floor(Math.random() * 1000 + 2100),
          anular: Math.floor(Math.random() * 1000 + 1900),
          mindinho: Math.floor(Math.random() * 1000 + 1700),
        },
      };

      setSensorData(newData);

      // Calcular estatísticas
      const forces = [newData.polegar, newData.indicador, newData.medio, newData.anular, newData.mindinho];
      const avgForce = forces.reduce((a, b) => a + b, 0) / forces.length;
      const maxForce = Math.max(...forces);
      const minForce = Math.min(...forces);

      setHistory((prev) => [...prev.slice(-20), avgForce]);

      if (onDataUpdate) {
        onDataUpdate({ ...newData, avgForce, maxForce, minForce });
      }
    }, 100);

    return () => clearInterval(interval);
  }, [targetForce, onDataUpdate]);

  const getForceColor = (force: number) => {
    const diff = Math.abs(force - targetForce);
    if (diff <= 5) return 'text-success';
    if (diff <= 10) return 'text-warning';
    return 'text-destructive';
  };

  const getForceStatus = (force: number) => {
    const diff = Math.abs(force - targetForce);
    if (diff <= 5) return 'Ótimo';
    if (diff <= 10) return 'Bom';
    return 'Ajustar';
  };

  const fingers = [
    { name: 'Polegar', value: sensorData.polegar, key: 'polegar' },
    { name: 'Indicador', value: sensorData.indicador, key: 'indicador' },
    { name: 'Médio', value: sensorData.medio, key: 'medio' },
    { name: 'Anular', value: sensorData.anular, key: 'anular' },
    { name: 'Mindinho', value: sensorData.mindinho, key: 'mindinho' },
  ];

  const avgForce = fingers.reduce((sum, f) => sum + f.value, 0) / fingers.length;

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary animate-pulse" />
          Monitor de Sensores em Tempo Real
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Target Force */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-2">Força Alvo</p>
          <div className="text-4xl font-bold text-primary">{targetForce}%</div>
        </div>

        {/* Average Force */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-2">Força Média Atual</p>
          <div className={`text-3xl font-bold ${getForceColor(avgForce)}`}>
            {avgForce.toFixed(1)}%
          </div>
          <Badge variant={getForceStatus(avgForce) === 'Ótimo' ? 'default' : 'secondary'} className="mt-2">
            {getForceStatus(avgForce)}
          </Badge>
        </div>

        {/* Individual Fingers */}
        <div className="grid grid-cols-5 gap-3">
          {fingers.map((finger) => (
            <div key={finger.key} className="text-center space-y-2">
              <div className="relative">
                <div className="h-32 w-full bg-muted rounded-lg overflow-hidden">
                  <div
                    className="bg-primary/80 transition-all duration-300 ease-out"
                    style={{
                      height: `${Math.min(finger.value, 100)}%`,
                      position: 'absolute',
                      bottom: 0,
                      width: '100%',
                    }}
                  />
                  <div
                    className="absolute w-full border-t-2 border-dashed border-primary"
                    style={{ bottom: `${Math.min(targetForce, 100)}%` }}
                  />
                </div>
              </div>
              <div className="text-xs font-medium">{finger.name}</div>
              <div className={`text-lg font-bold ${getForceColor(finger.value)}`}>
                {finger.value}%
              </div>
            </div>
          ))}
        </div>

        {/* Force Graph */}
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Histórico de Força (últimos 20 registros)</p>
          <div className="h-24 flex items-end gap-0.5">
            {history.map((force, index) => (
              <div
                key={index}
                className="flex-1 bg-primary/60 rounded-t transition-all"
                style={{ height: `${(force / 100) * 100}%` }}
              />
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-muted/50 rounded-lg p-4">
          <p className="text-sm text-muted-foreground">
            💡 <strong>Dica:</strong> Mantenha a força próxima ao alvo indicado pela linha tracejada.
            O gráfico verde indica que você está no intervalo ideal.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
