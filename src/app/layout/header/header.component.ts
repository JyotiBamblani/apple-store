import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme.service';

/** Apple-style header: logo, nav links (Home, Products, Partners, Dashboard), theme toggle */
@Component({
  selector: 'app-header',
  imports: [RouterLink, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  themeService = inject(ThemeService);
  theme = this.themeService.theme;
  isDark = this.themeService.isDark;

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
