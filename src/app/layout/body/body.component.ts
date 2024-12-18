import { Component } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-body',
  imports: [NavbarComponent, RouterOutlet],
  templateUrl: './body.component.html',
  styleUrl: './body.component.scss'
})
export class BodyComponent {

}
