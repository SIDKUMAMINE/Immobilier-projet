'use client';

import { getOrInitializeAgentId } from '@/lib/api';
import { useEffect, ReactNode } from 'react';

export function ClientInit({ children }: { children: ReactNode }) {
  useEffect(() => {
    try {
      const agentId = getOrInitializeAgentId();
      console.log('✓✓✓ AGENT INITIALIZED:', agentId.substring(0, 8) + '...');
    } catch (error) {
      console.error('❌ Failed to initialize agent:', error);
    }
  }, []);

  return <>{children}</>;
}