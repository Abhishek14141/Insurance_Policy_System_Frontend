
import { Routes } from '@angular/router';

import { AdminLayout } from './layout/dashboard/admin/admin-layout/admin-layout';
import { AgentLayout } from './layout/dashboard/agent/agent-layout/agent-layout';
import { CustomerLayout } from './layout/dashboard/customer/customer-layout/customer-layout';

import { AdminDashboard } from './layout/dashboard/admin/admin-dashboard/admin-dashboard';
import { AgentDashboard } from './layout/dashboard/agent/agent-dashboard/agent-dashboard';
import { CustomerDashboard } from './layout/dashboard/customer/customer-dashboard/customer-dashboard';

export const routes: Routes = [
  {
    path: 'admin',
    component: AdminLayout,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        component: AdminDashboard
      }
    ]
  },
  {
    path: 'agent',
    component: AgentLayout,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        component: AgentDashboard
      }
    ]
  },
  {
    path: 'customer',
    component: CustomerLayout,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        component: CustomerDashboard
      }
    ]
  },
  {
    path: '',
    redirectTo: 'customer/dashboard',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'customer/dashboard'
  }
];
