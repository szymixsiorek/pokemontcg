
/// <reference types="vite/client" />

declare namespace JSX {
  interface IntrinsicElements {
    'stripe-buy-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      'buy-button-id'?: string;
      'publishable-key'?: string;
    };
  }
}

// PayPal SDK type definitions
interface PayPalDonationButtonOptions {
  env: 'production' | 'sandbox';
  hosted_button_id: string;
  image: {
    src: string;
    alt: string;
    title: string;
  };
}

interface PayPalDonationButton {
  render: (selector: string) => void;
}

interface PayPalDonationNamespace {
  Button: (options: PayPalDonationButtonOptions) => PayPalDonationButton;
}

interface PayPalNamespace {
  Donation: PayPalDonationNamespace;
}

interface Window {
  PayPal: PayPalNamespace;
}
