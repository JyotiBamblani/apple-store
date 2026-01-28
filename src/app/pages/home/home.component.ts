import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCarouselComponent } from '../../components/product-carousel/product-carousel.component';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { BuyPopupComponent } from '../../components/buy-popup/buy-popup.component';
import { SponsorSectionComponent } from '../../components/sponsor-section/sponsor-section.component';
import { Product } from '../../models/product.model';
import { PRODUCTS } from '../../data/products.data';
import { StoreService } from '../../services/store.service';

/** Main storefront: carousel, product list, sponsors; handles Buy Now and purchase persistence */
@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    ProductCarouselComponent,
    ProductCardComponent,
    BuyPopupComponent,
    SponsorSectionComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  private store = inject(StoreService);
  products = PRODUCTS;
  buyPopupVisible = false;
  selectedProduct: Product | null = null;

  /** Open buy popup for the given product */
  openBuyPopup(product: Product): void {
    this.selectedProduct = product;
    this.buyPopupVisible = true;
  }

  /** Handle popup visibility change; clear selection when closed */
  onBuyPopupVisibleChange(visible: boolean): void {
    this.buyPopupVisible = visible;
    if (!visible) this.selectedProduct = null;
  }

  /** Persist purchase to StoreService (invoice + user) when buy form is submitted */
  onPurchaseComplete(event: { name: string; email: string; product: Product }): void {
    this.store.recordPurchase({
      product: event.product,
      customerName: event.name,
      customerEmail: event.email
    });
  }
}
