import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Bluetooth, BluetoothSearching, BluetoothOff, Battery, Signal, Clock } from 'lucide-react';
import { bluetoothService, SensorData } from '@/services/bluetooth';
import { useToast } from '@/hooks/use-toast';

interface BluetoothDeviceInfo {
  id: string;
  name?: string;
  device: BluetoothDevice;
}

interface BluetoothConnectionProps {
  onSensorUpdate?: (data: SensorData) => void;
  onConnectionChange?: (connected: boolean) => void;
}

export function BluetoothConnection({ onSensorUpdate, onConnectionChange }: BluetoothConnectionProps) {
  const { toast } = useToast();
  const [deviceName, setDeviceName] = useState<string>('Nenhum dispositivo');
  const [battery, setBattery] = useState<number>(0);
  const [signalQuality, setSignalQuality] = useState<string>('Excelente');
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [isAvailable, setIsAvailable] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [availableDevices, setAvailableDevices] = useState<BluetoothDeviceInfo[]>([]);
  const [showDeviceList, setShowDeviceList] = useState<boolean>(false);
  const [lastSensorUpdate, setLastSensorUpdate] = useState<string>('--/--/---- - --:--:--');

  useEffect(() => {
    const checkBluetooth = async () => {
      const available = bluetoothService.isBluetoothAvailable();
      setIsAvailable(available);

      if (!available) {
        toast({
          title: 'Bluetooth não disponível',
          description: 'Seu navegador não suporta Web Bluetooth API',
          variant: 'destructive',
        });
      }
    };

    checkBluetooth();
  }, [toast]);

  useEffect(() => {
    // Registra callback para receber atualizações dos sensores
    const handleSensorUpdate = (data: SensorData) => {
      console.log('Dados dos sensores atualizados:', data);
      setLastSensorUpdate(data.timestamp);

      // Passa os dados para o componente pai se o callback foi fornecido
      if (onSensorUpdate) {
        onSensorUpdate(data);
      }
    };

    bluetoothService.onSensorUpdate(handleSensorUpdate);

    // Cleanup: remove o callback quando o componente desmontar
    return () => {
      bluetoothService.offSensorUpdate(handleSensorUpdate);
    };
  }, [onSensorUpdate]);

  const handleScanDevices = async () => {
    setIsScanning(true);
    try {
      const device = await bluetoothService.requestDevice();
      if (device) {
        setAvailableDevices([device]);
        setShowDeviceList(true);
        toast({
          title: 'Dispositivo encontrado',
          description: `Encontrado: ${device.name || device.id}`,
        });
      } else {
        toast({
          title: 'Nenhum dispositivo selecionado',
          description: 'Tente novamente',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Erro ao escanear dispositivos:', error);
      toast({
        title: 'Erro ao escanear',
        description: 'Não foi possível buscar dispositivos Bluetooth',
        variant: 'destructive',
      });
    } finally {
      setIsScanning(false);
    }
  };

  const handleSelectDevice = async (device: BluetoothDeviceInfo) => {
    setIsConnecting(true);
    try {
      const connected = await bluetoothService.connectToDevice();
      if (connected) {
        setDeviceName(device.name || `ID: ${device.id}`);
        setIsConnected(true);
        setShowDeviceList(false);

        // Simular dados de bateria e sinal (em produção, viriam do dispositivo)
        setBattery(Math.floor(Math.random() * 100) + 20);
        setSignalQuality(['Excelente', 'Bom', 'Razoável'][Math.floor(Math.random() * 3)]);

        toast({
          title: 'Conectado!',
          description: `Conectado ao dispositivo ${device.name || device.id}`,
        });

        if (onConnectionChange) {
          onConnectionChange(true);
        }
      } else {
        toast({
          title: 'Falha na conexão',
          description: 'Não foi possível conectar ao dispositivo',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Erro ao conectar:', error);
      toast({
        title: 'Erro ao conectar',
        description: 'Ocorreu um erro ao conectar ao dispositivo',
        variant: 'destructive',
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    bluetoothService.disconnect();
    setIsConnected(false);
    setDeviceName('Nenhum dispositivo');
    setBattery(0);
    setSignalQuality('Excelente');
    setShowDeviceList(false);
    setAvailableDevices([]);
    setLastSensorUpdate('--/--/---- - --:--:--');

    toast({
      title: 'Desconectado',
      description: 'Dispositivo Bluetooth desconectado',
    });

    if (onConnectionChange) {
      onConnectionChange(false);
    }
  };

  if (!isAvailable) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
              <BluetoothOff className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <CardTitle>Bluetooth Indisponível</CardTitle>
              <p className="text-sm text-muted-foreground">
                Web Bluetooth API não suportada
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
              isConnected ? 'bg-primary/10' : 'bg-muted'
            }`}>
              <Bluetooth className={`h-5 w-5 ${isConnected ? 'text-primary' : 'text-muted-foreground'}`} />
            </div>
            <div>
              <CardTitle>Conexão Bluetooth</CardTitle>
              <p className="text-sm text-muted-foreground">
                {isConnected ? deviceName : 'Dispositivo ESP32'}
              </p>
            </div>
          </div>

          <Badge variant={isConnected ? 'default' : 'secondary'}>
            {isConnected ? 'Conectado' : 'Desconectado'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Lista de Dispositivos Disponíveis */}
        {showDeviceList && !isConnected && availableDevices.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Dispositivos Encontrados</p>
            <div className="rounded-lg border">
              {availableDevices.map((device) => (
                <button
                  key={device.id}
                  onClick={() => handleSelectDevice(device)}
                  disabled={isConnecting}
                  className="w-full p-3 text-left hover:bg-muted disabled:opacity-50"
                >
                  <p className="font-medium">{device.name || `Dispositivo ${device.id.substring(0, 8)}`}</p>
                  <p className="text-sm text-muted-foreground">ID: {device.id}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Informações do Dispositivo Conectado */}
        {isConnected && (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Battery className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Bateria</span>
                </div>
                <span className="font-medium">{battery}%</span>
              </div>
              <Progress value={battery} className="h-2" />
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Signal className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Sinal</span>
              </div>
              <span className="font-medium">{signalQuality}</span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Última leitura</span>
              </div>
              <span className="font-medium text-xs">{lastSensorUpdate}</span>
            </div>
          </div>
        )}

        {/* Botões de Ação */}
        <div className="flex gap-2">
          {!isConnected && (
            <Button
              onClick={handleScanDevices}
              disabled={isScanning || isConnecting}
              className="w-full"
            >
              {isScanning ? (
                <>
                  <BluetoothSearching className="mr-2 h-4 w-4 animate-pulse" />
                  Procurando...
                </>
              ) : (
                <>
                  <Bluetooth className="mr-2 h-4 w-4" />
                  Escanear Dispositivos
                </>
              )}
            </Button>
          )}

          {isConnected && (
            <Button
              onClick={handleDisconnect}
              disabled={isConnecting}
              variant="destructive"
              className="w-full"
            >
              <BluetoothOff className="mr-2 h-4 w-4" />
              Desconectar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
