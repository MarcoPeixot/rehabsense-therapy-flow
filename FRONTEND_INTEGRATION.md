# 📚 Documentação de Integração Backend - Frontend

**Base URL:** `http://localhost:3000`

**Autenticação:** JWT Bearer Token (exceto endpoints de signup/signin)

---

## 🔐 1. Autenticação (`/auth`)

### 1.1 Cadastro de Usuário
**POST** `/auth/signup`

**Body:**
```json
{
  "name": "Dr. João Silva",
  "email": "joao@example.com",
  "password": "senha123",
  "registerId": "CRM-12345"
}
```

**Response (201):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Dr. João Silva",
    "email": "joao@example.com",
    "registerId": "CRM-12345"
  }
}
```

---

### 1.2 Login
**POST** `/auth/signin`

**Body:**
```json
{
  "email": "joao@example.com",
  "password": "senha123"
}
```

**Response (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Dr. João Silva",
    "email": "joao@example.com",
    "registerId": "CRM-12345"
  }
}
```

---

### 1.3 Obter Usuário Atual
**GET** `/auth/me`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response (200):**
```json
{
  "id": 1,
  "name": "Dr. João Silva",
  "email": "joao@example.com",
  "registerId": "CRM-12345"
}
```

---

## 👤 2. Pacientes (`/pacientes`)

> ⚠️ **Todos os endpoints requerem autenticação**

### 2.1 Criar Paciente
**POST** `/pacientes`

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Body:**
```json
{
  "name": "Maria Santos",
  "age": 45,
  "condition": "Artrite reumatoide",
  "terapeutaId": 1
}
```

**Response (201):**
```json
{
  "id": 1,
  "name": "Maria Santos",
  "age": 45,
  "condition": "Artrite reumatoide",
  "terapeutaId": 1
}
```

---

### 2.2 Listar Todos os Pacientes
**GET** `/pacientes`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response (200):**
```json
[
  {
    "id": 1,
    "name": "Maria Santos",
    "age": 45,
    "condition": "Artrite reumatoide",
    "terapeutaId": 1,
    "terapeuta": {
      "id": 1,
      "name": "Dr. João Silva",
      "email": "joao@example.com"
    }
  }
]
```

---

### 2.3 Obter Paciente por ID
**GET** `/pacientes/:id`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response (200):**
```json
{
  "id": 1,
  "name": "Maria Santos",
  "age": 45,
  "condition": "Artrite reumatoide",
  "terapeutaId": 1,
  "terapeuta": {
    "id": 1,
    "name": "Dr. João Silva"
  }
}
```

---

### 2.4 Obter Exercícios do Paciente
**GET** `/pacientes/:id/exercises`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response (200):**
```json
[
  {
    "id": 1,
    "nome": "Exercício de Pinça",
    "tipoGripe": "pinça",
    "segDuracao": 30,
    "pctForca": 50,
    "repeticoes": 10,
    "segIntervalo": 15,
    "lado": "direita",
    "pacienteId": 1,
    "observacoes": "Aumentar progressivamente",
    "codigoDSL": "GRIP pinça FORCE 50% DURATION 30s REPS 10 SIDE direita",
    "createdAt": "2025-11-14T10:00:00.000Z",
    "updatedAt": "2025-11-14T10:00:00.000Z"
  }
]
```

---

### 2.5 Obter Sessões do Paciente
**GET** `/pacientes/:id/sessions`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response (200):**
```json
[
  {
    "id": 1,
    "pacienteId": 1,
    "status": "scheduled",
    "scheduledAt": "2025-11-15T14:00:00.000Z",
    "startedAt": null,
    "completedAt": null,
    "createdAt": "2025-11-14T10:00:00.000Z",
    "updatedAt": "2025-11-14T10:00:00.000Z",
    "exerciseResults": []
  }
]
```

---

