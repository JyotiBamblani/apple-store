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
    { name: 'Samsung', tagline: 'Display & Memory Partner', logo: 'https://via.placeholder.com/120x60?text=Samsung' },
    { name: 'Foxconn', tagline: 'Manufacturing Partner', logo: 'https://via.placeholder.com/120x60?text=Foxconn' },
    { name: 'TSMC', tagline: 'Chip Fabrication', logo: 'https://via.placeholder.com/120x60?text=TSMC' },
    { name: 'Corning', tagline: 'Glass Technology', logo: 'https://via.placeholder.com/120x60?text=Corning' },
    { name: 'Sony', tagline: 'Camera Sensors', logo: 'https://via.placeholder.com/120x60?text=Sony' },
    { name: 'LG Display', tagline: 'Display Panels', logo: 'https://via.placeholder.com/120x60?text=LG+Display' }
  ];
}
