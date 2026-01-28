import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SponsorSectionComponent } from './sponsor-section.component';

describe('SponsorSectionComponent', () => {
  let component: SponsorSectionComponent;
  let fixture: ComponentFixture<SponsorSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SponsorSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SponsorSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
