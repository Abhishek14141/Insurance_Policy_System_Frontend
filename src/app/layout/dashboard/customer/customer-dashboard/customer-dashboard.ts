import { Component } from '@angular/core';

import { DashboardOverview } from
  '../../../../features/dashboard/components/dashboard-overview/dashboard-overview';

@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  imports: [DashboardOverview],
  template: `
    <app-dashboard-overview
      role="CUSTOMER"
      [userId]="customerId">
    </app-dashboard-overview>
  `
})
export class CustomerDashboard {

  get customerId(): number {

    const stored =
      sessionStorage.getItem('customerId') ??
      localStorage.getItem('customerId');

    const id = Number(stored);

    // Local testing fallback only.
    return Number.isInteger(id) && id > 0
      ? id
      : 1;
  }
}