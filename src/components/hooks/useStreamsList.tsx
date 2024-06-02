import { useState, useEffect } from 'react';
import { Stream, StreamDirection, StreamType } from '@streamflow/stream';
import { useAutoConnectWallet } from '../contexts/AutoConnectWallet';
import { solanaDevnetClient } from '../../utils/utils';

type UseStreamsOutput = {
  streams: [string, Stream][];
  loading: boolean;
  error: unknown | null;
};

export const useStreamsList = (): UseStreamsOutput => {
  const { wallet } = useAutoConnectWallet();
  const [streams, setStreams] = useState<[string, Stream][]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown | null>(null);

  useEffect(() => {
    if (!wallet?.publicKey) {
      setError(new Error('Wallet not connected'));
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const data = {
          address: wallet.publicKey,
          type: StreamType.All,
          direction: StreamDirection.All
        };
        const result = await solanaDevnetClient.get(data);
        setStreams(result);
      } catch (error) {
        console.error('Failed to fetch streams:', error);
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [wallet]);

  return { streams, loading, error };
};
