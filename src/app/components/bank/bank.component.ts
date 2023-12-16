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

  // Viewchild is used to get the value of the input fields when editing
  @ViewChild('amountEdited') amountEdited: ElementRef;
  @ViewChild('reasonEdited') reasonEdited: ElementRef;
  @ViewChild('dateEdited') dateEdited: ElementRef;


  constructor(
    public authService: AuthService,
    public offlineService: OfflineService
    ) { }
    
  ngOnInit(): void {}

  // Add a new banking transaction
  addBanking(amount: number , reason: string, date: Date) {
    this.authService.addToArray(new Importo(Number(amount), String(reason), date));
  }

  // Delete a banking transaction
  deleteBanking(index) {
    this.authService.removeFromArray(index);
  }

  // Edit a banking transaction
  editingBanking(index) {
    this.authService.editBanking(index);
  }

  // Complete the editing of a banking transaction
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

  // Undo the editing of a banking transaction
  undoEditing(index) {
    this.authService.undoEditBanking(index);
  }

  // Allows to fix the decimals to prevent showing too many decimals
  toFixedTwo(value?: number): number | undefined {
    if (value === undefined) {
      return 0;
    }
  
    return Number(value.toFixed(2));
  }
}