### 2.6 Atualizar Paciente
**PATCH** `/pacientes/:id`

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Body:**
```json
{
  "age": 46,
  "condition": "Artrite reumatoide em tratamento"
}
```

**Response (200):**
```json
{
  "id": 1,
  "name": "Maria Santos",
  "age": 46,
  "condition": "Artrite reumatoide em tratamento",
  "terapeutaId": 1
}
```

---

### 2.7 Deletar Paciente
**DELETE** `/pacientes/:id`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response (200):**
```json
{
  "message": "Paciente deletado com sucesso"
}
```

---

## 💪 3. Exercícios (`/exercises`)

> ⚠️ **Todos os endpoints requerem autenticação**

### 3.1 Criar Exercício
**POST** `/exercises`

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Body:**
```json
{
  "nome": "Exercício de Pinça Lateral",
  "tipoGripe": "pinça",
  "segDuracao": 30,
  "pctForca": 50,
  "repeticoes": 10,
  "segIntervalo": 15,
  "lado": "direita",
  "pacienteId": 1,
  "observacoes": "Iniciar com 50% de força",
  "codigoDSL": "GRIP pinça FORCE 50% DURATION 30s REPS 10 SIDE direita"
}
```

**Validações:**
- `tipoGripe`: deve ser `"pinça"`, `"gancho"`, `"esférica"`, `"cilíndrica"` ou `"lateral"`
- `segDuracao`: 1-600 segundos
- `pctForca`: 1-100%
- `repeticoes`: 1-100
- `segIntervalo`: 0-300 segundos (opcional)
- `lado`: `"direita"`, `"esquerda"` ou `"ambos"` (opcional)

**Response (201):**
```json
{
  "id": 1,
  "nome": "Exercício de Pinça Lateral",
  "tipoGripe": "pinça",
  "segDuracao": 30,
  "pctForca": 50,
  "repeticoes": 10,
  "segIntervalo": 15,
  "lado": "direita",
  "pacienteId": 1,
  "observacoes": "Iniciar com 50% de força",
  "codigoDSL": "GRIP pinça FORCE 50% DURATION 30s REPS 10 SIDE direita",
  "createdAt": "2025-11-14T10:00:00.000Z",
  "updatedAt": "2025-11-14T10:00:00.000Z"
}
```

---

### 3.2 Gerar Exercício com IA
**POST** `/exercises/generate`

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Body:**
```json
{
  "prompt": "Crie um exercício de fortalecimento de pinça para paciente com artrite",
  "pacienteId": 1
}
```

**Response (201):**
```json
{
  "exercise": {
    "id": 2,
    "nome": "Fortalecimento de Pinça Progressivo",
    "tipoGripe": "pinça",
    "segDuracao": 20,
    "pctForca": 40,
    "repeticoes": 8,
    "segIntervalo": 20,
    "lado": "ambos",
    "pacienteId": 1,
    "observacoes": "Exercício adaptado para artrite. Começar devagar.",
    "codigoDSL": "GRIP pinça FORCE 40% DURATION 20s REPS 8 SIDE ambos",
    "createdAt": "2025-11-14T10:30:00.000Z",
    "updatedAt": "2025-11-14T10:30:00.000Z"
  },
  "aiResponse": "Exercício gerado com parâmetros adaptados para paciente com artrite..."
}
```

---

### 3.3 Listar Todos os Exercícios
**GET** `/exercises`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response (200):**
```json
[
  {
    "id": 1,
    "nome": "Exercício de Pinça Lateral",
    "tipoGripe": "pinça",
    "segDuracao": 30,
    "pctForca": 50,
    "repeticoes": 10,
    "segIntervalo": 15,
    "lado": "direita",
    "pacienteId": 1,
    "observacoes": "Iniciar com 50% de força",
    "codigoDSL": "GRIP pinça FORCE 50% DURATION 30s REPS 10 SIDE direita",
    "createdAt": "2025-11-14T10:00:00.000Z",
    "updatedAt": "2025-11-14T10:00:00.000Z"
  }
]
```

