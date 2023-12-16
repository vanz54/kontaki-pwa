import { Injectable, NgZone } from '@angular/core';

/* This service allows to check state of connection and allowing 
the user to update the table with all the transactions */
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

  /*  Remove last item from array of data in localStorage, 
  useful when page is not reloaded but user is offline and adds an element */
  removeLastItemFromOfflineFormDataArray(): void {
    const offlineData = JSON.parse(localStorage.getItem('offlineFormDataArray') || '[]');
    offlineData.pop();
    localStorage.setItem('offlineFormDataArray', JSON.stringify(offlineData));
  }
}
