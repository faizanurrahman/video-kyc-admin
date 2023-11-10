import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private storageTypes = {
    local: localStorage,
    session: sessionStorage,
    cookie: document.cookie,
  };

  set(
    key: string,
    value: any,
    type: 'local' | 'session' | 'cookie' = 'local',
    expires?: number,
    path?: string,
  ): void {
    if (type === 'cookie') {
      const cookieExpires = expires
        ? `expires=${new Date(Date.now() + expires).toUTCString()}`
        : '';
      const cookiePath = path ? `path=${path}` : '';
      document.cookie = `${key}=${JSON.stringify(
        value,
      )}; ${cookieExpires}; ${cookiePath}`;
    } else {
      this.storageTypes[type].setItem(key, JSON.stringify(value));
    }
  }

  get(key: string, type: 'local' | 'session' | 'cookie' = 'local'): any {
    if (type === 'cookie') {
      const cookieValue = document.cookie
        .split(';')
        .find((c: string) => c.trim().startsWith(`${key}=`));
      return cookieValue ? JSON.parse(cookieValue.split('=')[1]) : null;
    } else {
      const value = this.storageTypes[type].getItem(key);
      return value ? JSON.parse(value) : null;
    }
  }

  remove(key: string, type: 'local' | 'session' | 'cookie' = 'local'): void {
    if (type === 'cookie') {
      document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    } else {
      this.storageTypes[type].removeItem(key);
    }
  }

  clear(type: 'local' | 'session' | 'cookie' = 'local'): void {
    if (type === 'cookie') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf('=');
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      }
    } else {
      this.storageTypes[type].clear();
    }
  }
}
