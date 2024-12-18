import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, OnInit, PLATFORM_ID } from '@angular/core';
import { environment } from '../../../environments/environment';
import { isPlatformBrowser } from '@angular/common';
import { Observable, of, tap } from 'rxjs';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class ImagesService {

  token: any;

  constructor(
    private _httpClient: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }


  async uploadImage(file: File): Promise<string> {
    try {


      if (isPlatformBrowser(this.platformId)) {
        const formData = new FormData();
        formData.append('file', file);

        // Get the token from localStorage

        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await axios.post(`${environment.server}images/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        });

        console.log("uploaded successfully: ", response);

        return response.data.url;
      } else {
        return 'null'
      }

    } catch (error) {
      console.error('Image upload error:', error);
      throw error;
    }
  }

}

