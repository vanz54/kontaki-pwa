import { Component, ElementRef, ViewChild } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { OfflineService } from 'src/app/services/offline.service';
import { Importo } from 'src/app/services/user';

@Component({
  selector: 'app-bank',
  templateUrl: './bank.component.html',
  styleUrls: ['./bank.component.css']
})
export class BankComponent {

  bankingRef: AngularFirestoreCollection<any>;
  imports: Observable<any>;
  @ViewChild('amountEdited') amountEdited: ElementRef;
  @ViewChild('reasonEdited') reasonEdited: ElementRef;
  @ViewChild('dateEdited') dateEdited: ElementRef;


  constructor(
    public authService: AuthService,
    public offlineService: OfflineService
    ) { }
    
  ngOnInit(): void {}


  toFirebaseDate(timestamp) {
    var myDate = new Date(timestamp);
    return myDate;
  }

  addBanking(amount: number , reason: string, date: Date) {
    // console.log(new Importo(amount, reason, date))
    this.authService.addToArray(new Importo(Number(amount), String(reason), date));
  }

  deleteBanking(index) {
    // console.log(index);
    // console.log(transaction);
    this.authService.removeFromArray(index);
  }

  editingBanking(index) {
    // console.log(transaction);
    this.authService.editBanking(index);
  }

  completeEdit(amount: number, reason: string, date: string, transaction: any, index: number) {
    let defaultAmount = transaction.amount;
    let defaultReason = transaction.reason;
    let defaultDate = transaction.date;
    amount = this.amountEdited.nativeElement.value ? this.amountEdited.nativeElement.value : defaultAmount;
    reason = this.reasonEdited.nativeElement.value ? this.reasonEdited.nativeElement.value : defaultReason;
    date = this.dateEdited.nativeElement.value ? this.dateEdited.nativeElement.value : defaultDate;
    var oldTransaction = transaction;
    this.authService.completeEditBanking(amount, reason, date, oldTransaction, index);
  }

  undoEditing(index) {
    // console.log(transaction);
    this.authService.undoEditBanking(index);
  }

  toFixedTwo(value?: number): number | undefined {
    if (value === undefined) {
      return 0;
    }
  
    return Number(value.toFixed(2));
  }
}

