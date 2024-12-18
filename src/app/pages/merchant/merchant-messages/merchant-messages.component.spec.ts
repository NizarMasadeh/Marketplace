import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantMessagesComponent } from './merchant-messages.component';

describe('MerchantMessagesComponent', () => {
  let component: MerchantMessagesComponent;
  let fixture: ComponentFixture<MerchantMessagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MerchantMessagesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MerchantMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