---

### 3.4 Obter Exercício por ID
**GET** `/exercises/:id`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response (200):**
```json
{
  "id": 1,
  "nome": "Exercício de Pinça Lateral",
  "tipoGripe": "pinça",
  "segDuracao": 30,
  "pctForca": 50,
  "repeticoes": 10,
  "segIntervalo": 15,
  "lado": "direita",
  "pacienteId": 1,
  "observacoes": "Iniciar com 50% de força",
  "codigoDSL": "GRIP pinça FORCE 50% DURATION 30s REPS 10 SIDE direita",
  "createdAt": "2025-11-14T10:00:00.000Z",
  "updatedAt": "2025-11-14T10:00:00.000Z",
  "paciente": {
    "id": 1,
    "name": "Maria Santos"
  }
}
```

---

### 3.5 Atualizar Exercício
**PATCH** `/exercises/:id`

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Body:**
```json
{
  "pctForca": 60,
  "observacoes": "Paciente evoluindo bem, aumentar força"
}
```

**Response (200):**
```json
{
  "id": 1,
  "nome": "Exercício de Pinça Lateral",
  "tipoGripe": "pinça",
  "segDuracao": 30,
  "pctForca": 60,
  "repeticoes": 10,
  "segIntervalo": 15,
  "lado": "direita",
  "pacienteId": 1,
  "observacoes": "Paciente evoluindo bem, aumentar força",
  "codigoDSL": "GRIP pinça FORCE 50% DURATION 30s REPS 10 SIDE direita",
  "createdAt": "2025-11-14T10:00:00.000Z",
  "updatedAt": "2025-11-14T11:00:00.000Z"
}
```

---

### 3.6 Deletar Exercício
**DELETE** `/exercises/:id`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response (200):**
```json
{
  "message": "Exercício deletado com sucesso"
}
```

---

## 📅 4. Sessões (`/sessions`)

> ⚠️ **Todos os endpoints requerem autenticação**

### 4.1 Criar Sessão
**POST** `/sessions`

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Body:**
```json
{
  "pacienteId": 1,
  "scheduledAt": "2025-11-15T14:00:00.000Z",
  "exerciseIds": [1, 2, 3]
}
```

**Response (201):**
```json
{
  "id": 1,
  "pacienteId": 1,
  "status": "scheduled",
  "scheduledAt": "2025-11-15T14:00:00.000Z",
  "startedAt": null,
  "completedAt": null,
  "createdAt": "2025-11-14T10:00:00.000Z",
  "updatedAt": "2025-11-14T10:00:00.000Z",
  "exerciseResults": [
    {
      "id": 1,
      "sessionId": 1,
      "exerciseId": 1,
      "status": "pending",
      "completedAt": null,
      "metrics": null
    },
    {
      "id": 2,
      "sessionId": 1,
      "exerciseId": 2,
      "status": "pending",
      "completedAt": null,
      "metrics": null
    },
    {
      "id": 3,
      "sessionId": 1,
      "exerciseId": 3,
      "status": "pending",
      "completedAt": null,
      "metrics": null
    }
  ]
}
```

---

### 4.2 Listar Todas as Sessões
**GET** `/sessions`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response (200):**
```json
[
  {
    "id": 1,
    "pacienteId": 1,
    "status": "scheduled",
    "scheduledAt": "2025-11-15T14:00:00.000Z",
    "startedAt": null,
    "completedAt": null,
    "createdAt": "2025-11-14T10:00:00.000Z",
    "updatedAt": "2025-11-14T10:00:00.000Z",
    "paciente": {
      "id": 1,
      "name": "Maria Santos"
    }
  }
]
```

---

