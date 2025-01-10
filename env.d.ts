// env.d.ts
declare namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_RAZORPAY_KEY_ID: string;
      RAZORPAY_KEY_SECRET: string;
      MONGODB_URI: string;
      MONGODB_DB: string;
    }
  }
  