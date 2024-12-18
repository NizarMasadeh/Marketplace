import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantStoreComponent } from './merchant-store.component';

describe('MerchantStoreComponent', () => {
  let component: MerchantStoreComponent;
  let fixture: ComponentFixture<MerchantStoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MerchantStoreComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MerchantStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
