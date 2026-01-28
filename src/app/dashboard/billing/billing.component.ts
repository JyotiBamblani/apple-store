import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { format } from 'date-fns';
import { Invoice } from '../../models/invoice.model';
import { StoreService } from '../../services/store.service';
import { InvoiceListComponent } from '../../components/invoice-list/invoice-list.component';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';

const PAGE_SIZE = 5;

export interface TrendingProduct {
  productName: string;
  productId: string;
  count: number;
}

/** Dashboard page: trending products (chart + cards) and paginated invoices table */
@Component({
  selector: 'app-billing',
  imports: [CommonModule, InvoiceListComponent, BaseChartDirective],
  templateUrl: './billing.component.html',
  styleUrl: './billing.component.scss'
})
export class BillingComponent {
  private store = inject(StoreService);
  invoices = this.store.invoices;
  currentPage = signal(1);
  pageSize = PAGE_SIZE;

  /** Invoices sorted by date descending (newest first) */
  sortedInvoices = computed(() => {
    const list = [...this.invoices()];
    return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  });

  /** Top 5 products by purchase count (from invoices) */
  trendingProducts = computed(() => {
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

  chartData = computed((): ChartConfiguration<'bar'>['data'] => {
    const trend = this.trendingProducts();
    return {
      labels: trend.map((t) => t.productName),
      datasets: [
        {
          label: 'Purchases',
          data: trend.map((t) => t.count),
          backgroundColor: 'rgba(0, 113, 227, 0.6)',
          borderColor: 'rgb(0, 113, 227)',
          borderWidth: 1
        }
      ]
    };
  });

  chartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 1 } }
    }
  };

  totalPages = computed(() =>
    Math.max(1, Math.ceil(this.sortedInvoices().length / this.pageSize))
  );
  paginatedInvoices = computed(() => {
    const list = this.sortedInvoices();
    const page = this.currentPage();
    const start = (page - 1) * this.pageSize;
    return list.slice(start, start + this.pageSize);
  });
  canGoPrevious = computed(() => this.currentPage() > 1);
  canGoNext = computed(() => this.currentPage() < this.totalPages());

  previousPage(): void {
    if (this.canGoPrevious()) this.currentPage.update((p) => p - 1);
  }

  nextPage(): void {
    if (this.canGoNext()) this.currentPage.update((p) => p + 1);
  }

  /** Format ISO date for display (uses date-fns) */
  formatDate = (isoDate: string): string =>
    format(new Date(isoDate), 'MMM d, yyyy h:mm a');
}
