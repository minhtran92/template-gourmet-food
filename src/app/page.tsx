'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { GourmetFoodHomePage } from './shop/[slug]/HomePage';

// Mock tenant — dev sandbox only
const mockTenant = {
  slug: 'sandbox',
  name: 'Gourmet Food Demo',
  isConfigured: true,
};

export default function SandboxPage() {
  const [client] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={client}>
      <GourmetFoodHomePage tenant={mockTenant} />
    </QueryClientProvider>
  );
}
