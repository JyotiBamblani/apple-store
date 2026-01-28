import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product } from '../../models/product.model';

/** Buy popup: form (Name + Email required, email validation) → success view with product details; Okay or 10s auto-close */
@Component({
  selector: 'app-buy-popup',
  imports: [CommonModule, FormsModule],
  templateUrl: './buy-popup.component.html',
  styleUrl: './buy-popup.component.scss'
})
export class BuyPopupComponent {
  @Input() product: Product | null = null;
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() purchaseComplete = new EventEmitter<{ name: string; email: string; product: Product }>();

  name = '';
  email = '';
  showSuccess = false;
  purchasedProduct: Product | null = null;
  purchaserName = '';
  purchaserEmail = '';
  emailError = signal<string | null>(null);
  successCloseTimer: ReturnType<typeof setTimeout> | null = null;
  readonly SUCCESS_AUTO_CLOSE_MS = 10000;

  get isFormVisible(): boolean {
    return this.visible && !this.showSuccess;
  }

  get isSuccessVisible(): boolean {
    return this.visible && this.showSuccess;
  }

  close(): void {
    this.visibleChange.emit(false);
    this.clearSuccessTimer();
  }

  onBackdropClick(e: MouseEvent): void {
    if ((e.target as HTMLElement).classList.contains('popup-backdrop')) {
      this.close();
    }
  }

  /** Basic email format validation */
  validateEmail(value: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(value);
  }

  onSubmit(): void {
    this.emailError.set(null);
    const emailTrim = this.email.trim();
    if (!emailTrim) {
      this.emailError.set('Email is required.');
      return;
    }
    if (!this.validateEmail(emailTrim)) {
      this.emailError.set('Please enter a valid email address.');
      return;
    }
    if (!this.product) return;

    this.purchasedProduct = this.product;
    this.purchaserName = this.name.trim() || 'Customer';
    this.purchaserEmail = emailTrim;
    this.showSuccess = true;
    this.purchaseComplete.emit({
      name: this.purchaserName,
      email: this.purchaserEmail,
      product: this.product
    });
    this.startSuccessCloseTimer();
  }

  onSuccessOkay(): void {
    this.clearSuccessTimer();
    this.resetAndClose();
  }

  private startSuccessCloseTimer(): void {
    this.clearSuccessTimer();
    this.successCloseTimer = setTimeout(() => {
      this.successCloseTimer = null;
      this.resetAndClose();
    }, this.SUCCESS_AUTO_CLOSE_MS);
  }

  private clearSuccessTimer(): void {
    if (this.successCloseTimer) {
      clearTimeout(this.successCloseTimer);
      this.successCloseTimer = null;
    }
  }

  private resetAndClose(): void {
    this.showSuccess = false;
    this.name = '';
    this.email = '';
    this.emailError.set(null);
    this.purchasedProduct = null;
    this.purchaserName = '';
    this.purchaserEmail = '';
    this.visibleChange.emit(false);
  }
}