### 4.3 Obter Sessão por ID
**GET** `/sessions/:id`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response (200):**
```json
{
  "id": 1,
  "pacienteId": 1,
  "status": "scheduled",
  "scheduledAt": "2025-11-15T14:00:00.000Z",
  "startedAt": null,
  "completedAt": null,
  "createdAt": "2025-11-14T10:00:00.000Z",
  "updatedAt": "2025-11-14T10:00:00.000Z",
  "paciente": {
    "id": 1,
    "name": "Maria Santos",
    "age": 45,
    "condition": "Artrite reumatoide"
  },
  "exerciseResults": [
    {
      "id": 1,
      "sessionId": 1,
      "exerciseId": 1,
      "status": "pending",
      "completedAt": null,
      "metrics": null,
      "exercise": {
        "id": 1,
        "nome": "Exercício de Pinça Lateral",
        "tipoGripe": "pinça"
      }
    }
  ]
}
```

---

### 4.4 Iniciar Sessão
**PATCH** `/sessions/:id/start`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response (200):**
```json
{
  "id": 1,
  "pacienteId": 1,
  "status": "in_progress",
  "scheduledAt": "2025-11-15T14:00:00.000Z",
  "startedAt": "2025-11-15T14:05:00.000Z",
  "completedAt": null,
  "createdAt": "2025-11-14T10:00:00.000Z",
  "updatedAt": "2025-11-15T14:05:00.000Z"
}
```

---

### 4.5 Completar Sessão
**PATCH** `/sessions/:id/complete`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response (200):**
```json
{
  "id": 1,
  "pacienteId": 1,
  "status": "completed",
  "scheduledAt": "2025-11-15T14:00:00.000Z",
  "startedAt": "2025-11-15T14:05:00.000Z",
  "completedAt": "2025-11-15T14:45:00.000Z",
  "createdAt": "2025-11-14T10:00:00.000Z",
  "updatedAt": "2025-11-15T14:45:00.000Z"
}
```

---

### 4.6 Cancelar Sessão
**PATCH** `/sessions/:id/cancel`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response (200):**
```json
{
  "id": 1,
  "pacienteId": 1,
  "status": "cancelled",
  "scheduledAt": "2025-11-15T14:00:00.000Z",
  "startedAt": null,
  "completedAt": null,
  "createdAt": "2025-11-14T10:00:00.000Z",
  "updatedAt": "2025-11-15T13:00:00.000Z"
}
```

---

### 4.7 Completar Exercício da Sessão
**POST** `/sessions/:id/exercises/:exerciseId/complete`

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Body:**
```json
{
  "status": "completed",
  "metrics": {
    "avgForce": 48.5,
    "maxForce": 52.3,
    "minForce": 45.1,
    "consistency": 0.92,
    "completionRate": 1.0
  }
}
```

**Status válidos:** `"completed"` ou `"skipped"`

**Response (200):**
```json
{
  "id": 1,
  "sessionId": 1,
  "exerciseId": 1,
  "status": "completed",
  "completedAt": "2025-11-15T14:20:00.000Z",
  "metrics": {
    "avgForce": 48.5,
    "maxForce": 52.3,
    "minForce": 45.1,
    "consistency": 0.92,
    "completionRate": 1.0
  },
  "createdAt": "2025-11-14T10:00:00.000Z"
}
```

---

### 4.8 Salvar Leitura de Sensor (Individual)
**POST** `/sessions/:id/exercises/:exerciseId/sensor-reading`

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Body:**
```json
{
  "polegar": 85,
  "indicador": 78,
  "medio": 72,
  "anular": 65,
  "mindinho": 60,
  "rawValues": {
    "polegar": 3482,
    "indicador": 3195,
    "medio": 2949,
    "anular": 2662,
    "mindinho": 2457
  }
}
```

**Validações:**
- Valores normalizados (`polegar`, `indicador`, etc.): 0-100
- Valores brutos ADC (`rawValues`): 0-4095

