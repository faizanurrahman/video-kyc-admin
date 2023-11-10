import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LoanRateService {
  private apiUrl = environment.apiUrl + '/pfsvc/getLoanRates';

  constructor(private http: HttpClient) {}

  getLoanRates(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}`);
  }
}
