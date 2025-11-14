/**
 * Serviço de Bluetooth para RehabSense
 * Gerencia a conexão e comunicação com dispositivos Bluetooth
 */

// Tipos para o Bluetooth
interface BluetoothPairingDetails {
  deviceId: string;
  pairingKind: 'confirm' | 'confirmPin' | 'providePin';
  pin?: string;
}

interface BluetoothPairingResponse {
  confirmed: boolean;
  pin?: string;
}

// Declaração global para APIs do Electron
declare global {
  interface Window {
    electronAPI?: {
      cancelBluetoothRequest: () => void;
      bluetoothPairingRequest: (callback: (event: any, details: BluetoothPairingDetails) => void) => void;
      bluetoothPairingResponse: (response: BluetoothPairingResponse) => void;
    };
  }

  interface BluetoothDevice {
    id: string;
    name?: string;
    gatt?: BluetoothRemoteGATTServer;
    addEventListener(type: string, listener: EventListener): void;
    removeEventListener(type: string, listener: EventListener): void;
  }

  interface BluetoothRemoteGATTServer {
    device: BluetoothDevice;
    connected: boolean;
    connect(): Promise<BluetoothRemoteGATTServer>;
    disconnect(): void;
    getPrimaryServices(): Promise<BluetoothRemoteGATTService[]>;
    getPrimaryService(service: string): Promise<BluetoothRemoteGATTService>;
  }

  interface BluetoothRemoteGATTService {
    uuid: string;
    device: BluetoothDevice;
    getCharacteristics(): Promise<BluetoothRemoteGATTCharacteristic[]>;
    getCharacteristic(characteristic: string): Promise<BluetoothRemoteGATTCharacteristic>;
  }

  interface BluetoothRemoteGATTCharacteristic {
    uuid: string;
    service: BluetoothRemoteGATTService;
    value?: DataView;
    readValue(): Promise<DataView>;
    writeValue(value: BufferSource): Promise<void>;
    startNotifications(): Promise<BluetoothRemoteGATTCharacteristic>;
    stopNotifications(): Promise<BluetoothRemoteGATTCharacteristic>;
    addEventListener(type: string, listener: EventListener): void;
    removeEventListener(type: string, listener: EventListener): void;
  }

  interface Navigator {
    bluetooth?: {
      requestDevice: (options: {
        acceptAllDevices?: boolean;
        filters?: Array<{ services?: string[]; name?: string }>;
        optionalServices?: string[];
      }) => Promise<BluetoothDevice>;
    };
  }
}

// Configuração do ESP32
const ESP32_CONFIG = {
  deviceName: 'E32ZE',
  bleService: '19b10000-e8f0-537e-4f6c-d104768a1214',
  ledCharacteristic: '19b10002-e8f0-537e-4f6c-d104768a1214',
  sensorCharacteristic: '19b10001-e8f0-537e-4f6c-d104768a1214'
};

// Interface para dados dos sensores
export interface SensorData {
  polegar: number;
  indicador: number;
  medio: number;
  anular: number;
  mindinho: number;
  timestamp: string;
  // Valores brutos do ADC (0-4095)
  rawValues: {
    polegar: number;
    indicador: number;
    medio: number;
    anular: number;
    mindinho: number;
  };
}

// Tipo para callback de atualização de sensores
export type SensorUpdateCallback = (data: SensorData) => void;

class BluetoothService {
  private isInitialized = false;
  private connectedDevice: BluetoothDevice | null = null;
  private gattServer: BluetoothRemoteGATTServer | null = null;
  private sensorCharacteristic: BluetoothRemoteGATTCharacteristic | null = null;
  private ledCharacteristic: BluetoothRemoteGATTCharacteristic | null = null;
  private sensorUpdateCallbacks: SensorUpdateCallback[] = [];

  constructor() {
    this.initializeBluetoothHandlers();
  }

  /**
   * Inicializa os handlers de Bluetooth
   */
  private initializeBluetoothHandlers(): void {
    if (typeof window !== 'undefined' && window.electronAPI) {
      window.electronAPI.bluetoothPairingRequest((_event: any, details: BluetoothPairingDetails) => {
        this.handlePairingRequest(details);
      });
      this.isInitialized = true;
    }
  }

