// offline.service.ts
import { Injectable, NgZone } from '@angular/core';
import { Importo } from './user';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OfflineService {
  private online: BehaviorSubject<boolean>;

  get connectionChanged() {
    return this.online.asObservable();
  }

  constructor(private ngZone: NgZone) {
    this.online = new BehaviorSubject<boolean>(navigator.onLine);

    window.addEventListener('online', () => {
      this.ngZone.run(() => {
        this.online.next(true);
      });
    });

    window.addEventListener('offline', () => {
      this.ngZone.run(() => {
        this.online.next(false);
      });
    });
  }

  getOnlineStatus() {
    return this.online;
  }

  saveFormData(data: Importo): void {
    if (!this.online) {
      // Get array of data from localStorage
      const offlineData = JSON.parse(localStorage.getItem('offlineFormDataArray') || '[]');

      offlineData.push(data);

      // Save array of data to localStorage
      localStorage.setItem('offlineFormDataArray', JSON.stringify(offlineData));
    }
  }

  getOfflineFormDataArray(): Importo[] {
    // Retrieve array of data from localStorage
    return JSON.parse(localStorage.getItem('offlineFormDataArray') || '[]');
  }

  clearOfflineFormDataArray(): void {
    localStorage.removeItem('offlineFormDataArray');
  }
}
