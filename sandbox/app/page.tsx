'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { GourmetFoodHomePage } from '../../src/pages/HomePage';
import { gourmetFoodTheme } from '../../src/theme';

const queryClient = new QueryClient();

// Mock tenant for sandbox
const mockTenant = {
  id: 'sandbox-tenant',
  slug: 'sandbox',
  name: 'Gourmet Food Demo',
  template: 'gourmet-food',
  isConfigured: true,
  status: 'active' as const,
};

export default function SandboxPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <GourmetFoodHomePage tenant={mockTenant} theme={gourmetFoodTheme} />
    </QueryClientProvider>
  );
}
