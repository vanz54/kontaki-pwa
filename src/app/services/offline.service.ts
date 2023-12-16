// offline.service.ts
import { Injectable, NgZone } from '@angular/core';
import { Importo } from './user';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OfflineService {
  online: boolean = navigator.onLine;


  constructor() {
    //Subscribes to check for navigation status
    window.addEventListener('online', () => {
      this.online = true;
      console.log("Online");
    });
    window.addEventListener('offline', () => {
      this.online = false;
      console.log("Offline");
    });
  }

  getOnlineStatus() {
    return this.online;
  }

  saveFormData(data: any): void {
    if (!this.online) {
      // Get array of data from localStorage
      const offlineData = JSON.parse(localStorage.getItem('offlineFormDataArray') || '[]');

      offlineData.push(data);

      // Save array of data to localStorage
      localStorage.setItem('offlineFormDataArray', JSON.stringify(offlineData));
    }
  }

  getOfflineFormDataArray(): any[] {
    // Retrieve array of data from localStorage
    return JSON.parse(localStorage.getItem('offlineFormDataArray') || '[]');
  }

  clearOfflineFormDataArray(): void {
    localStorage.removeItem('offlineFormDataArray');
  }
}
