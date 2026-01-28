import { Component, inject, computed, signal, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { StoreService } from '../../services/store.service';

export interface TrendingProduct {
  productName: string;
  productId: string;
  count: number;
}

@Component({
  selector: 'app-dashboard-home',
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './dashboard-home.component.html',
  styleUrl: './dashboard-home.component.scss'
})
export class DashboardHomeComponent {
  private store = inject(StoreService);
  private platformId = inject(PLATFORM_ID);
  invoices = this.store.invoices;

  /** Check if running in browser (for SSR safety) */
  isBrowser = signal(false);

  constructor() {
    // Set browser flag after component initialization
    if (isPlatformBrowser(this.platformId)) {
      this.isBrowser.set(true);
    }
  }

  /** Invoices sorted by date descending (newest first) */
  sortedInvoices = computed(() => {
    const list = [...this.invoices()];
    return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  });

  /** Top 5 products by purchase count (from invoices) */
  trendingProducts = computed<TrendingProduct[]>(() => {
    const list = this.sortedInvoices();
    const counts = new Map<string, { productId: string; count: number }>();
    for (const inv of list) {
      const key = inv.productName;
      const existing = counts.get(key);
      if (existing) existing.count += 1;
      else counts.set(key, { productId: inv.productId, count: 1 });
    }
    return Array.from(counts.entries())
      .map(([productName, { productId, count }]) => ({ productName, productId, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  });

  /** Chart data for trending products bar chart */
  chartData = computed<ChartConfiguration<'bar'>['data']>(() => {
    const products = this.trendingProducts();
    return {
      labels: products.map((p) => p.productName),
      datasets: [
        {
          label: 'Purchases',
          data: products.map((p) => p.count),
          backgroundColor: 'rgba(0, 113, 227, 0.8)',
          borderColor: 'rgba(0, 113, 227, 1)',
          borderWidth: 1
        }
      ]
    };
  });

  /** Chart options for bar chart */
  chartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 13
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          precision: 0
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          maxRotation: 45,
          minRotation: 0
        }
      }
    }
  };
}
