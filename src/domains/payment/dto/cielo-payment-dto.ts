export class CieloPaymentDTO {
  merchantOrderId: string;
  payment: {
    type: string;
    authenticate: false;
    amount: number;
    debitCard: {
      cardNumber: string;
      holder: string;
      expirationDate: string;
      securityCode: string;
      brand: string;
    };
    isCryptoCurrencyNegotiation: true;
  };
}
