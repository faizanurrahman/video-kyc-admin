import { Injectable } from '@angular/core';
import { AES, enc } from 'crypto-js';

@Injectable({
  providedIn: 'root',
})
export class CryptoService {
  private secretKey = 'my-secret-key'; // Replace this with your own secret key

  constructor() {}

  encrypt(data: string): string {
    return AES.encrypt(data, this.secretKey).toString();
  }

  decrypt(data: string | null): string {
    if(data === null) {
      return '';
    }
    const bytes = AES.decrypt(data, this.secretKey);
    return bytes.toString(enc.Utf8);
  }
}
