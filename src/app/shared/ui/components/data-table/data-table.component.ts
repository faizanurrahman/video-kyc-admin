import {CommonModule} from '@angular/common';
import {Component, Input} from '@angular/core';
import {HttpLoaderService} from '@core/services/http-loader.service';

// import * as $ from 'jquery';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class DataTableComponent {
    @Input() rows: [] = [];
    @Input() columns: string[] = [];
    @Input() contentProjected: boolean = false;

    constructor(public loaderService: HttpLoaderService) {
    }
}
