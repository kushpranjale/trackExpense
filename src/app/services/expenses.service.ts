import { Injectable } from '@angular/core';
import { Subject, from } from 'rxjs';
import {ExpenseModel} from '../models/ExpenseseModel';
import { FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class ExpensesService {

  private UpdatedExpenses = new Subject<ExpenseModel[]>();
  private url = 'api/';
  private expenses: ExpenseModel[] = [];

  constructor(private http: HttpClient, private routs: Router) { }
  getExpenseUpdateListener() {
    return this.UpdatedExpenses.asObservable();
  }

  getExpenses() {
    this.http.get<ExpenseModel[]>(`${this.url}getexpenses`)
    .subscribe(result => {
      this.expenses = result;
      console.log('get the data sarrr ' + this.expenses);
      this.UpdatedExpenses.next([...this.expenses]);
    });

  }

  addExpense( expenseDetail: FormGroup) {
    // const ExpenseData = new FormData();
    // ExpenseData.append('date', expenseDetail.value.date);
    // ExpenseData.append('category', expenseDetail.value.category);
    // ExpenseData.append('amount', expenseDetail.value.amount);
    // ExpenseData.append('type', expenseDetail.value.type);
    const ExpenseData: ExpenseModel = {
        _id: null,
        date: expenseDetail.value.date,
        category: expenseDetail.value.category,
        amount: expenseDetail.value.amount,
        type: expenseDetail.value.type,
    };
    console.log(ExpenseData);
    this.http.post<{result: string, message: string}>(`${this.url}editexpenses`, ExpenseData). 
    subscribe(
      res => {
          console.log(res.message);

          const expense: ExpenseModel = {
          _id: res.result, 
          date: expenseDetail.value.date,
          category: expenseDetail.value.category,
          amount: expenseDetail.value.amount,
          type: expenseDetail.value.type,
         }
          this.expenses.push(expense);
          this.UpdatedExpenses.next([...this.expenses]);
          this.routs.navigate(['']);
      } 
    );

  }

  deleteExpense(id: string) {
    this.http.delete(this.url + 'deleteexpense/' + id)
    .subscribe(() => {
    const updatedExpenses = this.expenses.filter(expense => expense._id !== id );
    console.log(updatedExpenses);
    this.expenses = updatedExpenses;
    this.UpdatedExpenses.next([...this.expenses]);
    });
    }

    updateExpense(expenseDetail: FormGroup , id: string) {
      const ExpenseData: ExpenseModel = {
        _id: null,
        date: expenseDetail.value.date,
        category: expenseDetail.value.category,
        amount: expenseDetail.value.amount,
        type: expenseDetail.value.type,
    };
      this.http.put(this.url + 'editexpenses/' + id, ExpenseData)
       .subscribe(response => {
        const updatedExpenses = [...this.expenses];
        const oldPostIndex = updatedExpenses.findIndex(p => p._id === id);
        const expense: ExpenseModel = {
          _id: id, 
          date: expenseDetail.value.date,
          category: expenseDetail.value.category,
          amount: expenseDetail.value.amount,
          type: expenseDetail.value.type,
         }
        updatedExpenses[oldPostIndex] = expense;
        this.expenses = updatedExpenses;
        this.UpdatedExpenses.next([...this.expenses]);
        this.routs.navigate(['']);
      });

    }
    getExpenseOne(id: string) {
      return this.http.get<{_id: string, date: string, category: string,
       amount: string, type: string}>(this.url+'findone/' + id);
     }

     getCategories() {
       return this.http.get<{}>(`${this.url}findcategory`);
     }
}
