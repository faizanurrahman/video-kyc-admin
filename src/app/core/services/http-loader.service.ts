import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpLoaderService {
  readonly loadingBS = new BehaviorSubject<boolean>(false);
  readonly loading$ = this.loadingBS.asObservable();

  get loading() {
    return this.loadingBS.value;
  }

  loadingMap: Map<string, boolean> = new Map<string, boolean>();

  constructor() {}

  setLoading(isLoading: boolean, url: string) {
    if (!url) {
      throw Error('url must be provided to set loading');
    }

    if (isLoading) {
      this.loadingMap.set(url, true);
      this.loadingBS.next(true);
    } else if (!isLoading && this.loadingMap.has(url)) {
      this.loadingMap.delete(url);
    }

    if (this.loadingMap.size === 0) {
      this.loadingBS.next(false);
    }
  }

  isLoading(url: string) {
    return !!!this.loadingMap.get(url);
  }

  // getLoading()
}
