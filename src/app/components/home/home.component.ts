import { Component, OnInit } from '@angular/core';
import { TransactionServiceService } from 'src/app/services/transaction-service.service';
import { NzMessageService } from 'ng-zorro-antd/message';

export interface Transaction {
  accountNumber: string;
  amount: number;
  transactionDate: Date;
  type: string;
}

export interface TransactionDTO {
      amount: number;
      accountNumber: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  transaction: Transaction[] = [];
  accountNumber: string = "";
  accountNumberTransaction: string = "";
  amount: number = 0;
  balance: number = -1;
  typeTransaction: string = "";
  constructor(private _transactionService: TransactionServiceService, private message:NzMessageService) { }
  

  chercheTransaction() {
    this.getTransactionByAccountNumber()
  }
faireTransaction(){
  if(this.typeTransaction=="depot"){
    this.depotMoney()
  }else if(this.typeTransaction=="retrait"){
    this.retraitMoney()
  }
  else {
    this.createMessage('error', 'selectionner un type de transaction')
  }
}
  chercheBalance() {
    this.getBalance()
  }
  getTransactionByAccountNumber() {
    console.log("accountNumber", this.accountNumber);
    this.transaction=[]
    this._transactionService.getTransactionByAccountNumber(this.accountNumber).subscribe((data) => {
      this.transaction = data;
    
    },
    (error) => {
      if (error.status === 404) {
        // Le statut de la réponse est 404 (NotFound)
               this.createMessage('error', 'aucune transaction trouvée')

      } else {
        // Autre erreur
        console.error("Erreur lors de la récupération des transactions :", error);
      }
    });
  }

 getBalance() {
  this.balance=-1
    this._transactionService.getBalanceByAccountNumber(this.accountNumber).subscribe((data) => {
      this.balance = data;
     
      
    },
    (error) => {
      if (error.status === 404) {
        // Le statut de la réponse est 404 (NotFound)
               this.createMessage('error', 'aucun compte trouvé pour ce numéro de compte')
      } else {
        // Autre erreur
        console.error("Erreur lors de la récupération de compte :", error);
      }
    });
 }

 retraitMoney(){
    let transactionDTO: TransactionDTO = {
      amount: this.amount,
      accountNumber: this.accountNumberTransaction
    }
    
    this._transactionService.retraitMoney(transactionDTO).subscribe((data) => {
      let dataReturn = data;
      this.createMessage('success', dataReturn.message)
      this.amount=0
      this.accountNumberTransaction=""
    },
    (error) => {
      if(error.status === 200){
        this.createMessage('success', "transaction effectuée avec succès")
        this.amount=0
        this.accountNumberTransaction=""
      }
      if (error.status === 404 || error.status === 400) {
        // Le statut de la réponse est 404 (NotFound)
               this.createMessage('error', "solde insuffisant")
               
      } else {
        // Autre erreur
        console.error("erreur de transaction :", error);
      }
    });
  
 }
  depotMoney() {
    let transactionDTO: TransactionDTO = {
      amount: this.amount,
      accountNumber: this.accountNumberTransaction
    }
  
    
    this._transactionService.depotMoney(transactionDTO).subscribe((data) => {
      let dataReturn = data;
      this.createMessage('success', dataReturn.message)
      this.amount=0
      this.accountNumberTransaction=""
    },
    (error) => {
      if(error.status === 200){
        this.createMessage('success', "transaction effectuée avec succès")
      }
      if (error.status === 404 || error.status === 400) {
        // Le statut de la réponse est 404 (NotFound)
               this.createMessage('error', error.message)
      } else {
        // Autre erreur
        console.error("erreur de transaction :", error);
      }
    });
  }

  createMessage(type: string, contenu: string): void {
    this.message.create(type, contenu);
  }

  afterClose(): void {
    console.log('close');
  }
  ngOnInit(): void {
  }

}
