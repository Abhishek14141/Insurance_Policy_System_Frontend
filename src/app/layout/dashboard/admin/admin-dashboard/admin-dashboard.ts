import { Component } from '@angular/core';

import { DashboardOverview } from
  '../../../../features/dashboard/components/dashboard-overview/dashboard-overview';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [DashboardOverview],
  template: `
    <app-dashboard-overview
      role="ADMIN">
    </app-dashboard-overview>
  `
})
export class AdminDashboard {}