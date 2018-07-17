import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PaginationAndSortingComponent } from './order-history/pagination-and-sorting/pagination-and-sorting.component';
import { OrderHistoryComponent } from './order-history/container/order-history.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { FormsModule } from '@angular/forms';
import { YDatePipe } from '../../pipes/yDatePipe';

@NgModule({
  imports: [CommonModule, RouterModule, FormsModule],
  declarations: [
    OrderHistoryComponent,
    PaginationAndSortingComponent,
    OrderDetailsComponent,
    YDatePipe
  ],
  exports: [OrderHistoryComponent, OrderDetailsComponent]
})
export class OrderModule {}
