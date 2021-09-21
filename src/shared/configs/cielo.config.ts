import { AxiosRequestConfig } from 'axios';

export const cieloMerchantId = process.env.CIELO_MERCHANT_ID;
export const cieloMerchantKey = process.env.CIELO_MERCHANT_KEY;
export const cieloURLPost = process.env.CIELO_POST_URL;
export const cieloURLGet = process.env.CIELO_GET_URL;

export const cieloHeaderConfig: AxiosRequestConfig = {
  headers: {
    merchantId: cieloMerchantId,
    merchantKey: cieloMerchantKey,
  },
};
