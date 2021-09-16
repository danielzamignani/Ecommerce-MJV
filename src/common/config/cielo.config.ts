import { AxiosRequestConfig } from 'axios';

export const cieloMerchantId = process.env.CIELO_MERCHANT_ID;
export const cieloMerchantKey = process.env.CIELO_MERCHANT_KEY;
export const cieloURLRequest = process.env.CIELO_REQUEST_URL;

export const cieloHeaderConfig: AxiosRequestConfig = {
  headers: {
    merchantId: 'cea77c1c-992b-45fe-a5a3-63d7919cd8e9',
    merchantKey: 'FZYLBJTQMUKQEQVOMDTNHETXUIUIPYANOIQJLLMQ',
  },
};
