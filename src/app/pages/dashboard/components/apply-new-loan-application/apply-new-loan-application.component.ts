import { NgFor, NgIf } from '@angular/common';
import { Component, HostBinding, Input, NgZone, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  LoanApplicationProductType,
  LoanApplicationSectorType,
  LoanApplicationType,
} from '@lam/models/loan-application.enum';
import { LoanApplicationService } from '@lam/services/loan-application.service';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { PlayButtonPrimaryComponent } from '@shared/ui/components/buttons/play-button-primary/play-button-primary.component';
import { LoaderComponent } from '@shared/ui/components/loader/loader.component';
import { InlineSVGModule } from 'ng-inline-svg-2';

interface LoanType {
  id: number;
  name: string;
  type: LoanApplicationType;
}

interface ProductType {
  id: number;
  name: string;
  type: LoanApplicationProductType;
}

interface SectorType {
  id: number;
  name: string;
  type: LoanApplicationSectorType;
}

@Component({
  selector: 'app-apply-new-loan-application',
  templateUrl: './apply-new-loan-application.component.html',
  styleUrls: ['./apply-new-loan-application.component.scss'],
  standalone: true,
  imports: [
    InlineSVGModule,
    FormsModule,
    ReactiveFormsModule,
    NgFor,
    NgbTooltip,
    NgIf,
    PlayButtonPrimaryComponent,
    LoaderComponent,
  ],
})
export class ApplyNewLoanApplicationComponent implements OnInit {
  @Input() bgColor: string = '';
  @Input() minWith: string = '250px';
  @HostBinding('class') class = 'd-flex flex-column bg-light-danger';
  @HostBinding('style') style = '';

  //

  loading: boolean = false;

  loanApplicationSectorFormControl: FormControl = new FormControl(null, [Validators.required]);

  loanApplicationProductTypeControl: FormControl = new FormControl(null, [Validators.required]);

  constructor(
    private ngZone: NgZone,
    private router: Router,
    private loanApplicationService: LoanApplicationService,
  ) {}

  togglePlayButton() {
    if (
      !!this.loanApplicationSectorFormControl.value &&
      !!this.loanApplicationProductTypeControl.value
    ) {
      this.loading = !this.loading;
      this.loanApplicationService.loanApplicationSector =
        this.loanApplicationSectorFormControl.value;

      this.loanApplicationService.loanApplicationProductType =
        this.loanApplicationProductTypeControl.value;

      setTimeout(() => {
        this.ngZone.run(() => {
          let url =
            this.loanApplicationProductTypeControl.value !== 'mabogoDinku'
              ? 'loan-application-management'
              : 'loan-application-management';
          this.router.navigate([url], {
            queryParams: {
              sector: this.loanApplicationSectorFormControl.value,
              productType: this.loanApplicationProductTypeControl.value,
            },
          });
        });
      }, 1000);
    } else {
    }
  }

  sectorTypes: SectorType[] = [
    { id: 1, name: 'Agri Business', type: 'agriBusiness' },
    { id: 2, name: 'Manufacturing', type: 'manufacturing' },
    { id: 3, name: 'Property', type: 'property' },
    { id: 4, name: 'Services', type: 'services' },
  ];

  productTypes: ProductType[] = [
    {
      id: 1,
      name: 'CEDA Mainline',
      type: 'cedaMainline',
    },
    {
      id: 2,
      name: 'Cooperative',
      type: 'cooperative',
    },
    {
      id: 3,
      name: 'Letlhabile',
      type: 'letlhabile',
    },
    {
      id: 4,
      name: 'Mabogo Dinku',
      type: 'mabogoDinku',
    },

    {
      id: 5,
      name: 'Trade Finance',
      type: 'tradeFinance',
    },
  ];

  ngOnInit(): void {
    if (this.bgColor.startsWith('bg-', 0)) {
      this.class += ` ${this.bgColor}`;
    } else {
      this.style += ` background-color: ${this.bgColor}`;
    }

    this.style += ` min-width: ${this.minWith}`;
  }
}
