import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Sponsor {
  name: string;
  tagline: string;
  logo: string;
}

@Component({
  selector: 'app-sponsor-section',
  imports: [CommonModule],
  templateUrl: './sponsor-section.component.html',
  styleUrl: './sponsor-section.component.scss'
})
export class SponsorSectionComponent {
  sponsors: Sponsor[] = [
    { name: 'Samsung', tagline: 'Display & Memory Partner', logo: 'partners/samsung.svg' },
    { name: 'Foxconn', tagline: 'Manufacturing Partner', logo: 'partners/foxconn.svg' },
    { name: 'TSMC', tagline: 'Chip Fabrication', logo: 'partners/tsmc.svg' },
    { name: 'Corning', tagline: 'Glass Technology', logo: 'partners/corning.svg' },
    { name: 'Sony', tagline: 'Camera Sensors', logo: 'partners/sony.svg' },
    { name: 'LG Display', tagline: 'Display Panels', logo: 'partners/lg-display.svg' }
  ];
}
