import { useState } from 'react';
import { IWithdrawData } from '@streamflow/stream';
import { solanaDevnetClient } from '../../utils/utils';
import { isPositive, solToLamports } from '../../utils/mathUtils';
import { useAutoConnectWallet } from '../../contexts/AutoConnectWallet';

type UseWithdrawOutput = {
  withdraw: (streamID: string, amount: number) => Promise<void>;
  loading: boolean;
  error: Error | null;
};

export const useWithdrawFromStream = (): UseWithdrawOutput => {
  const { wallet } = useAutoConnectWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const withdraw = async (streamID: string, amount: number): Promise<void> => {
    if (!wallet) {
      setError(new Error('Wallet is not connected.'));
      return;
    }

    if (!streamID || !isPositive(amount)) {
      setError(
        new Error('All fields are required and amount must be positive.')
      );
      return;
    }

    setLoading(true);
    try {
      const withdrawStreamParams: IWithdrawData = {
        id: streamID,
        amount: solToLamports(amount)
      };

      const solanaParams = { invoker: wallet };
      const { ixs, txId } = await solanaDevnetClient.withdraw(
        withdrawStreamParams,
        solanaParams
      );

      console.log('Withdrawal successful:', txId);
      console.log('Transaction instructions:', ixs);
    } catch (exception) {
      console.error('Failed to withdraw:', exception);
      setError(exception as Error);
    } finally {
      setLoading(false);
    }
  };

  return { withdraw, loading, error };
};
