/* eslint-disable prettier/prettier */
import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

export const SellerWalletResponse: SchemaObject = {
  example: {
    "id": "fbd09b11-66aa-4782-83d5-18cd3d53d0c0",
    "sellerName": "Diogo Renato Almada",
    "amount": 4000,
    "transaction": [
      {
        "id": "998792e7-96ab-4070-9d71-2a6ac2bb4789",
        "amount": 1000,
        "orderId": "62c7f97a-497e-4701-9edc-3e98c5a47b9a"
      }
    ]
  }
}