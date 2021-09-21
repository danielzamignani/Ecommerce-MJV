/* eslint-disable prettier/prettier */
import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

export const CieloRequisitonResponseSchema: SchemaObject = {
  example: {
    "MerchantOrderId": "8eb5f570-3c0b-496e-8f48-be5154cdf6ab",
    "Customer": {
      "Name": "Vinicius Anderson da Conceição"
    },
    "Payment": {
      "DebitCard": {
        "CardNumber": "492946******8130",
        "Holder": "Vinicius Anderson da Conceição",
        "ExpirationDate": "12/2080",
        "SaveCard": false,
        "Brand": "Visa"
      },
      "Provider": "Simulado",
      "AuthenticationUrl": "https://authenticationmocksandbox.cieloecommerce.cielo.com.br/CardAuthenticator/Receive/6f7b8493-fe18-4d10-9b45-a6df74d1dc59",
      "Tid": "0921104412286",
      "ProofOfSale": "443542",
      "Authenticate": true,
      "Recurrent": false,
      "Amount": 1000,
      "ReceivedDate": "2021-09-21 10:44:12",
      "ReturnUrl": "http://api.webhookinbox.com/i/qu69oMLE/in/",
      "Status": 0,
      "IsSplitted": false,
      "ReturnCode": "1",
      "PaymentId": "6f7b8493-fe18-4d10-9b45-a6df74d1dc59",
      "Type": "DebitCard",
      "Currency": "BRL",
      "Country": "BRA",
      "Links": [
        {
          "Method": "GET",
          "Rel": "self",
          "Href": "https://apiquerysandbox.cieloecommerce.cielo.com.br/1/sales/6f7b8493-fe18-4d10-9b45-a6df74d1dc59"
        }
      ]
    }
  },
};
