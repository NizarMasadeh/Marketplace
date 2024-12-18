import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-notauth',
  imports: [
    CommonModule,
    ButtonModule,
    RouterLink
  ],
  templateUrl: './notauth.component.html',
  styleUrl: './notauth.component.scss'
})
export class NotauthComponent {

}
