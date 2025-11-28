import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { AxiosRequestConfig } from 'axios';
import * as https from 'https';

@Injectable()
export class CoreService {
  private readonly logger = new Logger(CoreService.name);
  private bearerToken: string | null = null;
  private httpsAgent: https.Agent;

  constructor(private readonly httpService: HttpService) {
    this.httpsAgent = new https.Agent({
      rejectUnauthorized: false,
    });
  }

  private coreUrl = process.env.CORE_API_URL || '';
  private clientId = process.env.CORE_CLIENT_ID || '';
  private clientSecret = process.env.CORE_CLIENT_SECRET || '';

  async authenticate(): Promise<void> {
    const token = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');

    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.coreUrl}/auth/login`, '', {
          httpsAgent: this.httpsAgent,
          headers: {
            Token: token,
            Accept: '*/*',
          },
        }),
      );

      this.bearerToken = response.data?.response?.accessToken || null;
      this.logger.log('✔️ CORE API authenticated successfully.');
    } catch (error) {
      this.logger.error('❌ Failed to authenticate with CORE API', error.message);
      throw error;
    }
  }

  private async getAuthHeaders(): Promise<AxiosRequestConfig['headers']> {
    if (!this.bearerToken) {
      await this.authenticate();
    }

    return {
      Authorization: `Bearer ${this.bearerToken}`,
    };
  }

  async getAllPersons(): Promise<any[]> {
    const headers = await this.getAuthHeaders();

    const response = await firstValueFrom(
      this.httpService.get(`${this.coreUrl}/persons`, {  
        httpsAgent: this.httpsAgent,
        headers 
      }),
    );

    return response.data?.response || [];
  }

  async getPersonById(id: string): Promise<any> {
    const headers = await this.getAuthHeaders();

    const response = await firstValueFrom(
      this.httpService.get(`${this.coreUrl}/person/${id}`, { 
        httpsAgent: this.httpsAgent,
        headers 
      }),
    );

    return response.data?.response || null;
  }

  async createPerson(payload: any): Promise<any> {
    const headers = await this.getAuthHeaders();

    const response = await firstValueFrom(
      this.httpService.post(`${this.coreUrl}/person`, payload, { 
        httpsAgent: this.httpsAgent,
        headers 
      }),
    );

    return response.data?.response || null;
  }

  async updatePerson(id: string, payload: any): Promise<any> {
    const headers = await this.getAuthHeaders();

    const response = await firstValueFrom(
      this.httpService.put(`${this.coreUrl}/person/${id}`, payload, { 
        httpsAgent: this.httpsAgent,
        headers 
      }),
    );

    return response.data?.response || null;
  }

  async deletePerson(id: string): Promise<void> {
    const headers = await this.getAuthHeaders();

    await firstValueFrom(
      this.httpService.delete(`${this.coreUrl}/person/${id}`, { 
        httpsAgent: this.httpsAgent,
        headers 
      }),
    );
  }
}
