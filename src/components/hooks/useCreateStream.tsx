// hooks/useCreateStream.ts
import { useState } from 'react';
import { useAutoConnectWallet } from '../../contexts/AutoConnectWallet';
import { solToLamports } from '../../utils/mathUtils';
import { solanaDevnetClient } from '../../utils/utils';

type UseCreateStreamOutput = {
  createStream: (
    recipient: string,
    selectedToken: string,
    amount: number,
    name: string
  ) => Promise<void>;
  loading: boolean;
  error: unknown | null;
};

export const useCreateStream = (): UseCreateStreamOutput => {
  const { wallet } = useAutoConnectWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown | null>(null);

  const createStream = async (
    recipient: string,
    selectedToken: string,
    amount: number,
    name: string
  ): Promise<void> => {
    if (!wallet) {
      setError(new Error('Wallet is not connected.'));
      return;
    }
    if (!recipient || !selectedToken || !amount) {
      setError(new Error('All fields are required.'));
      return;
    }

    setLoading(true);
    try {
      const currentTimestamp = Math.floor(Date.now() / 1000);
      const startTimestamp = currentTimestamp + 360;
      const cliffTimestamp = startTimestamp + 360;

      const createStreamParams = {
        recipient,
        tokenId:
          selectedToken === 'SOL'
            ? 'So11111111111111111111111111111111111111112'
            : selectedToken,
        start: startTimestamp,
        amount: solToLamports(amount),
        period: 360,
        cliff: cliffTimestamp,
        cliffAmount: solToLamports(1),
        amountPerPeriod: solToLamports(1),
        name,
        canTopup: false,
        cancelableBySender: true,
        cancelableByRecipient: false,
        transferableBySender: true,
        transferableByRecipient: false,
        automaticWithdrawal: true,
        withdrawalFrequency: 360
      };

      const solanaParams = {
        sender: wallet,
        isNative: selectedToken === 'SOL'
      };
      const { txId } = await solanaDevnetClient.create(
        createStreamParams,
        solanaParams
      );
      console.log('Stream created successfully:', txId);
    } catch (exception) {
      console.error('Failed to create stream:', exception);
      setError(exception);
    } finally {
      setLoading(false);
    }
  };

  return { createStream, loading, error };
};
