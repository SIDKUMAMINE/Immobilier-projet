'use client';

import { useCallback } from 'react';

export function useMetaPixel() {
  const track = useCallback(
    (eventName: string, eventData?: Record<string, any>) => {
      if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', eventName, eventData);
        console.log(`[Meta Pixel] Événement: ${eventName}`, eventData);
      }
    },
    []
  );

  return { track };
}