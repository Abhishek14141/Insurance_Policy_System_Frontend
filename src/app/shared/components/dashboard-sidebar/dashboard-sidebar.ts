
import { Component, Input } from '@angular/core';
import {
  Router,
  RouterLink,
  RouterLinkActive
} from '@angular/router';

import {
  DashboardMenuGroup
} from '../dashboard-menu.config';

@Component({
  selector: 'app-dashboard-sidebar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './dashboard-sidebar.html'
})
export class DashboardSidebar {

  @Input() title = 'Insurance Portal';

  @Input() menu: DashboardMenuGroup[] = [];

  @Input() showLogout = true;

  openMenu: string | null = null;

  constructor(private router: Router) {}

  toggleMenu(label: string): void {
    this.openMenu =
      this.openMenu === label ? null : label;
  }

  logout(): void {
    const confirmed = window.confirm(
      'Are you sure you want to logout?'
    );

    if (!confirmed) {
      return;
    }

    sessionStorage.removeItem('token');
    sessionStorage.removeItem('role');

    localStorage.removeItem('token');
    localStorage.removeItem('role');

    this.router.navigateByUrl('/login');
  }
}
