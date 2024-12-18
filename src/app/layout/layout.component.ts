import { AfterViewChecked, ChangeDetectorRef, Component } from '@angular/core';
import { NavbarComponent } from "./navbar/navbar.component";
import { RouterOutlet } from '@angular/router';
import { fadeAnimation } from '../widgets/animations/fade.animation';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-layout',
  imports: [NavbarComponent, RouterOutlet],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  animations: [fadeAnimation],
  providers: [MessageService]
})
export class LayoutComponent implements AfterViewChecked {

  constructor(private _cdr: ChangeDetectorRef) { }

  ngAfterViewChecked() {
    this._cdr.detectChanges();
  }

}
