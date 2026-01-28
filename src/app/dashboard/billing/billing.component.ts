import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { format } from 'date-fns';
import { Invoice } from '../../models/invoice.model';
import { StoreService } from '../../services/store.service';
import { InvoiceListComponent } from '../../components/invoice-list/invoice-list.component';

const PAGE_SIZE = 5;

/** Billing page: paginated invoices table only */
@Component({
  selector: 'app-billing',
  imports: [CommonModule, InvoiceListComponent],
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
