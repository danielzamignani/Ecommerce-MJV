/* eslint-disable prettier/prettier */
import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

export const GetSellerPaymentsResponseSchema: SchemaObject = {
  example: [{
    'orderId': '5649deb1-e4d2-40f9-9ae7-c8c1b5ecd158',
    'amount': 1000,
    "status": "Approved",
    "created_at": "2021-01-01T00:00:00.000Z",
  },
  {
    'orderId': '5649deb1-e4d2-40f9-9ae7-c8c1b5ecd158',
    'amount': 1000,
    "status": "Approved",
    "created_at": "2021-01-01T00:00:00.000Z",
  }]
}