import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BirdTrackMapComponent } from './bird-track-map.component';

describe('BirdTrackMapComponent', () => {
  let component: BirdTrackMapComponent;
  let fixture: ComponentFixture<BirdTrackMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BirdTrackMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BirdTrackMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
