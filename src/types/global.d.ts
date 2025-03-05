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
    [key: string]: string; // Allow any other string properties
  };
  process?: {
    env: {
      REACT_APP_LEMONSQUEEZY_STORE_ID?: string;
      REACT_APP_LEMONSQUEEZY_MONTHLY_VARIANT_ID?: string;
      REACT_APP_LEMONSQUEEZY_YEARLY_VARIANT_ID?: string;
      REACT_APP_LEMONSQUEEZY_MONTHLY_URL?: string;
      REACT_APP_LEMONSQUEEZY_YEARLY_URL?: string;
      [key: string]: string | undefined; // Allow any other string properties
    };
  };
} 