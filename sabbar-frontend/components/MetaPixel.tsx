'use client';

import Script from 'next/script';
import { useEffect } from 'react';

// ID du pixel Meta (à garder secret en production)
const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

if (!PIXEL_ID) {
  console.warn('[Meta Pixel] PIXEL_ID non configuré. Ajoutez NEXT_PUBLIC_META_PIXEL_ID à .env.local');
}

/**
 * Composant Meta Pixel
 * À placer dans : app/page.tsx (ou app/layout.tsx pour toutes les pages)
 * 
 * Usage:
 * import MetaPixel from '@/components/MetaPixel';
 * 
 * <MetaPixel />
 */
export default function MetaPixel() {
  useEffect(() => {
    // Tracker automatiquement le PageView quand le pixel est chargé
    const trackPageView = () => {
      if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'PageView');
      }
    };

    // Attendre que le DOM soit prêt
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', trackPageView);
      return () => document.removeEventListener('DOMContentLoaded', trackPageView);
    } else {
      trackPageView();
    }
  }, []);

  if (!PIXEL_ID) {
    return null; // Ne rien afficher si le pixel n'est pas configuré
  }

  return (
    <>
      {/* 1️⃣ Charger le SDK Meta Facebook */}
      <Script
        id="meta-pixel-sdk"
        src="https://connect.facebook.net/en_US/fbevents.js"
        strategy="afterInteractive" // ⚡ Charge APRÈS le rendu initial
        onLoad={() => {
          // 2️⃣ Initialiser le pixel une fois le script chargé
          if (window.fbq) {
            window.fbq('init', PIXEL_ID);
            window.fbq('track', 'PageView');
          }
        }}
      />

      {/* 3️⃣ Code d'initialisation inline (fallback en cas d'erreur) */}
      <Script
        id="meta-pixel-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window,document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${PIXEL_ID}');
            fbq('track', 'PageView');
          `,
        }}
      />

      {/* 4️⃣ Fallback pour les utilisateurs sans JavaScript */}
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}