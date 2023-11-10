import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { SwalComponent, SwalPortalTargets, SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { SweetAlertOptions } from 'sweetalert2';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
  standalone: true,
  imports: [SweetAlert2Module],
})
export class NotificationComponent implements OnInit, AfterViewInit {
  @ViewChild('customSuccessToast', {
    read: SwalComponent,
    static: true,
  })
  public readonly toast!: SwalComponent;

  toastOptionsMixin: SweetAlertOptions = {
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 4000,
    timerProgressBar: true,
    customClass: {
      popup: [],
      title: [],
      icon: [],
      timerProgressBar: [],
      actions: [],
      confirmButton: [],
      cancelButton: [],
      closeButton: [],
      denyButton: [],
      footer: [],
      container: [],
      htmlContainer: [],
      image: [],
      input: [],
      loader: [],
      validationMessage: [],
    },
    stopKeydownPropagation: true,
  };

  @ViewChild('successToast') successToast: SwalComponent;
  successToastOption: SweetAlertOptions = {
    ...this.toastOptionsMixin,
  };

  @ViewChild('failureToast') failureToast: SwalComponent;
  failureToastOption: SweetAlertOptions = {
    ...this.toastOptionsMixin,
  };

  @ViewChild('warningToast') warningToast: SwalComponent;
  warningToastOption: SweetAlertOptions = {
    ...this.toastOptionsMixin,
  };

  @ViewChild('infoToast') infoToast: SwalComponent;
  infoToastOption: SweetAlertOptions = {
    ...this.toastOptionsMixin,
  };

  @ViewChild('questionToast') questionToast: SwalComponent;

  constructor(public readonly portalTargets: SwalPortalTargets) {
    // // console.log('NotificationComponent constructor');
  }

  ngOnInit() {}

  ngAfterViewInit() {
    // // console.log('NotificationComponent ngAfterViewInit');
  }

  public showSuccessToast() {
    this.toast.fire().then();
  }

  public showSuccess(title: string, message: string, options: Partial<SweetAlertOptions> = {}) {
    this.successToastOption = {
      ...this.toastOptionsMixin,

      customClass: {
        popup: 'bg-light-success',
      },
      icon: 'success',
      titleText: title,
      text: message,
      ...options,
    };
    setTimeout(() => {
      this.successToast.fire().then(() => ''); // // console.log('success toast fired'));
    });
  }

  public showFailure(title: string, message: string, options: Partial<SweetAlertOptions> = {}) {
    this.failureToastOption = {
      ...this.toastOptionsMixin,

      customClass: {
        popup: 'bg-light-danger',
      },
      icon: 'error',
      titleText: title,
      text: message,
      ...options,
    };

    setTimeout(() => {
      this.failureToast.fire().then(() => ''); // // console.log('failure toast fired'));
    });
  }

  public showInfo(title: string, message: string, options: Partial<SweetAlertOptions> = {}) {
    this.infoToastOption = {
      ...this.toastOptionsMixin,

      customClass: {
        popup: 'bg-light-info',
      },
      icon: 'info',
      titleText: title,
      text: message,
      ...options,
    };
    setTimeout(() => {
      this.infoToast.fire().then(() => ''); // // console.log('info toast fired'));
    });
  }

  public showWarning(title: string, message: string, options: Partial<SweetAlertOptions> = {}) {
    this.warningToastOption = {
      ...this.toastOptionsMixin,

      customClass: {
        popup: 'bg-light-warning',
      },
      icon: 'warning',
      titleText: title,
      text: message,
      ...options,
    };
    setTimeout(() => {
      this.warningToast.fire().then(() => {
        // // console.log('warn toast fired');
      });
    });
  }

  public showQuestion(title: string, message: string, options: Partial<SweetAlertOptions> = {}) {
    this.toastOptionsMixin = {
      ...this.toastOptionsMixin,
      customClass: {
        popup: 'bg-dark text-white',
        title: ['text-white', 'text-bolder'],
        container: ['text-white'],
      },
      icon: 'question',
      titleText: title,
      text: message,

      ...options,
    };

    setTimeout(() => {
      this.questionToast.fire().then(() => {
        // // console.log('Question toast fired.');
      });
    });
  }

  onDestroy() {
    // // console.log('NotificationComponent onDestroy');
  }
}
