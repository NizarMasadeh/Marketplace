import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingSidenavComponent } from './pending-sidenav.component';

describe('PendingSidenavComponent', () => {
  let component: PendingSidenavComponent;
  let fixture: ComponentFixture<PendingSidenavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PendingSidenavComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PendingSidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
