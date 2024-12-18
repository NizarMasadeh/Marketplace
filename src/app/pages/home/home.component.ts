import { CommonModule, isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { fadeAnimation } from '../../widgets/animations/fade.animation';
import { SkeletonModule } from 'primeng/skeleton';
import { IpLocationService } from '../../services/IPLOCATION/ip-location.service';
import { error } from 'console';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    ButtonModule,
    SkeletonModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  animations: [fadeAnimation]
})
export class HomeComponent implements OnInit{

  private isServer: boolean;
  private isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private _ipLocationService: IpLocationService
  ) {
    this.isServer = isPlatformServer(this.platformId);
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if(this.isBrowser){
      this.getAllUserData();
  }}


  getAllUserData() {
    this._ipLocationService.getAllUserSENdata().subscribe();
  }
}
