import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor() { }


  //Check if notificatins granted
  public XspawnNotification(body: string): void {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification('Kontaki', {
          body: body,
          icon: '../../assets/images/kip512x512.png'
        });
      });
    }
  }

spawnNotification(body) {
        if (("Notification" in window)){
            if (Notification.permission === "granted"){
              if ('serviceWorker' in navigator) {
                navigator.serviceWorker.ready.then((registration) => {
                  registration.showNotification('Kontaki', {
                    body: body,
                    icon: '../../assets/images/kip512x512.png'
                  });
                });
              }  
            }
            else if (Notification.permission !== "denied"){
                Notification.requestPermission().then((permission)=>{
                    if (permission === "granted"){
                      if ('serviceWorker' in navigator) {
                        navigator.serviceWorker.ready.then((registration) => {
                          registration.showNotification('Kontaki', {
                            body: body,
                            icon: '../../assets/images/kip512x512.png'
                          });
                        });
                      } 
                    }
                })
            }
        }
    }

}
