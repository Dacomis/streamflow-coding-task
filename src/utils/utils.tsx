import { StreamflowSolana } from '@streamflow/stream';

export const solanaDevnetClient = new StreamflowSolana.SolanaStreamClient(
  'https://api.devnet.solana.com'
);

export const extractWalletPublicKey = (wallet: {
  publicKey: { toBase58: () => any };
}) => wallet.publicKey.toBase58();
