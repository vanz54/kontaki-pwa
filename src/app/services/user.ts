export interface User {
    uid: string;
    email: string;
    displayName: string;
    totalCash: number;
    banking: Importo[];
  }

export class Importo {
    public amount: number;
    public reason: string;
    public date: Date;
    constructor(amount: number, reason: string, date: Date) {
        this.amount = amount;
        this.reason = reason;
        this.date = date;
    }
    toString() {
        return this.amount + " " + this.reason + " " + this.date;
    }

    toFirestore(){
        return {
            amount: this.amount,
            reason: this.reason,
            date: this.date
            };
    }
}
