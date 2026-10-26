import {
  Component,
  Input,
  OnInit,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  inject
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { Subscription } from 'rxjs';

import {
  DashboardService
} from '../../services/dashboard.service';

import {
  DashboardResponse,
  ModuleSummary
} from '../../models/dashboard.model';

import {
  InteractiveChart
} from '../interactive-chart/interactive-chart';

type DashboardRole = 'ADMIN' | 'AGENT' | 'CUSTOMER';

interface DashboardCard {
  key: string;
  title: string;
  icon: string;
  color: string;
}

interface ChartSegment {
  label: string;
  value: number;
  percentage: number;
  color: string;
}

interface ChartData {
  key: string;
  title: string;
  total: number;
  segments: ChartSegment[];
  unavailable: boolean;
}

@Component({
  selector: 'app-dashboard-overview',
  standalone: true,
  imports: [
    CommonModule,
    InteractiveChart
  ],
  templateUrl: './dashboard-overview.html',
  styleUrl: './dashboard-overview.scss'
})
export class DashboardOverview
  implements OnInit, OnChanges, OnDestroy {

  private readonly dashboardService = inject(DashboardService);

  @Input() role: DashboardRole = 'ADMIN';

  @Input() userId = 1;

  dashboard: DashboardResponse | null = null;

  loading = false;

  errorMessage = '';

  successMessage = '';

  selectedModule = 'all';

  selectedStatus = 'all';

  lastUpdated: Date | null = null;

  private request?: Subscription;

  private refreshSequence = 0;

  private readonly palette = [
    '#2563eb',
    '#10b981',
    '#f59e0b',
    '#8b5cf6',
    '#ef4444',
    '#06b6d4',
    '#ec4899'
  ];

  private readonly configurations: Record<
    DashboardRole,
    DashboardCard[]
  > = {

    ADMIN: [
      {
        key: 'customer',
        title: 'Total Customers',
        icon: 'bi-people',
        color: 'blue'
      },
      {
        key: 'agent',
        title: 'Total Agents',
        icon: 'bi-person-badge',
        color: 'purple'
      },
      {
        key: 'product',
        title: 'Insurance Products',
        icon: 'bi-box-seam',
        color: 'cyan'
      },
      {
        key: 'quote',
        title: 'Total Quotes',
        icon: 'bi-file-earmark-text',
        color: 'orange'
      },
      {
        key: 'policy',
        title: 'Total Policies',
        icon: 'bi-shield-check',
        color: 'green'
      },
      {
        key: 'premium',
        title: 'Premium Schedules',
        icon: 'bi-calendar-check',
        color: 'pink'
      },
      {
        key: 'payment',
        title: 'Total Payments',
        icon: 'bi-credit-card',
        color: 'blue'
      },
      {
        key: 'claim',
        title: 'Total Claims',
        icon: 'bi-clipboard-check',
        color: 'purple'
      }
    ],

    AGENT: [
      {
        key: 'customer',
        title: 'My Customers',
        icon: 'bi-people',
        color: 'blue'
      },
      {
        key: 'quote',
        title: 'My Quotes',
        icon: 'bi-file-earmark-text',
        color: 'orange'
      },
      {
        key: 'policy',
        title: 'My Policies',
        icon: 'bi-shield-check',
        color: 'green'
      },
      {
        key: 'premium',
        title: 'Premium Schedules',
        icon: 'bi-calendar-check',
        color: 'cyan'
      },
      {
        key: 'claim',
        title: 'My Claims',
        icon: 'bi-clipboard-check',
        color: 'purple'
      },
      {
        key: 'commission',
        title: 'My Commissions',
        icon: 'bi-wallet2',
        color: 'pink'
      }
    ],

    CUSTOMER: [
      {
        key: 'quote',
        title: 'My Quotes',
        icon: 'bi-file-earmark-text',
        color: 'blue'
      },
      {
        key: 'policy',
        title: 'My Policies',
        icon: 'bi-shield-check',
        color: 'green'
      },
      {
        key: 'premium',
        title: 'My Premiums',
        icon: 'bi-calendar-check',
        color: 'orange'
      },
      {
        key: 'payment',
        title: 'My Payments',
        icon: 'bi-credit-card',
        color: 'cyan'
      },
      {
        key: 'claim',
        title: 'My Claims',
        icon: 'bi-clipboard-check',
        color: 'purple'
      }
    ]
  };

  ngOnInit(): void {
    this.refresh();
  }

  ngOnChanges(changes: SimpleChanges): void {

    if (
      (changes['role'] && !changes['role'].firstChange) ||
      (changes['userId'] && !changes['userId'].firstChange)
    ) {
      this.selectedModule = 'all';
      this.selectedStatus = 'all';
      this.refresh();
    }
  }

  ngOnDestroy(): void {
    this.request?.unsubscribe();
  }

  get pageTitle(): string {

    switch (this.role) {
      case 'ADMIN':
        return 'Admin Dashboard';

      case 'AGENT':
        return 'Agent Dashboard';

      case 'CUSTOMER':
        return 'Customer Dashboard';
    }
  }

  get pageDescription(): string {

    switch (this.role) {
      case 'ADMIN':
        return 'Monitor your insurance business performance';

      case 'AGENT':
        return 'Track your customers, policies and performance';

      case 'CUSTOMER':
        return 'Your insurance portfolio at a glance';
    }
  }

  get cards(): DashboardCard[] {
    return this.configurations[this.role];
  }

  get visibleCards(): DashboardCard[] {

    if (this.selectedModule === 'all') {
      return this.cards;
    }

    return this.cards.filter(
      card => card.key === this.selectedModule
    );
  }

  get availableStatuses(): string[] {

    const statuses = new Set<string>();

    for (const card of this.visibleCards) {

      const summary = this.getModule(card.key);

      Object.keys(summary?.statusCounts ?? {}).forEach(
        status => statuses.add(status)
      );
    }

    return Array.from(statuses).sort();
  }

  get totalRecords(): number {

    return this.visibleCards.reduce(
      (total, card) => total + this.getCount(card.key),
      0
    );
  }

  get activeRecords(): number {

    return this.visibleCards.reduce((total, card) => {

      const statuses =
        this.getModule(card.key)?.statusCounts ?? {};

      return total + (
        statuses['ACTIVE'] ??
        statuses['APPROVED'] ??
        statuses['PAID'] ??
        statuses['SUCCESS'] ??
        0
      );

    }, 0);
  }

  get pendingRecords(): number {

    return this.visibleCards.reduce((total, card) => {

      const statuses =
        this.getModule(card.key)?.statusCounts ?? {};

      return total + (
        statuses['PENDING'] ??
        statuses['DUE'] ??
        0
      );

    }, 0);
  }

  get charts(): ChartData[] {

    return this.visibleCards.map(card => {

      const summary = this.getModule(card.key);

      const counts = summary?.statusCounts ?? {};

      const entries = Object.entries(counts)
        .filter(([, value]) =>
          typeof value === 'number' &&
          Number.isFinite(value) &&
          value >= 0
        );

      const total = entries.reduce(
        (sum, [, value]) => sum + value,
        0
      );

      const segments: ChartSegment[] =
        entries.map(([label, value], index) => ({

          label: this.formatStatus(label),

          value,

          percentage: total > 0
            ? (value / total) * 100
            : 0,

          color: this.palette[index % this.palette.length]
        }));

      return {
        key: card.key,
        title: card.title,
        total: summary?.total ?? 0,
        segments,
        unavailable: this.isUnavailable(card.key)
      };
    });
  }

  refresh(): void {

    this.request?.unsubscribe();

    const sequence = ++this.refreshSequence;

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    let request;

    switch (this.role) {

      case 'ADMIN':
        request = this.dashboardService.getAdminDashboard();
        break;

      case 'AGENT':
        request = this.dashboardService
          .getAgentDashboard(this.userId);
        break;

      case 'CUSTOMER':
        request = this.dashboardService
          .getCustomerDashboard(this.userId);
        break;
    }

    this.request = request.subscribe({

      next: response => {

        if (sequence !== this.refreshSequence) {
          return;
        }

        if (!response.success || !response.data) {

          this.errorMessage =
            response.message || 'Unable to load dashboard.';

          this.loading = false;
          return;
        }

        this.dashboard = response.data;

        this.lastUpdated = new Date();

        this.loading = false;

        this.successMessage = 'Dashboard updated successfully';

        const currentSequence = sequence;

        setTimeout(() => {

          if (currentSequence === this.refreshSequence) {
            this.successMessage = '';
          }

        }, 3000);
      },

      error: error => {

        if (sequence !== this.refreshSequence) {
          return;
        }

        console.error('Dashboard API error:', error);

        this.errorMessage =
          'Unable to refresh dashboard. Please check the backend.';

        this.loading = false;
      }
    });
  }

  getModule(key: string): ModuleSummary | null {

    return this.dashboard?.modules?.[key] ?? null;
  }

  getCount(key: string): number {

    const summary = this.getModule(key);

    if (!summary) {
      return 0;
    }

    if (this.selectedStatus === 'all') {
      return summary.total ?? 0;
    }

    return summary.statusCounts?.[this.selectedStatus] ?? 0;
  }

  isUnavailable(key: string): boolean {

    return this.dashboard?.unavailableModules
      ?.includes(key) ?? false;
  }

  onModuleChange(event: Event): void {

    this.selectedModule =
      (event.target as HTMLSelectElement).value;

    this.selectedStatus = 'all';
  }

  onStatusChange(event: Event): void {

    this.selectedStatus =
      (event.target as HTMLSelectElement).value;
  }

  formatStatus(value: string): string {

    return value
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, letter => letter.toUpperCase());
  }
}