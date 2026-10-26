import { Component } from '@angular/core';

import { DashboardOverview } from
  '../../../../features/dashboard/components/dashboard-overview/dashboard-overview';

@Component({
  selector: 'app-agent-dashboard',
  standalone: true,
  imports: [DashboardOverview],
  template: `
    <app-dashboard-overview
      role="AGENT"
      [userId]="agentId">
    </app-dashboard-overview>
  `
})
export class AgentDashboard {

  get agentId(): number {

    const stored =
      sessionStorage.getItem('agentId') ??
      localStorage.getItem('agentId');

    const id = Number(stored);

    // Local testing fallback only.
    return Number.isInteger(id) && id > 0
      ? id
      : 1;
  }
}