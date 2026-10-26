export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface ModuleSummary {
  total: number;
  statusCounts: Record<string, number>;
  amountTotals: Record<string, number>;
}

export interface DashboardResponse {
  dashboardType: string;
  demo: boolean;
  generatedAt: string;
  modules: Record<string, ModuleSummary>;
  unavailableModules: string[];
}