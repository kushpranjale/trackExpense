import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import {ExpenseModel} from '../models/ExpenseseModel';
import {MatTableDataSource, MatPaginator, MatSort, MatSnackBar} from '@angular/material';
import { ExpensesService } from '../services/expenses.service';
import { Subscription, from } from 'rxjs';

@Component({
  selector: 'app-your-expenses',
  templateUrl: './your-expenses.component.html',
  styleUrls: ['./your-expenses.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class YourExpensesComponent implements OnInit {

  private StaffSub= new Subscription();
  displayedColumns = ['Date', 'Category' , 'Type',  'Amount', 'Action'];
   staffData: ExpenseModel[] = [];
   isResultsLoading = false;
    dataSource;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;



  constructor( private router: Router , private expenseService: ExpensesService, private snackBar: MatSnackBar) { }

 saveBtnHandler() {
     this.router.navigate(['add-expense']);
            }

   onEdit(id: string) {
        console.log(id);
        this.router.navigate(['add-expense', id]);
        }

  ngOnInit() {
   // this.isResultsLoading = true;
    this.expenseService.getExpenses();
    this.expenseService.getExpenseUpdateListener().subscribe(result => {
      this.staffData = result;
      console.log(this.dataSource);
      this.dataSource = new MatTableDataSource(this.staffData);
      this.dataSource.paginator = this.paginator;
      this.isResultsLoading = false;
  });
}
ngOnDestroy() {
  this.StaffSub.unsubscribe();
}


onDelete(id: string) {
  console.log('id foe delete '+id);
  this.expenseService.deleteExpense(id);

// this.snackBar.open('Deleted', 'ok' , {
//   duration: 2000,
// });

  // console.log('triggered delete wit id' + id);
}
applyFilter(filterValue: string) {
  filterValue = filterValue.trim(); // Remove whitespace
  filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
  this.dataSource.filter = filterValue;
  console.log(filterValue);
}

}


