import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';

/** Footer: section links (scroll to hero/products/sponsors), company details, copyright */
@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
  /** Current env (dev, qa, feature, production); shown in footer when not production */
  env = environment;
}
