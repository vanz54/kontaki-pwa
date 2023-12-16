
import { Injectable, NgZone } from '@angular/core';
import { Importo, User } from '../services/user';
import { doc, updateDoc, arrayUnion, arrayRemove, Timestamp, initializeFirestore, enableIndexedDbPersistence } from "firebase/firestore";
import { AngularFirestore,AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import * as auth from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { combineLatest, map } from 'rxjs';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { NotificationService } from './notification.service';
import { OfflineService } from './offline.service';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userData: any; // Save logged in user data
  errorMessage: any;

  /* Initialize Cloud Firestore whitout angular/fire 
  private app = firebase.initializeApp(environment.firebase);
  private db = initializeFirestore(this.app, {
    cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED,
  }); */

  constructor(
    public afs: AngularFirestore, // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    public ngZone: NgZone, // NgZone service to remove outside scope warning
    public notification: NotificationService,
    public offlineService: OfflineService
  ) {
    //enableIndexedDbPersistence(this.db)


    /* Saving user data in localstorage when 
    logged in and setting up null when logged out */
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.userData = user;
        this.SetUserData(user);

        localStorage.setItem('user', JSON.stringify(user.email));
        JSON.parse(localStorage.getItem('user')!);
      } else {
        localStorage.setItem('user', 'null');
        JSON.parse(localStorage.getItem('user')!);
      }
    });
  }

  /* Setting up user data when sign in with username/password or on reload*/
  SetUserData(user: any) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${user.uid}`
    );

    const rootRef = this.afs.firestore;
    const applicationsRef = rootRef.collection("users");
    const applicationIdRef = applicationsRef.doc(user.uid);
    applicationIdRef.get().then((snapshot) => {
      if (snapshot.exists) {
        const bankings = snapshot.get("banking");

        // Updates array of transactions with offline data
        if (this.offlineService.online) {
          this.offlineService.getOfflineFormDataArray().forEach((importo) => {
            bankings.push(importo)
          });
          this.offlineService.clearOfflineFormDataArray();
        }


        const bankingsJS = bankings.map((obj)=> {return Object.assign({}, obj)});

        const totals = snapshot.get("totalCash");
        const starts = snapshot.get("startingCash");

        this.userData = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          startingCash: Number(starts),
          totalCash: Number(totals),
          banking: bankingsJS, 
        };

        return userRef.set(this.userData, {
          merge: true,
        });

      } else { 
        this.userData = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          startingCash: 0,
          totalCash: 0,
          banking: [],
        };
        return userRef.set(this.userData, {
          merge: true,
        });
      }
    });
    
  }

  /* Setting up user data when sign up with username/password */
  SetUserDataOnRegister(user: any, startingCash: number) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${user.uid}`
    );
    
   this.userData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      startingCash: startingCash ? startingCash : 0,
      totalCash: startingCash ? startingCash : 0,
      banking: [],
    };
    return userRef.set(this.userData, {
      merge: true,
    });
  }

  // Sign in with email/password
  Login(email: string, password: string) {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.SetUserData(result.user);
        this.afAuth.authState.subscribe((user) => {
          if (user) {
            this.router.navigate(['dashboard/bank']);
            
            this.notification.spawnNotification((user.displayName? user.displayName : 'User') + ' logged in')
          }
        });
      })
      .catch((error) => {
        this.errorMessage = 'Error during login. Please try again.';
  
        if (error.code === 'auth/invalid-login-credentials') {
          this.errorMessage = 'Invalid credentials.';
        } else if (error.code === 'auth/invalid-email') {
          this.errorMessage = 'Email is badly formatted.';
        } else if (error.code === 'auth/missing-password') {
          this.errorMessage = 'Password is required.';
        } else if (error.code === "auth/network-request-failed") {
          this.errorMessage = 'Check your internet connection.';
        } else {
          this.errorMessage = 'Error during login.';
        } 

        // Show error message for 4 seconds
        this.ngZone.runOutsideAngular(() => {
          setTimeout(() => {
            this.ngZone.run(() => {
              this.errorMessage = null; 
            });
          }, 4000);
        });
      });
  }

  // Sign up with email/password
  Register(name:string, email: string, password: string, startingCash: number) {
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then(async (result) => {
        this.SetUserDataOnRegister(result.user, startingCash);
        await result.user.updateProfile({
          displayName: name
        });
        console.log(result.user);
        this.notification.spawnNotification((name? name : 'User') + ' registered')
        this.router.navigate(['login']);
      })
      .catch((error) => {
        this.errorMessage = 'Error during registration. Please try again.';
  
        if (error.code === 'auth/email-already-in-use') {
          this.errorMessage = 'Email already in use.';
        } else if (error.code === 'auth/weak-password') {
          this.errorMessage = 'Password is too weak.';
        } else if (error.code === 'auth/invalid-email') {
          this.errorMessage = 'Email is badly formatted.';
        } else if (error.code === 'auth/missing-password') {
          this.errorMessage = 'Password is required.';
        } else if (error.code === "auth/network-request-failed") {
          this.errorMessage = 'Check your internet connection.';
        } else {
          this.errorMessage = 'Error during registration.';
        }

        // Show error message for 4 seconds
        this.ngZone.runOutsideAngular(() => {
          setTimeout(() => {
            this.ngZone.run(() => {
              this.errorMessage = null; 
            });
          }, 4000);
        });
      });
  }

  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    return user !== null;
  }

  SignOut() {
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['login']);
    });
  }

  getLastBankingElem () {
    if(this.userData.banking.length == 0)
      return this.userData.totalCash
    else
      return this.userData.banking[this.userData.banking.length - 1].total      
  }

  addToArray(importo: Importo) {
    
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${this.userData.uid}`
    );


    let updatedBanking = [];
    
    if (this.userData.banking.length != 0) {
      for (let i = 0; i < this.userData.banking.length; i++) {
        if (i == 0) {
          updatedBanking.push({
            amount: Number(this.userData.banking[i].amount),
            reason: this.userData.banking[i].reason,
            date: this.userData.banking[i].date,
            isEdit: false,
            total: Number(this.userData.banking[i].amount) + Number(this.userData.startingCash)
          });
        } else {
          updatedBanking.push({
            amount: Number(this.userData.banking[i].amount),
            reason: this.userData.banking[i].reason,
            date: this.userData.banking[i].date,
            isEdit: false,
            total: Number(this.userData.banking[i].amount) + Number(updatedBanking[i - 1].total)
          });
        }
      }
    }

    let previousTotal = updatedBanking.length!=0 ? updatedBanking[updatedBanking.length - 1].total : this.userData.startingCash;

    const lastElemToInsert = {
      amount: importo.amount,
      reason: importo.reason,
      date: importo.date,
      total: importo.amount + previousTotal,
      isEdit: false
    };

    // Adds transaction to offline array if offline, when online and logged in it will be added to the database
    if (!this.offlineService.online){
      this.offlineService.saveFormData(lastElemToInsert);
    }

    updatedBanking.push(lastElemToInsert);
    this.userData.banking = [...updatedBanking];
    
    if(this.offlineService.online){
      userRef.update({
        banking: updatedBanking,
        totalCash: updatedBanking.length!=0 ? updatedBanking[updatedBanking.length - 1].total : this.userData.startingCash
      });
    }

    
    
    this.notification.spawnNotification("New transaction of " + importo.amount + "€ added")
  }

  removeFromArray(index: number) {
    let updatedBanking = [];

    this.userData.banking.splice(index, 1);
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${this.userData.uid}`
    );

    for (let i = 0; i < this.userData.banking.length; i++) {
      if (i == 0) {
        updatedBanking.push({
          amount: Number(this.userData.banking[i].amount),
          reason: this.userData.banking[i].reason,
          date: this.userData.banking[i].date,
          isEdit: false,
          total: Number(this.userData.banking[i].amount) + Number(this.userData.startingCash)
        });
      } else {
        updatedBanking.push({
          amount: Number(this.userData.banking[i].amount),
          reason: this.userData.banking[i].reason,
          date: this.userData.banking[i].date,
          isEdit: false,
          total: Number(this.userData.banking[i].amount) + Number(updatedBanking[i - 1].total)
        });
      }
    }

    this.userData.banking = [...updatedBanking];

    userRef.update({
      banking: updatedBanking,
      totalCash: updatedBanking.length!=0 ? updatedBanking[updatedBanking.length - 1].total : this.userData.startingCash
    });
    
    this.notification.spawnNotification("Transaction #" + (index + 1) + " deleted")
  }

  editBanking(index: number) {
    this.userData.banking[index].isEdit = true;
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${this.userData.uid}`
    );
    userRef.update({
      banking: this.userData.banking
    });
  }

  completeEditBanking(amount: number, reason: string, date: string, oldTransaction , index: number) {
    console.log("Vecchi valori:", oldTransaction.amount, oldTransaction.reason, oldTransaction.date, oldTransaction.total);
    
    let updatedBanking = [];

    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${this.userData.uid}`
    );

    for (let i = 0; i < this.userData.banking.length; i++) {
      if(i < index) {
        updatedBanking.push({
          amount: Number(this.userData.banking[i].amount),
          reason: this.userData.banking[i].reason,
          date: this.userData.banking[i].date,
          isEdit: false,
          total: Number(this.userData.banking[i].total)
        });
      }
      if (i == 0 && i == index) {
        updatedBanking.push({
          amount: Number(amount),
          reason: reason,
          date: date,
          isEdit: false,
          total: Number(amount) + Number(this.userData.startingCash)
        });
      } else if (i!=0 && i == index) {
        updatedBanking.push({
          amount: Number(amount),
          reason: reason,
          date: date,
          isEdit: false,
          total: Number(oldTransaction.total) -  Number(oldTransaction.amount - amount)
        });
      } else if (i!=0 && i > index) {
        updatedBanking.push({
          amount: Number(this.userData.banking[i].amount),
          reason: this.userData.banking[i].reason,
          date: this.userData.banking[i].date,
          isEdit: false,
          total: Number(this.userData.banking[i].total) - Number(oldTransaction.amount - amount)
        });
      }
    }

    this.userData.banking = [...updatedBanking];

    userRef.update({
      banking: updatedBanking,
      totalCash: updatedBanking.length!=0 ? updatedBanking[updatedBanking.length - 1].total : this.userData.startingCash
    });
  }

  undoEditBanking(index: number) {
    this.userData.banking[index].isEdit = false;
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${this.userData.uid}`
    );
    userRef.update({
      banking: this.userData.banking
    });
  }

}



