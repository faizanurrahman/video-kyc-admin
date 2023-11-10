import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-purchase-toolbar',
  templateUrl: './purchase-toolbar.component.html',
  standalone: true,
})
export class PurchaseToolbarComponent implements OnInit {
  appPurchaseUrl: string = 'app purchase url';

  constructor() {}

  ngOnInit(): void {}
}
