# Kontaki

Kontaki is my first project of a progressive web application in Angular. Is my first approach to web developement which started with a course at my university. I thoroughly enjoyed tackling a highly practical exam to acquire knowledge that I believe will be valuable in the future. It allowed me to experiment with and utilize technologies that I had never used before.

The idea of making this application was born because to keep track of income and expenses in my bank account, I have always used an Excel spreadsheet, so I decided to upgrade and facilitate this monitoring by combining the possibility of studying for an interesting exam and the actual use of the app I would have made.

For the front-end side I used [Angular](https://angular.io/docs) and [Firebase](https://firebase.google.com/) for a simple back-end. I also used some libraries and packages to develop my pwa:
- [npm Angular/Fire](https://www.npmjs.com/package/@angular/fire) : package to smooth the developement and comunication between Angular with FireAuth and FireStore;
- [Bootstrap](https://getbootstrap.com/) : a front-end toolkit to improve and enhance standard CSS;
- [Angular-material](https://material.angular.io/) : components to customize and improve Angular components;
- [Chart.js](https://www.chartjs.org/) : library to realize charts in order to monitor from a general point of view the bank account;
- [Notifications](https://developer.mozilla.org/en-US/docs/Web/API/Notification) and [Service Worker](https://angular.io/guide/service-worker-getting-started): these services ensure that the app is indeed a pwa, enabling its installability and allowing the user to receive notifications for login, registration, and the addition or removal of a transaction in the table.

# How it works
When the application is launched, users are greeted with the homepage, offering options to sign in, sign up, or explore general information about the pwa and its developer.

To register, users are prompted to enter a valid email and password. Additionally, they can personalize their profile by choosing a nickname and setting the initial budget for their account. Upon successful registration, users can log in, provided they have a stable internet connection and enter correct credentials.

Following a successful login, users are directed to the heart of the application: a dynamic dashboard. This dashboard features a comprehensive table displaying all user transactions, providing a detailed overview of their financial activities.
To interact with the table, users are required to input a positive numeric value [_100_] for incoming transactions or a negative value [_-100_] for outgoing ones. Additionally, users must provide a brief description of the transaction (reason [_withdraw from atm_]) and specify the date on which it occurred. Users have the flexibility to omit any of the three fields if necessary, allowing for a streamlined and customizable transaction entry process.

Accompanying the table is an interactive graph offering a visual representation of the user's financial situation, it can be visualized after the table successfully loaded. Additionally, users can find a summary of their profile properties, creating a centralized space for a view of their financial total amount and starting amount.

Furthermore, users have the option to add transactions to the table even in offline mode. After logging in, transactions entered using the button will be locally stored, and once an internet connection is reestablished, they will be automatically updated in the main table and after that can be edited or removed. This feature allows users to add their transactions flexibly, enabling them to record operations even in situations with limited connectivity and synchronize the data later when online.

## Features
- Login / Sign-up / Logout with Firebase
- Data management with Firestore
- Users management with Fireauth
- Installable
- Notifications
- Offline-mode
- Responsiveness (Mobile and Desktop)

# How to use it
## Build
Run `ng build` to build the project and `npx http-server -p 8080 -c-1 dist/kontaki ` to use it, this will start up an http-server, serving the build artifacts stored in the `dist/`. I

## Development server
Run `ng serve` for a dev server, with new versions of Angular a dev server can also use the service worker and after a initial spam-reload then the application can be tested and fastly updated when improving code. Navigate to `http://localhost:4200/` where the application will automatically reload if you change any of the source files.
