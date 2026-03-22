'use client';

import { useEffect } from 'react';

export default function BotpressChat() {
  useEffect(() => {
    // Load Botpress chat script
    const script = document.createElement('script');
    script.src = 'https://cdn.botpress.cloud/webchat/latest/inject.js';
    script.async = true;
    document.body.appendChild(script);

    // Configuration du chat Botpress
    script.onload = () => {
      // @ts-ignore
      window.botpressWebChat?.mergeConfig({
        composerPlaceholder: 'Posez votre question...',
        botName: 'SABBAR Assistant',
        botConversationDescription: 'Assistant immobilier SABBAR',
        contentLanguage: 'fr',
        userInputPlaceholder: 'Écrivez votre message...',
        hideWidget: false,
        showConversationsButton: true,
        enableTranscriptDownload: true,
        theme: {
          themeName: 'prism',
          themeColor: '#0ea5e9' // turquoise-500
        }
      });
    };

    return () => {
      // Cleanup if needed
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <>
      {/* Botpress chat will be injected here */}
      <div id="bp-web-widget" />
    </>
  );
}