**Response (201):**
```json
{
  "id": 1,
  "exerciseResultId": 1,
  "polegar": 85,
  "indicador": 78,
  "medio": 72,
  "anular": 65,
  "mindinho": 60,
  "rawPolegar": 3482,
  "rawIndicador": 3195,
  "rawMedio": 2949,
  "rawAnular": 2662,
  "rawMindinho": 2457,
  "timestamp": "2025-11-15T14:20:15.000Z",
  "createdAt": "2025-11-15T14:20:15.000Z"
}
```

---

### 4.9 Salvar Leituras de Sensor em Lote
**POST** `/sessions/sensor-readings/batch`

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Body:**
```json
{
  "exerciseResultId": 1,
  "readings": [
    {
      "polegar": 85,
      "indicador": 78,
      "medio": 72,
      "anular": 65,
      "mindinho": 60,
      "rawValues": {
        "polegar": 3482,
        "indicador": 3195,
        "medio": 2949,
        "anular": 2662,
        "mindinho": 2457
      }
    },
    {
      "polegar": 87,
      "indicador": 80,
      "medio": 74,
      "anular": 67,
      "mindinho": 62,
      "rawValues": {
        "polegar": 3564,
        "indicador": 3277,
        "medio": 3031,
        "anular": 2744,
        "mindinho": 2539
      }
    }
  ]
}
```

**Response (201):**
```json
{
  "count": 2,
  "readings": [
    {
      "id": 1,
      "exerciseResultId": 1,
      "polegar": 85,
      "indicador": 78,
      "medio": 72,
      "anular": 65,
      "mindinho": 60,
      "timestamp": "2025-11-15T14:20:15.000Z"
    },
    {
      "id": 2,
      "exerciseResultId": 1,
      "polegar": 87,
      "indicador": 80,
      "medio": 74,
      "anular": 67,
      "mindinho": 62,
      "timestamp": "2025-11-15T14:20:16.000Z"
    }
  ]
}
```

---

### 4.10 Obter Leituras de Sensor
**GET** `/sessions/:id/exercises/:exerciseId/sensor-readings`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response (200):**
```json
[
  {
    "id": 1,
    "exerciseResultId": 1,
    "polegar": 85,
    "indicador": 78,
    "medio": 72,
    "anular": 65,
    "mindinho": 60,
    "rawPolegar": 3482,
    "rawIndicador": 3195,
    "rawMedio": 2949,
    "rawAnular": 2662,
    "rawMindinho": 2457,
    "timestamp": "2025-11-15T14:20:15.000Z",
    "createdAt": "2025-11-15T14:20:15.000Z"
  }
]
```

---

### 4.11 Gerar Relatório da Sessão
**GET** `/sessions/:id/report`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response (200):**
```json
{
  "session": {
    "id": 1,
    "pacienteId": 1,
    "status": "completed",
    "scheduledAt": "2025-11-15T14:00:00.000Z",
    "startedAt": "2025-11-15T14:05:00.000Z",
    "completedAt": "2025-11-15T14:45:00.000Z",
    "duration": 2400
  },
  "paciente": {
    "id": 1,
    "name": "Maria Santos",
    "age": 45,
    "condition": "Artrite reumatoide"
  },
  "summary": {
    "totalExercises": 3,
    "completedExercises": 2,
    "skippedExercises": 1,
    "completionRate": 0.67
  },
  "exerciseResults": [
    {
      "id": 1,
      "exercise": {
        "id": 1,
        "nome": "Exercício de Pinça Lateral",
        "tipoGripe": "pinça"
      },
      "status": "completed",
      "completedAt": "2025-11-15T14:20:00.000Z",
      "metrics": {
        "avgForce": 48.5,
        "maxForce": 52.3,
        "minForce": 45.1
      },
      "sensorReadingsCount": 120
    }
  ]
}
```

---

### 4.12 Atualizar Sessão
**PATCH** `/sessions/:id`

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Body:**
```json
{
  "scheduledAt": "2025-11-16T10:00:00.000Z"
}
```

