import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantCreateStoreComponent } from './merchant-create-store.component';

describe('MerchantCreateStoreComponent', () => {
  let component: MerchantCreateStoreComponent;
  let fixture: ComponentFixture<MerchantCreateStoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MerchantCreateStoreComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MerchantCreateStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
