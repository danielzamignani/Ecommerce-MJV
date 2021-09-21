/* eslint-disable prettier/prettier */
import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

export const validatePaymentResponseSchema: SchemaObject = {
  example: {
    "orderId": "8eb5f570-3c0b-496e-8f48-be5154cdf6ab",
    "amount": 1000,
    "status": "Approved",
    "created_at": "2021-00-00T00:00:00.000Z"
  },
};
