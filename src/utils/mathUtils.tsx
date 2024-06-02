import { getBN } from '@streamflow/common';
import { BN } from '@streamflow/stream/solana';
import { gt } from 'lodash';

// Convert SOL to lamports
export const solToLamports = (sol: number) => getBN(sol, 9);

// Converts lamports to SOL and converts to string for display
export const lamportsToSol = (lamports: BN) => {
  return lamports.div(new BN(1_000_000_000)).toString();
};

export const isPositive = (value: string | number) => gt(value, 0);
