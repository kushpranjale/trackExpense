import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, Validators, FormControl, FormGroupDirective } from '@angular/forms';
import {ExpensesService} from '../services/expenses.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ExpenseModel } from '../models/ExpenseseModel';
import { CategoryModel } from '../models/categor.model';

@Component({
  selector: 'app-add-expense',
  templateUrl: './add-expense.component.html',
  styleUrls: ['./add-expense.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AddExpenseComponent implements OnInit {

  expensesGroup: FormGroup;
  expense: ExpenseModel;
  submitted = false;
  private mode = 'create';

  options: string[] = [];
  private id: string;

  constructor( private router: Router, private expenseService: ExpensesService, private activateRoute: ActivatedRoute) { }

  ngOnInit() {

  this.expensesGroup = new FormGroup (
    {
      date: new FormControl('', [Validators.required]),
      category: new FormControl('', [Validators.required]),
      type: new FormControl('', [Validators.required]),
      amount: new FormControl('', [Validators.required, Validators.pattern('[0-9]*')]),
    }
  );

  this.expenseService.getCategories().subscribe( (result: CategoryModel[])=> {
   console.log(result);
    result.forEach(value => {
      console.log(value.category);
      this.options.push(value.category)
    })
   });
   
   console.log(this.options)
  this.activateRoute.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('id')) {
        this.mode = 'edit';
        this.id = paramMap.get('id');
        this.expenseService.getExpenseOne(this.id).subscribe(expenseData => {
          console.log('here is expense data '+expenseData);
          this.expense = {_id: expenseData._id, date: expenseData.date, category: expenseData.category,
                        amount: expenseData.amount, type: expenseData.type};
          this.expensesGroup.setValue({
            date: this.expense.date,
            category: this.expense.category,
            amount: this.expense.amount,
            type: this.expense.type,
       });
      });
      } else {
        this.mode = 'create';
        this.id = null;
      }

    });
  }
  saveBtnHandler() {
    this.router.navigate(['']);
           }

   onSubmit(formDirective: FormGroupDirective) {
     if( this.mode === 'create') {
       console.log(this.expensesGroup.get('amount'))
     if(this.expensesGroup.invalid) {
      this.submitted = true;
      return;
       } else {
       this.expenseService.addExpense(this.expensesGroup);
     }
     formDirective.resetForm();
     this.expensesGroup.reset();
   } else {
     this.expenseService.updateExpense(this.expensesGroup, this.id);
   }
  }

}
