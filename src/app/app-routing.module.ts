import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { YourExpensesComponent } from './your-expenses/your-expenses.component';
import { AddExpenseComponent } from './add-expense/add-expense.component';


const routes: Routes = [
{  path : '',
  component: YourExpensesComponent},
 {
   path : 'add-expense',
   component: AddExpenseComponent
 },
 {
   path : 'add-expense/:id',
   component : AddExpenseComponent
 }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
