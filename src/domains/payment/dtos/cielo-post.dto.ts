export class CieloPostDTO {
  MerchantOrderId: string;
  Customer: {
    Name: string;
  };
  Payment: {
    Type: string;
    Authenticate: boolean;
    Amount: number;
    ReturnUrl: string;
    DebitCard: {
      CardNumber: string;
      Holder: string;
      ExpirationDate: string;
      SecurityCode: string;
      Brand: string;
    };
  };
}
