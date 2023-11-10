import { Injectable } from '@angular/core';
import Swal, { SweetAlertOptions } from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class SweetAlertService {
  centerModalMixin = Swal.mixin({
    position: 'center',
    showConfirmButton: true,
    allowEnterKey: true,
    allowOutsideClick: true,
    backdrop: true,
    // showClass: {
    //   popup: 'animate__animated animate__faster animate__shakeX', // Use your animation classes here
    // },
    // hideClass: {
    //   popup: 'animate__animated animate__faster animate__fadeOut', // Use your animation classes here
    // },
  });

  constructor() {}

  success(title: string, text: string, config: SweetAlertOptions = {}) {
    return this.centerModalMixin.fire({
      title: title,
      text: text,
      icon: 'success',
      ...config,
      heightAuto: false,
    });
  }

  error(title: string, text: string, config: SweetAlertOptions = {}) {
    return this.centerModalMixin.fire({
      title: title,
      text: text,
      icon: 'error',
      ...config,
      heightAuto: false,
    });
  }

  warning(title: string, text: string, config: SweetAlertOptions = {}) {
    return this.centerModalMixin.fire({
      title: title,
      text: text,
      icon: 'warning',
      ...config,

      heightAuto: false,
    });
  }

  info(title: string, text: string, config: SweetAlertOptions = {}) {
    return this.centerModalMixin.fire({
      title: title,
      text: text,
      icon: 'info',
      ...config,
      heightAuto: false,
    });
  }

  question(title: string, text: string, config: SweetAlertOptions = {}) {
    const scrollTop =
      window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
    return this.centerModalMixin.fire({
      title: title,
      text: text,
      icon: 'question',
      ...config,
      heightAuto: false,
    });
  }
}