**Response (200):**
```json
{
  "id": 1,
  "pacienteId": 1,
  "status": "scheduled",
  "scheduledAt": "2025-11-16T10:00:00.000Z",
  "startedAt": null,
  "completedAt": null,
  "createdAt": "2025-11-14T10:00:00.000Z",
  "updatedAt": "2025-11-14T11:00:00.000Z"
}
```

---

### 4.13 Deletar Sessão
**DELETE** `/sessions/:id`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response (200):**
```json
{
  "message": "Sessão deletada com sucesso"
}
```

---

## 🤖 5. Inteligência Artificial

A geração de exercícios com IA está integrada no módulo de exercícios através do endpoint:

**POST** `/exercises/generate`

Consulte a seção **3.2 Gerar Exercício com IA** para detalhes completos.

---

## 🔒 Segurança e Autenticação

### Fluxo de Autenticação

1. **Login:** Faça POST em `/auth/signin` com email e senha
2. **Receba o Token:** Guarde o `access_token` retornado
3. **Use o Token:** Inclua em todas as requisições subsequentes:
   ```
   Authorization: Bearer {access_token}
   ```

### Exemplo com Axios (React/Next.js)

```javascript
import axios from 'axios';

// Configurar instância do axios
const api = axios.create({
  baseURL: 'http://localhost:3000',
});

// Interceptor para adicionar token automaticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Exemplo de uso
async function login(email, password) {
  const response = await api.post('/auth/signin', { email, password });
  localStorage.setItem('access_token', response.data.access_token);
  return response.data;
}

async function getPacientes() {
  const response = await api.get('/pacientes');
  return response.data;
}
```

### Exemplo com Fetch

```javascript
// Login
const loginResponse = await fetch('http://localhost:3000/auth/signin', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'joao@example.com',
    password: 'senha123',
  }),
});

const { access_token } = await loginResponse.json();

// Usar token em outras requisições
const pacientesResponse = await fetch('http://localhost:3000/pacientes', {
  headers: {
    'Authorization': `Bearer ${access_token}`,
  },
});

const pacientes = await pacientesResponse.json();
```

---

## 📊 Status e Enums

### Status de Sessão
- `"scheduled"` - Sessão agendada
- `"in_progress"` - Sessão em andamento
- `"completed"` - Sessão completada
- `"cancelled"` - Sessão cancelada

### Status de Exercício na Sessão
- `"pending"` - Exercício pendente
- `"completed"` - Exercício completado
- `"skipped"` - Exercício pulado

### Tipos de Gripe
- `"pinça"` - Preensão em pinça
- `"gancho"` - Preensão em gancho
- `"esférica"` - Preensão esférica
- `"cilíndrica"` - Preensão cilíndrica
- `"lateral"` - Preensão lateral

### Lados
- `"direita"` - Mão direita
- `"esquerda"` - Mão esquerda
- `"ambos"` - Ambas as mãos

---

## ❌ Tratamento de Erros

### Códigos de Status HTTP

- `200` - Sucesso
- `201` - Criado com sucesso
- `400` - Requisição inválida (dados inválidos)
- `401` - Não autorizado (token inválido ou ausente)
- `404` - Recurso não encontrado
- `500` - Erro interno do servidor

### Formato de Erro

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### Exemplo de Tratamento de Erro

```javascript
try {
  const response = await api.post('/pacientes', pacienteData);
  return response.data;
} catch (error) {
  if (error.response) {
    // Erro de validação ou servidor
    console.error('Error:', error.response.data.message);
    console.error('Status:', error.response.status);
  } else if (error.request) {
    // Sem resposta do servidor
    console.error('No response from server');
  } else {
    // Erro na configuração da requisição
    console.error('Error:', error.message);
  }
}
```

---

## 🚀 Fluxos Completos de Uso

### Fluxo 1: Cadastro e Login de Terapeuta