  /**
   * Solicita conexão com dispositivo Bluetooth
   */
  async requestDevice(): Promise<{ id: string; name?: string; device: BluetoothDevice } | null> {
    try {
      if (!navigator.bluetooth) {
        console.error('Bluetooth não disponível neste navegador');
        alert('Web Bluetooth API não está disponível. Verifique se o navegador suporta Bluetooth.');
        return null;
      }

      console.log('Solicitando dispositivo Bluetooth...');

      // Busca pelo dispositivo ESP32 com filtros específicos
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ name: ESP32_CONFIG.deviceName }],
        optionalServices: [ESP32_CONFIG.bleService]
      });

      console.log('Dispositivo selecionado:', device);
      this.connectedDevice = device;

      // Adiciona listener para desconexão
      device.addEventListener('gattserverdisconnected', this.onDisconnected.bind(this));

      return {
        id: device.id,
        name: device.name || 'Dispositivo sem nome',
        device
      };
    } catch (error) {
      console.error('Erro ao solicitar dispositivo Bluetooth:', error);
      if (error instanceof Error) {
        alert(`Erro: ${error.message}`);
      }
      return null;
    }
  }

  /**
   * Conecta ao servidor GATT do dispositivo
   */
  async connectToDevice(): Promise<boolean> {
    try {
      if (!this.connectedDevice || !this.connectedDevice.gatt) {
        console.error('Nenhum dispositivo selecionado');
        return false;
      }

      console.log('Conectando ao servidor GATT...');
      this.gattServer = await this.connectedDevice.gatt.connect();
      console.log('Conectado ao GATT:', this.gattServer.connected);

      // Obtém o serviço BLE do ESP32
      console.log('Obtendo serviço BLE...');
      const service = await this.gattServer.getPrimaryService(ESP32_CONFIG.bleService);
      console.log('Serviço descoberto:', service.uuid);

      // Obtém a característica dos sensores
      console.log('Obtendo característica dos sensores...');
      this.sensorCharacteristic = await service.getCharacteristic(ESP32_CONFIG.sensorCharacteristic);
      console.log('Característica dos sensores descoberta:', this.sensorCharacteristic.uuid);

      // Obtém a característica do LED
      console.log('Obtendo característica do LED...');
      this.ledCharacteristic = await service.getCharacteristic(ESP32_CONFIG.ledCharacteristic);
      console.log('Característica do LED descoberta:', this.ledCharacteristic.uuid);

      // Adiciona listener para mudanças nos valores dos sensores
      this.sensorCharacteristic.addEventListener('characteristicvaluechanged', this.handleSensorValueChanged.bind(this));

      // Inicia notificações
      await this.sensorCharacteristic.startNotifications();
      console.log('Notificações de sensores iniciadas');

      // Lê o valor inicial
      const initialValue = await this.sensorCharacteristic.readValue();
      this.processSensorValue(initialValue);

      return this.gattServer.connected;
    } catch (error) {
      console.error('Erro ao conectar ao dispositivo:', error);
      return false;
    }
  }

  /**
   * Desconecta do dispositivo
   */
  disconnect(): void {
    if (this.sensorCharacteristic) {
      this.sensorCharacteristic.stopNotifications()
        .then(() => console.log('Notificações dos sensores paradas'))
        .catch(err => console.error('Erro ao parar notificações:', err));
    }

    if (this.gattServer && this.gattServer.connected) {
      this.gattServer.disconnect();
      console.log('Desconectado do dispositivo');
    }

    this.sensorCharacteristic = null;
    this.ledCharacteristic = null;
  }

  /**
   * Lista serviços disponíveis no dispositivo
   */
  async getServices(): Promise<string[]> {
    try {
      if (!this.gattServer) {
        console.error('Não conectado a nenhum dispositivo');
        return [];
      }

      const services = await this.gattServer.getPrimaryServices();
      return services.map(service => service.uuid);
    } catch (error) {
      console.error('Erro ao obter serviços:', error);
      return [];
    }
  }

  /**
   * Verifica se está conectado
   */
  isConnected(): boolean {
    return !!(this.gattServer && this.gattServer.connected);
  }

  /**
   * Obtém o dispositivo conectado atual
   */
  getConnectedDevice(): BluetoothDevice | null {
    return this.connectedDevice;
  }

  /**
   * Handler para desconexão
   */
  private onDisconnected(): void {
    console.log('Dispositivo desconectado');
    this.gattServer = null;
  }

  /**
   * Cancela solicitação de Bluetooth
   */
  cancelRequest(): void {
    if (window.electronAPI) {
      window.electronAPI.cancelBluetoothRequest();
    }
  }

  /**
   * Manipula solicitações de pareamento
   */
  private handlePairingRequest(details: BluetoothPairingDetails): void {
    const response: BluetoothPairingResponse = { confirmed: false };

    switch (details.pairingKind) {
      case 'confirm': {
        response.confirmed = window.confirm(
          `Deseja conectar ao dispositivo ${details.deviceId}?`
        );
        break;
      }
      case 'confirmPin': {
        response.confirmed = window.confirm(
          `O PIN ${details.pin} confere com o PIN exibido no dispositivo ${details.deviceId}?`
        );
        break;
      }
      case 'providePin': {
        const pin = window.prompt(`Forneça um PIN para ${details.deviceId}.`);
        if (pin) {
          response.pin = pin;
          response.confirmed = true;
        } else {
          response.confirmed = false;
        }
        break;
      }
    }

    if (window.electronAPI) {
      window.electronAPI.bluetoothPairingResponse(response);
    }
  }

  /**
   * Verifica se o Bluetooth está disponível
   */
  isBluetoothAvailable(): boolean {
    return !!(navigator.bluetooth);
  }

  /**
   * Handler para mudanças nos valores dos sensores
   */
  private handleSensorValueChanged(event: Event): void {
    const target = event.target as unknown as BluetoothRemoteGATTCharacteristic;
    if (target.value) {
      this.processSensorValue(target.value);
    }
  }

  /**
   * Processa o valor recebido dos sensores
   */
  private processSensorValue(value: DataView): void {
    const decoder = new TextDecoder();
    const decodedValue = decoder.decode(value);
    console.log('Valor dos sensores recebido:', decodedValue);

    // Os valores vêm separados por espaço: "polegar indicador medio anular mindinho"
    const values = decodedValue.split(' ').map(v => parseInt(v.trim()));

    if (values.length >= 5) {
      // Normaliza valores de 0-4095 para 0-100 (ADC de 12 bits do ESP32)
      const sensorData: SensorData = {
        polegar: Math.round((values[0] / 4095) * 100),
        indicador: Math.round((values[1] / 4095) * 100),
        medio: Math.round((values[2] / 4095) * 100),
        anular: Math.round((values[3] / 4095) * 100),
        mindinho: Math.round((values[4] / 4095) * 100),
        timestamp: this.getDateTime(),
        rawValues: {
          polegar: values[0],
          indicador: values[1],
          medio: values[2],
          anular: values[3],
          mindinho: values[4]
        }
      };

      console.log('Dados normalizados:', sensorData);
      console.log('Número de callbacks registrados:', this.sensorUpdateCallbacks.length);

      // Notifica todos os callbacks registrados
      this.sensorUpdateCallbacks.forEach(callback => {
        console.log('Chamando callback...');
        callback(sensorData);
      });
    }
  }

  /**
   * Registra callback para atualizações dos sensores
   */
  onSensorUpdate(callback: SensorUpdateCallback): void {
    this.sensorUpdateCallbacks.push(callback);
  }

  /**
   * Remove callback de atualizações dos sensores
   */
  offSensorUpdate(callback: SensorUpdateCallback): void {
    this.sensorUpdateCallbacks = this.sensorUpdateCallbacks.filter(cb => cb !== callback);
  }

  /**
   * Escreve um valor na característica do LED
   */
  async writeToLED(value: number): Promise<boolean> {
    try {
      if (!this.ledCharacteristic || !this.isConnected()) {
        console.error('Dispositivo não conectado ou característica LED não disponível');
        return false;
      }

      const data = new Uint8Array([value]);
      await this.ledCharacteristic.writeValue(data);
      console.log('Valor escrito no LED:', value);
      return true;
    } catch (error) {
      console.error('Erro ao escrever no LED:', error);
      return false;
    }
  }

  /**
   * Obtém data e hora atual formatada
   */
  private getDateTime(): string {
    const currentdate = new Date();
    const day = String(currentdate.getDate()).padStart(2, '0');
    const month = String(currentdate.getMonth() + 1).padStart(2, '0');
    const year = currentdate.getFullYear();
    const hours = String(currentdate.getHours()).padStart(2, '0');
    const minutes = String(currentdate.getMinutes()).padStart(2, '0');
    const seconds = String(currentdate.getSeconds()).padStart(2, '0');

    return `${day}/${month}/${year} - ${hours}:${minutes}:${seconds}`;
  }
}

// Exporta instância singleton
export const bluetoothService = new BluetoothService();
