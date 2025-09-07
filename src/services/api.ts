const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface SendOTPResponse {
  success: boolean;
  message?: string;
  error?: string;
  phoneNumber?: string;
  expiresIn?: string;
}

export interface VerifyOTPResponse {
  success: boolean;
  message?: string;
  error?: string;
  phoneNumber?: string;
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async sendOTP(phoneNumber: string): Promise<SendOTPResponse> {
    return this.request<SendOTPResponse>('/otp/send', {
      method: 'POST',
      body: JSON.stringify({ phoneNumber }),
    });
  }

  async verifyOTP(phoneNumber: string, otp: string): Promise<VerifyOTPResponse> {
    return this.request<VerifyOTPResponse>('/otp/verify', {
      method: 'POST',
      body: JSON.stringify({ phoneNumber, otp }),
    });
  }
}

export const apiService = new ApiService();
