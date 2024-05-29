import { useState } from 'react';
import { ICreateStreamData, StreamflowSolana, getBN } from "@streamflow/stream";
import { useWallet } from '../contexts/ConnectWallet';
import { BN } from '@streamflow/stream/solana';
import { Button, Grid, TextField } from '@mui/material';

const CreateStream = () => {
  const { wallet } = useWallet();
  const [name, setName] = useState('');
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState<number | string>(0);
  const [loading, setLoading] = useState(false);

  const createStream = async () => {
    if (!wallet) {
      console.error("Wallet is not connected.");
      return;
    }

    setLoading(true);

    // const client = new GenericStreamClient<IChain.Solana>({
    //   chain: IChain.Solana, // Blockchain
    //   clusterUrl: "https://api.mainnet-beta.solana.com", // RPC cluster URL
    //   cluster: ICluster.Devnet, // (optional) (default: Mainnet)
    // });

    const client = new StreamflowSolana.SolanaStreamClient(
      "https://api.devnet.solana.com"
    );

    const currentTimestamp = Math.floor(Date.now() / 1000);
    const startTimestamp = currentTimestamp + 30;

    const createStreamParams: ICreateStreamData = {
      recipient: recipient,
      tokenId: "So11111111111111111111111111111111111111112",
      start: startTimestamp,
      amount: getBN(Number(amount) || 0, 9),
      period: 1,
      cliff: startTimestamp + 30, // Cliff set to 30 seconds
      cliffAmount: new BN(1e9), // Cliff amount set to 1 SOL (1e9 lamports)
      amountPerPeriod: getBN(1, 9), // Release rate set to 1 SOL per period
      name: name,
      canTopup: false,
      cancelableBySender: true,
      cancelableByRecipient: false,
      transferableBySender: true,
      transferableByRecipient: false,
      automaticWithdrawal: true,
      withdrawalFrequency: 10, // Automatic withdrawal every 10 seconds
    };

    const solanaParams = {
      sender: wallet,
      isNative: true,
    };

    try {
      const { metadataId } = await client.create(createStreamParams, solanaParams);
      console.log('Stream created successfully:', metadataId);
    } catch (exception) {
      console.error('Failed to create stream:', exception);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid display='flex' flexDirection='column' gap='10px' maxWidth='800px'>
        <TextField
        type="text"
        placeholder="Name of the transfer"
        label="Transfer Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <TextField
        type="text"
        placeholder="Recipient Public Key"
        label="Recipient Public Key"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
      />

      <TextField
        type="number"
        placeholder="Amount"
        label="Amount to send"
        value={amount}
        onChange={(e) => setAmount(e.target.value ? parseFloat(e.target.value) : '')}
      />

      <Button variant='outlined' onClick={createStream} disabled={loading}>
        {loading ? 'Creating Stream...' : 'Create Stream'}
      </Button>
    </Grid>
  );
};

export default CreateStream;

// account 1: GjcPk2FxL8wdLJSVuGww7xo5caLuPbNdAa427rcje74j
// account 2: DRto9MKttX1TNvhiSSWuvSqkJZRQMdNwH9p5XySAjtAv