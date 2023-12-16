import { Injectable } from '@angular/core';

/* This service allows the service worker to send notifications to the user device */
@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor() { }

  // This method is used to send a notification, before it request permission for notification
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
