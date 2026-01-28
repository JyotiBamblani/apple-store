import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/** Apple-style header: logo, nav links (Home, Products, Partners, Manage Users, Billing) */
@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {}