```javascript
// 1. Cadastrar terapeuta
const signupData = {
  name: "Dr. João Silva",
  email: "joao@example.com",
  password: "senha123",
  registerId: "CRM-12345"
};

const signupResponse = await api.post('/auth/signup', signupData);
const token = signupResponse.data.access_token;

// 2. Guardar token
localStorage.setItem('access_token', token);

// 3. Verificar usuário logado
const user = await api.get('/auth/me');
console.log('Logged in as:', user.data.name);
```

---

### Fluxo 2: Criar Paciente e Exercício

```javascript
// 1. Criar paciente
const paciente = await api.post('/pacientes', {
  name: "Maria Santos",
  age: 45,
  condition: "Artrite reumatoide",
  terapeutaId: 1
});

// 2. Gerar exercício com IA para o paciente
const exercise = await api.post('/exercises/generate', {
  prompt: "Exercício de fortalecimento de pinça para artrite leve",
  pacienteId: paciente.data.id
});

console.log('Exercício criado:', exercise.data);
```

---

### Fluxo 3: Criar e Executar Sessão

```javascript
// 1. Criar sessão
const session = await api.post('/sessions', {
  pacienteId: 1,
  scheduledAt: new Date().toISOString(),
  exerciseIds: [1, 2, 3]
});

// 2. Iniciar sessão
await api.patch(`/sessions/${session.data.id}/start`);

// 3. Completar primeiro exercício
await api.post(`/sessions/${session.data.id}/exercises/1/complete`, {
  status: "completed",
  metrics: {
    avgForce: 48.5,
    maxForce: 52.3,
    minForce: 45.1
  }
});

// 4. Salvar leituras de sensor durante exercício
await api.post(`/sessions/${session.data.id}/exercises/2/sensor-reading`, {
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
});

// 5. Completar sessão
await api.patch(`/sessions/${session.data.id}/complete`);

// 6. Gerar relatório
const report = await api.get(`/sessions/${session.data.id}/report`);
console.log('Relatório:', report.data);
```

---

### Fluxo 4: Dashboard - Listar Dados

```javascript
// Dashboard do terapeuta

// 1. Listar todos os pacientes
const pacientes = await api.get('/pacientes');

// 2. Para cada paciente, buscar sessões recentes
for (const paciente of pacientes.data) {
  const sessions = await api.get(`/pacientes/${paciente.id}/sessions`);
  console.log(`${paciente.name}: ${sessions.data.length} sessões`);
}

// 3. Listar todas as sessões (ordenadas)
const allSessions = await api.get('/sessions');

// 4. Ver detalhes de uma sessão específica
const sessionDetails = await api.get(`/sessions/${allSessions.data[0].id}`);
```

---

## 🧪 Testando a API

### Com cURL

```bash
# Login
curl -X POST http://localhost:3000/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@example.com","password":"senha123"}'

# Listar pacientes (substitua {TOKEN} pelo token recebido)
curl http://localhost:3000/pacientes \
  -H "Authorization: Bearer {TOKEN}"

# Criar paciente
curl -X POST http://localhost:3000/pacientes \
  -H "Authorization: Bearer {TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Maria Santos",
    "age":45,
    "condition":"Artrite",
    "terapeutaId":1
  }'
```

### Com Postman

1. Importe a collection com base nesta documentação
2. Configure variável de ambiente `{{baseUrl}}` = `http://localhost:3000`
3. Após login, configure variável `{{token}}` com o access_token
4. Use `{{token}}` no header Authorization como `Bearer {{token}}`

---

## 📦 Modelo de Dados

### User
```typescript
{
  id: number;
  name: string;
  email: string;
  password: string; // hash
  registerId: string; // CRM, CRF, etc
  pacientes: Paciente[];
}
```

### Paciente
```typescript
{
  id: number;
  name: string;
  age: number;
  condition: string;
  terapeutaId: number;
  terapeuta: User;
  exercicios: Exercise[];
  sessions: Session[];
}
```

