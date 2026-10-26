import {
  Component,
  Input,
  AfterViewInit,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
  ElementRef
} from '@angular/core';

import {
  Chart,
  ChartConfiguration,
  registerables
} from 'chart.js';

import { ModuleSummary } from '../../models/dashboard.model';

Chart.register(...registerables);

@Component({
  selector: 'app-interactive-chart',
  standalone: true,
  template: `
    <div class="chart-wrapper">
      <canvas #chartCanvas></canvas>
    </div>
  `,
  styles: [`
    .chart-wrapper {
      position: relative;
      width: 100%;
      height: 190px;
    }
  `]
})
export class InteractiveChart
  implements AfterViewInit, OnChanges, OnDestroy {

  @Input() summary: ModuleSummary | null = null;

  @ViewChild('chartCanvas')
  chartCanvas!: ElementRef<HTMLCanvasElement>;

  private chart?: Chart<'doughnut'>;

  private readonly colors = [
    '#2563eb',
    '#10b981',
    '#f59e0b',
    '#8b5cf6',
    '#ef4444',
    '#06b6d4'
  ];

  ngAfterViewInit(): void {
    this.renderChart();
  }

  ngOnChanges(changes: SimpleChanges): void {

    if (changes['summary'] && this.chartCanvas) {
      this.renderChart();
    }
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }

  private renderChart(): void {

    if (!this.chartCanvas || !this.summary) {
      return;
    }

    const entries = Object.entries(
      this.summary.statusCounts ?? {}
    ).filter(([, count]) => count > 0);

    const labels = entries.map(([status]) =>
      status.replace(/_/g, ' ')
    );

    const values = entries.map(([, count]) => count);

    const total = values.reduce(
      (sum, count) => sum + count,
      0
    );

    this.chart?.destroy();

    const config: ChartConfiguration<'doughnut'> = {
      type: 'doughnut',

      data: {
        labels,
        datasets: [{
          data: values,
          backgroundColor: this.colors,
          borderWidth: 3,
          borderColor: '#ffffff',
          hoverOffset: 12,
          borderRadius: 5
        }]
      },

      options: {
        responsive: true,
        maintainAspectRatio: false,

        cutout: '72%',

        animation: {
          duration: 800,
          easing: 'easeOutQuart'
        },

        plugins: {
          legend: {
            display: false
          },

          tooltip: {
            enabled: true,
            backgroundColor: '#172b4d',
            padding: 12,
            displayColors: true,

            callbacks: {
              label: context => {

                const value = Number(context.raw);

                const percentage = total > 0
                  ? ((value / total) * 100).toFixed(1)
                  : '0';

                return ` ${context.label}: ${value} (${percentage}%)`;
              }
            }
          }
        }
      }
    };

    this.chart = new Chart(
      this.chartCanvas.nativeElement,
      config
    );
  }
}