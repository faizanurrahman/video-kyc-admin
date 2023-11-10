import { Injectable } from '@angular/core';
import { CryptoService } from './crypto.service';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class SecureStorageService {
  constructor(private storage: StorageService, private crypto: CryptoService) {}

  set(
    key: string,
    value: any,
    type: 'local' | 'session' | 'cookie' = 'local',
    expires?: number,
    path?: string,
  ) {
    const encryptedValue = this.crypto.encrypt(value);
    this.storage.set(key, encryptedValue, type, expires, path);
  }

  get(key: string, type: 'local' | 'session' | 'cookie' = 'local') {
    const encryptedValue = this.storage.get(key, type);
    return this.crypto.decrypt(encryptedValue);
  }

  remove(key: string, type: 'local' | 'session' | 'cookie' = 'local') {
    this.storage.remove(key);
  }

  clear(type: 'local' | 'session' | 'cookie' = 'local') {
    this.storage.clear();
  }
}
