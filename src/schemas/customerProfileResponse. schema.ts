/* eslint-disable prettier/prettier */
import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

export const CustomerProfileResponseSchema: SchemaObject = {
  example: {
    'id': '8d035cc6-d944-4cdf-8d6e-121c725f94a5',
    'name': 'Vinicius Anderson da Conceição',
    'email': 'viniciusanderson@gmail.com',
    'createdAt': '2021-01-01T00:00:00.000Z'
  },
};
