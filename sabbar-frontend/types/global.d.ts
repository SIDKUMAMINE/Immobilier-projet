declare global {
  interface Window {
    fbq: {
      (action: 'init', pixelId: string): void;
      (action: 'track', event: string, data?: Record<string, any>): void;
      (action: 'set', properties: Record<string, any>): void;
    };
  }
}

export {};