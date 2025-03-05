interface Window {
  createLemonSqueezy?: () => void;
  LemonSqueezy?: {
    Url: {
      Open: (url: string) => void;
    };
  };
  __env__?: {
    NEXT_PUBLIC_APP_URL: string;
    NEXT_PUBLIC_LEMONSQUEEZY_STORE_ID: string;
    NEXT_PUBLIC_LEMONSQUEEZY_MONTHLY_VARIANT_ID: string;
    NEXT_PUBLIC_LEMONSQUEEZY_YEARLY_VARIANT_ID: string;
    NEXT_PUBLIC_LEMONSQUEEZY_MONTHLY_URL: string;
    NEXT_PUBLIC_LEMONSQUEEZY_YEARLY_URL: string;
  };
} 