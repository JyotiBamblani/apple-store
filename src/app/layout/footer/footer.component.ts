import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/** Footer: section links (scroll to hero/products/sponsors), company details, copyright */
@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
