import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { TransactionDTO } from "../components/home/home.component";

@Injectable({
  providedIn: "root",
})
export class TransactionServiceService {

  urlTransaction = "https://localhost:7069/transactions";
  utlRacine = "https://localhost:7069";
  constructor(private http: HttpClient) {}

  getTransactionByAccountNumber(accountNumber: string) { 
    let url = this.urlTransaction + "/" + accountNumber;
    let params = new HttpParams().set("accountNumber", accountNumber);
    return this.http.get<any>(url, { params: params });
  }

  getBalanceByAccountNumber(accountNumber: string) {
    // 'https://localhost:7069/solde/0A001DX2839A82' 
    let url = this.utlRacine + "/solde/" + accountNumber;
    let params = new HttpParams().set("accountNumber", accountNumber);
    return this.http.get<any>(url, { params: params });
  }

  depotMoney(transactionDTO: TransactionDTO) {
      const url = 'https://localhost:7069/depot';
  const params = new HttpParams()
    .set('Amount', transactionDTO.amount.toString())
    .set('AccountNumber', transactionDTO.accountNumber);

  return this.http.post<any>(url, null, { params });
  }

  retraitMoney(transactionDTO: TransactionDTO) {

  const url = 'https://localhost:7069/retrait';
  const params = new HttpParams()
    .set('Amount', transactionDTO.amount.toString())
    .set('AccountNumber', transactionDTO.accountNumber);

  return this.http.post<any>(url, null, { params });
  
  }

 

}
