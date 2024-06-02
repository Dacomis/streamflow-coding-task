import { StreamflowSolana } from '@streamflow/stream';

export const solanaDevnetClient = new StreamflowSolana.SolanaStreamClient(
  'https://api.devnet.solana.com'
);
