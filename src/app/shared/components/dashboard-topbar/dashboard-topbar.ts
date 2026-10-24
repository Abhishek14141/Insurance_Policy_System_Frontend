
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard-topbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard-topbar.html'
})
export class DashboardTopbar {
  @Input() role: 'Admin' | 'Agent' | 'Customer' = 'Customer';
  @Input() homeUrl = '/customer/dashboard';
}
