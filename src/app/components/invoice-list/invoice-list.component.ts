import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Invoice } from '../../models/invoice.model';

/** Reusable invoice table: Invoice ID | Product | User Email | Date | Status; with Previous/Next pagination */
@Component({
  selector: 'app-invoice-list',
  imports: [CommonModule],
  templateUrl: './invoice-list.component.html',
  styleUrl: './invoice-list.component.scss'
})
export class InvoiceListComponent {
  @Input() invoices: Invoice[] = [];
  @Input() currentPage = 1;
  @Input() totalPages = 1;
  @Input() canGoPrevious = false;
  @Input() canGoNext = false;
  /** Function to format ISO date string for display */
  @Input() formatDate: (isoDate: string) => string = (d) => new Date(d).toLocaleString();
  @Output() previousPage = new EventEmitter<void>();
  @Output() nextPage = new EventEmitter<void>();
}
