interface PaymentHistory {
  cedaTransactionRefId: string;
  externalTransactionRefId: string;
  transactionDate: string;
  transactionAmount: string;
  transactionCurrency: string;
  transactionType: string;
  contractNumber: string;
}

export type PaymentHistoryModel = Partial<PaymentHistory>;
