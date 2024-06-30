import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { OrdersService } from 'src/app/core/services/orders.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent implements OnInit, AfterViewInit {
  @Input() key: number;
  breadCrumbItems: Array<{}>;
  dataSource: any = [];
  loading: boolean;

  constructor(public ordersService: OrdersService) { }

  ngAfterViewInit(): void {
    this.GetAllOrderDetails(this.key);
  }


  ngOnInit(): void {
    this.GetAllOrderDetails(this.key);

  }

  GetAllOrderDetails(OrderId) {
    this.loading = true;
    this.ordersService.GetAllOrderDetails(OrderId).subscribe({
      next: (data) => {
        const response = JSON.parse(JSON.stringify(data));
        this.dataSource = response;
        this.loading = false;
      }
    })
  }

}
