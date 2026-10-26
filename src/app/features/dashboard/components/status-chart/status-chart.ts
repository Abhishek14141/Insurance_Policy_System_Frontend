import { Component, Input } from '@angular/core';
import { ModuleSummary } from '../../models/dashboard.model';

interface ChartRow {
  name: string;
  count: number;
  percentage: number;
}

@Component({
  selector: 'app-status-chart',
  standalone: true,
  templateUrl: './status-chart.html'
})
export class StatusChart {

  @Input({ required: true })
  title = '';

  @Input()
  summary: ModuleSummary | null = null;

  @Input()
  unavailable = false;

  get rows(): ChartRow[] {

    const counts = this.summary?.statusCounts ?? {};

    const values = Object.entries(counts).filter(
      ([, count]) => typeof count === 'number' && count >= 0
    );

    const total = values.reduce(
      (sum, [, count]) => sum + count,
      0
    );

    return values.map(([name, count]) => ({
      name: name.replaceAll('_', ' '),
      count,
      percentage: total > 0 ? (count / total) * 100 : 0
    }));
  }
}