interface Window {
  // No need for createLemonSqueezy anymore since we're using direct links
  // We still need the LemonSqueezy object for TypeScript compatibility
  LemonSqueezy?: {
    Url: {
      Open: (url: string) => void;
    };
  };
  // We don't need environment variables for variant IDs anymore
  __env__?: {
    NEXT_PUBLIC_APP_URL: string;
    [key: string]: string;
  };
} 