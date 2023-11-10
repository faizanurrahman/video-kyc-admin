import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';

import { delay, of, Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { statusTableDummyData } from './status-table-dummy-data';
import { StatusTableModel } from './status-table.model';

@Component({
  selector: 'app-status-table',
  templateUrl: './status-table.component.html',
  styleUrls: ['./status-table.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class StatusTableComponent implements OnInit, OnDestroy {
  // Subscription cleanup
  private readonly destroy$ = new Subject<void>();

  @Input() title: string;

  // === Backend Url ===
  private readonly _backendURL: string = 'http://localhost:3000';

  public statusTableData: StatusTableModel[] = [];

  // Lifecycle Hooks
  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {
    // Fetch the records from the backend
    this.fetchRecords();
  }
  ngOnInit(): void {}
  ngOnDestroy(): void {
    // Subscription cleanup
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Fetch the records from the dummy data
  public fetchRecords(): void {
    of(statusTableDummyData)
      .pipe(delay(1500))
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.statusTableData = res;
        // If doesn't work, enable change detection
        //this.cdr.detectChanges();
      });

    // ========== Uncomment this to fetch from the backend ==========
    // this.http
    //   .get<StatusTableModel[]>(`${this._backendURL}/status-table`)
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe((statusTableData: StatusTableModel[]) => {
    //     this.statusTableData = statusTableData;

    //     // If doesn't work, enable change detection
    //     // this.cdr.detectChanges();
    //   });
  }

  public saveStatus(savePayload: any): void {
    // dummy popup
    Swal.fire({
      title: 'Saved!',
      text: 'The status has been saved.',
      icon: 'success',
      confirmButtonText: 'Ok',
    });

    // ========== Uncomment this to save to the backend ==========
    // Save the status to the backend
    // this.http.post(`${this._backendURL}/save-status-table`, savePayload).subscribe((res) => {
    //   if (true) {
    //     // if success

    //     this.fetchRecords();
    //     Swal.fire({
    //       title: 'Saved!',
    //       text: 'The status has been saved.',
    //       icon: 'success',
    //       confirmButtonText: 'Ok',
    //     });

    //   } else {
    //     // if error
    //     Swal.fire({
    //       title: 'Error!',
    //       text: 'The status could not be saved.',
    //       icon: 'error',
    //       confirmButtonText: 'Ok',
    //     });
    //   }
    // });
  }

  statusChanged(item: StatusTableModel) {
    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to change the status of ${item.name} to ${item.status}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, change it!',
      cancelButtonText: 'No, keep it',
    }).then(result => {
      if (result.isConfirmed) {
        this.saveStatus(item); // create your payload according to your backend
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'The status remains the same', 'error');
        this.fetchRecords();
      }
    });
  }
}
