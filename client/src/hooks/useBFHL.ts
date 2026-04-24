import { useState } from 'react';
import type { BFHLResponse } from '../types';

export const useBFHL = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (data: string[]): Promise<BFHLResponse | null> => {
    setLoading(true);
    setError(null);

    try {
      const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL || 'http://localhost:3000';
      const response = await fetch(`${baseUrl}/bfhl`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { submit, loading, error };
};