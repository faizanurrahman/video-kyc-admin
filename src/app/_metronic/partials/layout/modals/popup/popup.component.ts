import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import {
  NgbModal,
  NgbModalConfig,
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';
import { NgbModalBackdrop } from '@ng-bootstrap/ng-bootstrap/modal/modal-backdrop';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { NgIf, NgClass } from '@angular/common';

export interface PopupData {
  title?: string;

  dismissButtonLabel?: string;
  closeButtonLabel?: string;
  shouldClose?(): Promise<any> | any;
  shouldDismiss?(): Promise<any> | any;
  onClose?(): Promise<any> | any;
  onDismiss?(): Promise<any> | any;
  disableCloseButton?(): boolean;
  disableDismissButton?(): boolean;
  hideCloseButton?(): boolean;
  hideDismissButton?(): boolean;

  showHeader?: boolean;
  showFooter?: boolean;
  showCloseButton?: boolean;
  showDismissButton?: boolean;
  showCancelButton?: boolean;
}
export interface PopupConfig {
  data: PopupData;
  config?: Partial<NgbModalConfig>;
}

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    InlineSVGModule,
    NgClass,
  ],
})
export class PopupComponent {
  @Input() public popupConfig: PopupConfig;
  private modalRef: NgbModalRef;
  private modalBackdrop: NgbModalBackdrop;

  @ViewChild('modal') public modalContent: TemplateRef<any>;

  constructor(private ngbModalService: NgbModal) {}

  open(config: Partial<PopupConfig> = {}): Promise<any> {
    // safty check and merge config
    if (config) {
      this.popupConfig = { ...this.popupConfig, ...config };
    }
    return new Promise<any>(resolve => {
      this.modalRef = this.ngbModalService.open(
        this.modalContent,
        this.popupConfig.config || {},
      );

      this.modalRef.result.then(resolve, resolve);
    });
  }

  async close(): Promise<any> {
    if (
      this.popupConfig.data.shouldClose === undefined ||
      (await this.popupConfig.data.shouldClose())
    ) {
      const result =
        this.popupConfig.data.onClose === undefined ||
        (await this.popupConfig.data.onClose());
      this.modalRef.close(result);
    }
  }

  async dismiss(): Promise<any> {
    if (this.popupConfig.data.disableDismissButton !== undefined) {
      return;
    }

    if (
      this.popupConfig.data.shouldDismiss === undefined ||
      (await this.popupConfig.data.shouldDismiss())
    ) {
      const result =
        this.popupConfig.data.onDismiss === undefined ||
        (await this.popupConfig.data.onDismiss());
      this.modalRef.dismiss(result);
    }
  }
}
