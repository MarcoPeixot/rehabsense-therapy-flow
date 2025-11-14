# 🔵 Configuração Bluetooth - RehabSense

## 📋 Visão Geral

O RehabSense possui integração completa com sensores Bluetooth ESP32 para monitoramento em tempo real da força de preensão dos dedos durante exercícios terapêuticos.

## 🛠️ Requisitos

### Hardware
- **ESP32C3 MiniPlus** ou compatível
- **Nome do dispositivo:** `E32ZE`
- **Sensores:** 5 sensores de força (FSR) conectados aos pinos analógicos

### Software
- Navegador com suporte a **Web Bluetooth API**:
  - ✅ Google Chrome 56+
  - ✅ Microsoft Edge 79+
  - ✅ Opera 43+
  - ⚠️ Firefox (requer ativação manual)
  - ❌ Safari (não suportado)

## 🔧 Configuração do ESP32

### UUIDs dos Serviços BLE

```javascript
BLE Service:     19b10000-e8f0-537e-4f6c-d104768a1214
LED Characteristic:    19b10002-e8f0-537e-4f6c-d104768a1214
Sensor Characteristic: 19b10001-e8f0-537e-4f6c-d104768a1214
```

### Formato dos Dados

Os dados dos sensores são enviados como string separada por espaços:

```
"polegar indicador medio anular mindinho"
Exemplo: "2048 1856 2200 1920 1750"
```

- **Range:** 0-4095 (ADC de 12 bits do ESP32)
- **Normalização:** Convertido para 0-100% no frontend

## 📱 Como Usar

### 1. Habilitar Bluetooth no Navegador

#### Chrome/Edge
Nenhuma configuração adicional necessária.

#### Firefox
1. Digite `about:config` na barra de endereços
2. Aceite o aviso
3. Busque por `dom.webbluetoothenabledForInsecureOrigins`
4. Altere para `true`

### 2. Conectar ao Dispositivo

1. Navegue para uma **Sessão de Exercícios**
2. Clique em **"Escanear Dispositivos"** no card de Bluetooth
3. Selecione o dispositivo **E32ZE** na janela do navegador
4. Aguarde a conexão ser estabelecida

### 3. Monitorar Dados

Quando conectado, você verá:
- ✅ Status de conexão
- 🔋 Nível de bateria (simulado)
- 📡 Qualidade do sinal
- 🕐 Timestamp da última leitura

Durante o exercício, os dados em tempo real mostram:
- Força de cada dedo (0-100%)
- Força média
- Força máxima
- Força mínima

## 🏗️ Estrutura de Arquivos

```
src/
├── services/
│   └── bluetooth.ts              # Serviço principal de Bluetooth
├── components/
│   └── BluetoothConnection.tsx   # Componente UI de conexão
└── pages/
    └── SessionExecution.tsx      # Integração na execução de sessões
```

## 🔌 API do Serviço Bluetooth

### Métodos Principais

```typescript
// Solicitar dispositivo
bluetoothService.requestDevice(): Promise<BluetoothDeviceInfo | null>

// Conectar
bluetoothService.connectToDevice(): Promise<boolean>

// Desconectar
bluetoothService.disconnect(): void

// Verificar se está conectado
bluetoothService.isConnected(): boolean

// Registrar callback para dados
bluetoothService.onSensorUpdate(callback: (data: SensorData) => void): void

// Remover callback
bluetoothService.offSensorUpdate(callback: SensorUpdateCallback): void

// Escrever no LED
bluetoothService.writeToLED(value: number): Promise<boolean>
```

### Interface SensorData

```typescript
interface SensorData {
  polegar: number;      // 0-100%
  indicador: number;    // 0-100%
  medio: number;        // 0-100%
  anular: number;       // 0-100%
  mindinho: number;     // 0-100%
  timestamp: string;    // DD/MM/YYYY - HH:MM:SS
  rawValues: {
    polegar: number;    // 0-4095 (valor bruto do ADC)
    indicador: number;
    medio: number;
    anular: number;
    mindinho: number;
  };
}
```

## 🧪 Testes

### Testar Conexão
1. Ligue o ESP32
2. Verifique se o LED azul do Bluetooth está piscando
3. Abra o RehabSense no navegador suportado
4. Vá para Sessões > Execute uma sessão
5. Clique em "Escanear Dispositivos"
6. Conecte ao dispositivo

### Testar Leitura de Sensores
1. Com dispositivo conectado
2. Pressione os sensores físicos
3. Verifique se os valores aparecem em tempo real na interface
4. Os valores devem mudar conforme a pressão aplicada

## 🐛 Troubleshooting

### Dispositivo não aparece na busca
- ✅ Verifique se o ESP32 está ligado
- ✅ Certifique-se de que o nome do dispositivo é `E32ZE`
- ✅ Tente desligar e ligar o Bluetooth do computador
- ✅ Use um navegador suportado (Chrome/Edge)

### Conexão falha
- ✅ Reinicie o ESP32
- ✅ Limpe o cache do navegador
- ✅ Verifique se outro dispositivo não está conectado ao ESP32
- ✅ Tente parear o dispositivo nas configurações do sistema primeiro

### Dados não aparecem
- ✅ Verifique se a conexão está estabelecida (badge "Conectado")
- ✅ Verifique o console do navegador para erros
- ✅ Certifique-se de que os UUIDs do ESP32 correspondem aos configurados
- ✅ Teste enviar dados manualmente do ESP32

### Erro "Bluetooth not available"
- ✅ Verifique se está usando HTTPS (ou localhost para desenvolvimento)
- ✅ Confirme que o navegador suporta Web Bluetooth API
- ✅ Verifique permissões de Bluetooth no sistema operacional

## 🔒 Segurança

- ✅ Web Bluetooth API requer **HTTPS** em produção
- ✅ Exceção: `localhost` pode usar HTTP em desenvolvimento
- ✅ Usuário deve aprovar explicitamente a conexão
- ✅ Dados são transmitidos diretamente navegador ↔ ESP32

## 📊 Integração com Backend

Os dados dos sensores são automaticamente salvos no backend durante a execução de exercícios:

```typescript
// POST /sessions/:sessionId/exercises/:exerciseId/sensor-reading
{
  polegar: 85,
  indicador: 78,
  medio: 72,
  anular: 65,
  mindinho: 60,
  rawValues: {
    polegar: 3482,
    indicador: 3195,
    medio: 2949,
    anular: 2662,
    mindinho: 2457
  }
}
```

## 📈 Métricas Calculadas

Durante o exercício, são calculadas automaticamente:
- **Força Média:** Média de todos os dedos
- **Força Máxima:** Maior valor registrado
- **Força Mínima:** Menor valor registrado
- **Consistência:** Variação entre leituras
- **Taxa de Conclusão:** Percentual de exercício completado

## 🚀 Próximos Passos

- [ ] Implementar gráficos em tempo real
- [ ] Adicionar calibração de sensores
- [ ] Suporte para múltiplos dispositivos
- [ ] Modo offline com sincronização posterior
- [ ] Alertas de força excessiva/insuficiente

## 📞 Suporte

Para problemas técnicos:
1. Verifique o console do navegador (`F12`)
2. Consulte a documentação do ESP32
3. Verifique se todos os UUIDs estão corretos
4. Entre em contato com a equipe de desenvolvimento

---

**Versão:** 1.0.0
**Última atualização:** 14/11/2025
**Compatibilidade:** ESP32C3 MiniPlus com BLE
