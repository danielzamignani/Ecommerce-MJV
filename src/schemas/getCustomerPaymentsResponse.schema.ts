/* eslint-disable prettier/prettier */
import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

export const GetCustomerPaymentsResponseSchema: SchemaObject = {
  example: [{
    'orderId': '5649deb1-e4d2-40f9-9ae7-c8c1b5ecd158',
    'amount': 1000,
    "status": "Approved",
    "created_at": "2021-01-01T00:00:00.000Z",
    "debitCard": {
      "id": "6d2d7d74-a3e9-45c1-9c92-d0d8725aa4e8",
      "holder": "Vinicius Anderson da Conceição",
      "brand": "Visa",
      "cardNumber": "4929465240388130",
      "expirationDate": "12/2080",
      "securityCode": "123"
    }
  },
  {
    'orderId': '5649deb1-e4d2-40f9-9ae7-c8c1b5ecd158',
    'amount': 1000,
    "status": "Approved",
    "created_at": "2021-01-01T00:00:00.000Z",
    "debitCard": {
      "id": "6d2d7d74-a3e9-45c1-9c92-d0d8725aa4e8",
      "holder": "Vinicius Anderson da Conceição",
      "brand": "Visa",
      "cardNumber": "4929465240388130",
      "expirationDate": "12/2080",
      "securityCode": "123"
    }
  }
]
}