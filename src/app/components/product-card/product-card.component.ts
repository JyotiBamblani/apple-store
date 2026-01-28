import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product.model';
import { formatCurrency } from '../../utils/formatCurrency';

/** Reusable product card: image, name, description, price (formatCurrency), Buy Now button */
@Component({
  selector: 'app-product-card',
  imports: [CommonModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Output() buyClick = new EventEmitter<Product>();

  formatCurrency = formatCurrency;

  /** Emit product when Buy Now is clicked */
  onBuy(): void {
    this.buyClick.emit(this.product);
  }
}
