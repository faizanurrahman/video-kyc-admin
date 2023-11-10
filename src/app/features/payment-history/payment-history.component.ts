import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  LOCALE_ID,
  ViewEncapsulation,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { TooltipModule } from 'primeng/tooltip';
import { HttpLoaderService } from '../../core/services/http-loader.service';
import { SweetAlertService } from '../../core/services/sweet-alert.service';
import { UserDataService } from '../../core/services/user-data.service';
import { CustomDatePipe } from './custom-date.pipe';
import { PaymentHistoryModel } from './payment-history.model';
import { PaymentHistoryService } from './payment-history.service';

@Component({
  selector: 'app-payment-history',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, CustomDatePipe, TooltipModule],
  templateUrl: './payment-history.component.html',
  styleUrls: ['./payment-history.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DatePipe, DecimalPipe, { provide: LOCALE_ID, useValue: 'en-GB' }],
})
export class PaymentHistoryComponent {
  constructor(
    private paymentHistoryService: PaymentHistoryService,

    private cdr: ChangeDetectorRef,
    public loader: HttpLoaderService,
    private datePipe: DatePipe,
    private userDataService: UserDataService,
    private destroyRef: DestroyRef,
    private decimalPipe: DecimalPipe,
    private swalService: SweetAlertService,
  ) {
    this.paymentHistoryService.getAllPayments().subscribe((res: PaymentHistoryModel[]) => {
      this.paymentHistory = res;
    });
  }

  public paymentHistory: PaymentHistoryModel[] = [];

  getDecimalValue(value: string) {
    const numericValue = parseFloat(value.replace(/,/g, '')); // Remove existing commas
    return this.decimalPipe.transform(numericValue, '1.2')?.toString() || '';
  }
  generatePremiumPaymentHistoryPDF(paymentHistory: any) {
    // Create a new PDF document
    const doc = new jsPDF();

    // Define the content styling
    const fontSize = 12;
    const lineHeight = 12;
    const marginLeft = 20;
    const marginTop = 10;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Set the font size and line height
    doc.setFontSize(fontSize);
    doc.setLineHeightFactor(lineHeight / fontSize);

    // Logo and Company Information
    const logoUrl = './assets/media/logos/ceda-logo-transparent.png';
    const companyInfo = {
      name: 'CEDA Online Services',
      address: 'Four Thirty Square, Plot 54350, PG Matante Road CBD, Gaborone',
      addressLine1: 'Four Thirty Square, Plot 54350',
      addressLine2: 'PG Matante Rd CBD, Gaborone',
      phone: 'T : +267 317 0895',
      email: 'feedback@ceda.co.bw',
    };

    // Define title text
    const title = 'Payment Details';

    // Get the current date
    const today = new Date();
    const formattedDate = today.toLocaleDateString();

    // Background color for the header
    // doc.setFillColor(56, 126, 189); // Header background color (RGB)
    // doc.rect(0, 0, pageWidth, 60, 'F');

    // Set text color to white for the header
    doc.setTextColor(102, 73, 65); // RGB color for text

    // Add the logo to the PDF (adjust the coordinates and size as needed)
    const logoWidth = 40; // Width of the logo in mm
    const logoHeight = 20; // Height of the logo in mm
    doc.addImage(logoUrl, 'PNG', marginLeft, 10, logoWidth, logoHeight);

    // Set the font style to bold for the company name
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18); // Font size for the company name
    doc.text(companyInfo.name, marginLeft, 20 + logoHeight);

    // Reset font style and color
    doc.setTextColor(0, 0, 0); // Reset text color to black
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);

    // Add the rest of the company information
    let leftGap = 60 + marginLeft + logoWidth;
    let topGap = marginTop;

    doc.text(companyInfo.addressLine1, leftGap, topGap);
    doc.text(companyInfo.addressLine2, leftGap, topGap + 5);
    doc.text(companyInfo.phone, leftGap, topGap + 13);
    doc.text(companyInfo.email, leftGap, topGap + 21);

    // Set the font style to bold for the title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(15); // Font size for the title
    doc.text(title, pageWidth / 2, topGap + 55, { align: 'center' });
    doc.setFont('helvetica', 'normal'); // Reset font style

    // Payment History Details
    const tableHeaders = [
      ['#', 'Field', 'Value'],
      ['1', 'CEDA Transaction Ref ID:', paymentHistory.cedaTransactionRefId],
      ['2', 'External Transaction Ref ID:', paymentHistory.externalTransactionRefId],
      ['3', 'Transaction Date:', paymentHistory.transactionDate],
      [
        '4',
        'Transaction Amount:',
        `${paymentHistory.transactionAmount} ${paymentHistory.transactionCurrency}`,
      ],
      ['5', 'Transaction Type:', paymentHistory.transactionType],
      ['6', 'Contract Number:', paymentHistory.contractNumber],
    ];

    // Calculate the height required for the payment history text
    const paymentHistoryTextHeight = doc.getTextDimensions(tableHeaders.toString(), {
      maxWidth: pageWidth - marginLeft * 2,
    }).h;

    // Check if there's enough space for the payment history text
    const availableSpace = pageHeight - 100 - logoHeight; // Adjust startY position
    if (paymentHistoryTextHeight > availableSpace) {
      // Add a new page if there's not enough space
      doc.addPage();
    }

    // Create a table for payment history
    // @ts-ignore
    doc.autoTable({
      head: [['#', 'Field', 'Value']],
      body: tableHeaders.slice(1), // Exclude the headers row
      startY: 70, // Adjust the startY position
      theme: 'striped', // Apply a striped theme for the table
      margin: { top: 70 }, // Adjust the margin for the table
      headStyles: {
        fillColor: [160, 32, 19],
      },
    });

    // Add the date below the address
    doc.setFontSize(12); // Font size for the date
    doc.text(`Date: ${formattedDate}`, marginLeft, pageHeight - 10);

    // Save or download the PDF
    const fileName = `payment-history-${paymentHistory.cedaTransactionRefId}.pdf`;
    doc.save(fileName);
  }
}
