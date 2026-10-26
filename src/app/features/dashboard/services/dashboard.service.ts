import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  ApiResponse,
  DashboardResponse
} from '../models/dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private readonly http = inject(HttpClient);

  private readonly baseUrl =
    'http://localhost:8085/api/v1/dashboard';

  getAdminDashboard(): Observable<ApiResponse<DashboardResponse>> {

    return this.http.get<ApiResponse<DashboardResponse>>(
      `${this.baseUrl}/admin/summary`
    );
  }

  getAgentDashboard(
    agentId: number
  ): Observable<ApiResponse<DashboardResponse>> {

    return this.http.get<ApiResponse<DashboardResponse>>(
      `${this.baseUrl}/agent/summary`,
      {
        params: {
          agentId: agentId.toString()
        }
      }
    );
  }

  getCustomerDashboard(
    customerId: number
  ): Observable<ApiResponse<DashboardResponse>> {

    return this.http.get<ApiResponse<DashboardResponse>>(
      `${this.baseUrl}/customer/summary`,
      {
        params: {
          customerId: customerId.toString()
        }
      }
    );
  }
}