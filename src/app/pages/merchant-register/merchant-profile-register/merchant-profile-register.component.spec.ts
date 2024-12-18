import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantProfileRegisterComponent } from './merchant-profile-register.component';

describe('MerchantProfileRegisterComponent', () => {
  let component: MerchantProfileRegisterComponent;
  let fixture: ComponentFixture<MerchantProfileRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MerchantProfileRegisterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MerchantProfileRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
