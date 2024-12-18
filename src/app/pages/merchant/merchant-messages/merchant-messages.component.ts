import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-merchant-messages',
  imports: [CommonModule, ButtonModule],
  templateUrl: './merchant-messages.component.html',
  styleUrl: './merchant-messages.component.scss'
})
export class MerchantMessagesComponent {

}
