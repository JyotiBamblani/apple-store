import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product.model';

/** Full-screen product carousel: auto-scroll every 3s, slide = image + name + price, dot navigation */
@Component({
  selector: 'app-product-carousel',
  imports: [CommonModule],
  templateUrl: './product-carousel.component.html',
  styleUrl: './product-carousel.component.scss'
})
export class ProductCarouselComponent implements OnInit, OnDestroy {
  @Input() products: Product[] = [];
  currentIndex = 0;
  private intervalId: ReturnType<typeof setInterval> | null = null;
  readonly AUTO_SCROLL_MS = 3000;

  ngOnInit(): void {
    this.startAutoScroll();
  }

  ngOnDestroy(): void {
    this.stopAutoScroll();
  }

  /** Start 3s interval to advance slide */
  private startAutoScroll(): void {
    this.intervalId = setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % Math.max(1, this.products.length);
    }, this.AUTO_SCROLL_MS);
  }

  private stopAutoScroll(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  /** Jump to slide by index (e.g. dot click) */
  goTo(index: number): void {
    this.currentIndex = index % Math.max(1, this.products.length);
  }
}
