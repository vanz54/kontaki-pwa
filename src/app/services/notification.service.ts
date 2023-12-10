import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor() { }

  public spawnNotification(body: string): void {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification('Kontaki', {
          body: body,
          icon: '../../assets/images/kip512x512.png'
        });
      });
    }
  }

}