### Exercise
```typescript
{
  id: number;
  nome: string;
  tipoGripe: "pinça" | "gancho" | "esférica" | "cilíndrica" | "lateral";
  segDuracao: number; // 1-600 segundos
  pctForca: number; // 1-100%
  repeticoes: number; // 1-100
  segIntervalo?: number; // 0-300 segundos
  lado?: "direita" | "esquerda" | "ambos";
  observacoes?: string;
  codigoDSL?: string;
  pacienteId?: number;
  paciente?: Paciente;
  createdAt: Date;
  updatedAt: Date;
}
```

### Session
```typescript
{
  id: number;
  pacienteId: number;
  paciente: Paciente;
  status: "scheduled" | "in_progress" | "completed" | "cancelled";
  scheduledAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  exerciseResults: ExerciseResult[];
  createdAt: Date;
  updatedAt: Date;
}
```

### ExerciseResult
```typescript
{
  id: number;
  sessionId: number;
  session: Session;
  exerciseId: number;
  exercise: Exercise;
  status: "pending" | "completed" | "skipped";
  completedAt?: Date;
  metrics?: Record<string, any>;
  sensorReadings: SensorReading[];
  createdAt: Date;
}
```

### SensorReading
```typescript
{
  id: number;
  exerciseResultId: number;
  exerciseResult: ExerciseResult;
  // Valores normalizados (0-100)
  polegar: number;
  indicador: number;
  medio: number;
  anular: number;
  mindinho: number;
  // Valores brutos ADC (0-4095)
  rawPolegar: number;
  rawIndicador: number;
  rawMedio: number;
  rawAnular: number;
  rawMindinho: number;
  timestamp: Date;
  createdAt: Date;
}
```

---

## 🌐 CORS e Configuração Frontend

O backend está configurado para aceitar requisições de `http://localhost:3001` (frontend Next.js).

Se seu frontend estiver em outra porta, ajuste no arquivo `src/main.ts`:

```typescript
app.enableCors({
  origin: 'http://localhost:SEU_PORTA',
  credentials: true,
});
```

---

## 📝 Notas Importantes

1. **Tokens JWT**: Tokens não expiram por padrão. Para produção, adicione expiração.
2. **Validação**: Todos os DTOs têm validação automática via class-validator.
3. **Timestamps**: Todas as datas são retornadas em formato ISO 8601.
4. **IDs**: Todos os IDs são inteiros auto-incrementados.
5. **Soft Delete**: Não implementado - DELETE remove permanentemente.
6. **Paginação**: Não implementada - todos os endpoints retornam todos os registros.
7. **Ordenação**: Sessões são ordenadas por `scheduledAt DESC` por padrão.

---

## 🛠️ Desenvolvimento

### Variáveis de Ambiente

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/auth"
JWT_SECRET="sua-chave-secreta-aqui"
PORT=3000
```

### Comandos Úteis

```bash
# Instalar dependências
npm install

# Rodar migrations
npx prisma migrate dev

# Rodar em modo desenvolvimento
npm run start:dev

# Build para produção
npm run build

# Rodar em produção
npm run start:prod

# Prisma Studio (GUI para banco de dados)
npx prisma studio
```

---

## 🐛 Debugging

### Verificar conexão com banco
```bash
docker compose exec postgres psql -U postgres -d auth -c "\dt"
```

### Ver logs do backend
```bash
docker compose logs -f nest
```

### Resetar banco de dados
```bash
docker compose down -v
docker compose up -d
docker compose exec nest npx prisma migrate deploy
```

---

## 📞 Suporte

Para problemas ou dúvidas sobre a integração:
1. Verifique os logs do backend: `docker compose logs nest`
2. Teste endpoints com cURL ou Postman primeiro
3. Verifique se o token JWT está sendo enviado corretamente
4. Confirme que o banco de dados tem todas as tabelas (veja seção Debugging)

---

**Versão:** 1.0.0
**Última atualização:** 14/11/2025
**Base URL:** http://localhost:3000
