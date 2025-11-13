const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export class ApiClient {
  private static token: string | null = null;

  static setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  static getToken() {
    if (!this.token) {
      this.token = localStorage.getItem('auth_token');
    }
    return this.token;
  }

  private static async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Erro na requisição' }));
      throw new Error(error.message || 'Erro na requisição');
    }

    return response.json();
  }

  // Auth
  static async signUp(data: { name: string; email: string; password: string; registerId: string }) {
    return this.request<{ access_token: string }>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async signIn(data: { email: string; password: string }) {
    return this.request<{ access_token: string }>('/auth/signin', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async getMe() {
    return this.request<{ id: number; name: string; email: string; registerId: string }>('/auth/me');
  }

  // Pacientes
  static async createPaciente(data: { name: string; age: number; condition: string; terapeutaId: number }) {
    return this.request('/pacientes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async getPacientes() {
    return this.request<any[]>('/pacientes');
  }

  static async getPaciente(id: number) {
    return this.request(`/pacientes/${id}`);
  }

  static async updatePaciente(id: number, data: Partial<{ name: string; age: number; condition: string }>) {
    return this.request(`/pacientes/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  static async deletePaciente(id: number) {
    return this.request(`/pacientes/${id}`, {
      method: 'DELETE',
    });
  }

  // Exercícios
  static async createExercise(data: { name: string; description: string; targetArea: string; duration: number; pacienteId: number }) {
    return this.request('/exercises', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async generateExercise(data: { condition: string; targetArea: string; difficulty: string; pacienteId: number }) {
    return this.request('/exercises/generate', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async getExercises() {
    return this.request<any[]>('/exercises');
  }

  static async getExercise(id: number) {
    return this.request(`/exercises/${id}`);
  }

  static async updateExercise(id: number, data: any) {
    return this.request(`/exercises/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  static async deleteExercise(id: number) {
    return this.request(`/exercises/${id}`, {
      method: 'DELETE',
    });
  }

  // Sessões
  static async createSession(data: { pacienteId: number; scheduledDate: string; exerciseIds: number[] }) {
    return this.request('/sessions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async getSessions() {
    return this.request<any[]>('/sessions');
  }

  static async getSession(id: number) {
    return this.request(`/sessions/${id}`);
  }

  static async updateSession(id: number, data: any) {
    return this.request(`/sessions/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  static async startSession(id: number) {
    return this.request(`/sessions/${id}/start`, {
      method: 'PATCH',
    });
  }

  static async completeSession(id: number, data: { notes?: string }) {
    return this.request(`/sessions/${id}/complete`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  static async cancelSession(id: number, data: { reason: string }) {
    return this.request(`/sessions/${id}/cancel`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  static async getSessionReport(id: number) {
    return this.request(`/sessions/${id}/report`);
  }

  static async deleteSession(id: number) {
    return this.request(`/sessions/${id}`, {
      method: 'DELETE',
    });
  }
}
