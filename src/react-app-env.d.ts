/// <reference types="react-scripts" />

declare namespace NodeJS {
  interface ProcessEnv {
    REACT_APP_STRIPE_PUBLISHABLE_KEY: string;
    REACT_APP_STRIPE_MONTHLY_PLAN_ID: string;
    REACT_APP_STRIPE_YEARLY_PLAN_ID: string;
    NODE_ENV: 'development' | 'production' | 'test';
    MAILGUN_API_KEY: string;
    MAILGUN_DOMAIN: string;
    VERCEL_URL: string;
    STRIPE_SECRET_KEY: string;
  }
}
