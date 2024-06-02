import { FC, useState } from 'react';
import { ICreateStreamData } from '@streamflow/stream';
import {
  Button,
  FormControl,
  Grid,
  MenuItem,
  Select,
  TextField,
  styled
} from '@mui/material';
import { useAutoConnectWallet } from '../../contexts/AutoConnectWallet';
import { isPositive, solToLamports } from '../../utils/mathUtils';
import { solanaDevnetClient } from '../../utils/utils';

const CreateStream: FC = () => {
  const { wallet, tokens, solBalance } = useAutoConnectWallet();
  const [name, setName] = useState('');
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState<number | string>(0);
  const [loading, setLoading] = useState(false);
  const [selectedToken, setSelectedToken] = useState('');

  const createStream = async () => {
    if (!wallet) {
      console.error('Wallet is not connected.');
      return;
    }

    if (!recipient || !selectedToken || !amount) {
      console.error('All fields are required.');
      return;
    }

    const currentTimestamp = Math.floor(Date.now() / 1000);
    const startTimestamp = currentTimestamp + 360; // Start time 6 minutes from now
    const cliffTimestamp = startTimestamp + 360; // Cliff time 6 minutes after start time

    const createStreamParams: ICreateStreamData = {
      recipient: recipient,
      tokenId:
        selectedToken === 'SOL'
          ? 'So11111111111111111111111111111111111111112'
          : selectedToken,
      start: startTimestamp,
      amount: isPositive(amount) && solToLamports(amount as number), // Total amount in lamports
      period: 360, // Release rate every 6 minutes
      cliff: cliffTimestamp, // Cliff set to 6 minutes
      cliffAmount: solToLamports(1), // 1 SOL in lamports for the cliff
      amountPerPeriod: solToLamports(1), // 1 SOL every period
      name: name,
      canTopup: false,
      cancelableBySender: true,
      cancelableByRecipient: false,
      transferableBySender: true,
      transferableByRecipient: false,
      automaticWithdrawal: true,
      withdrawalFrequency: 360 // Automatic withdrawal every 6 minutes
    };

    const solanaParams = {
      sender: wallet,
      isNative: selectedToken === 'SOL'
    };

    try {
      const { ixs, txId } = await solanaDevnetClient.create(
        createStreamParams,
        solanaParams
      );
      console.log('Stream created successfully:', txId);
      console.log('Transaction instructions:', ixs);

      setLoading(true);
    } catch (exception) {
      console.error('Failed to create stream:', exception);
    } finally {
      setLoading(false); // Ensure loading is set to false irrespective of outcome
    }
  };

  return (
    <Grid display="flex" flexDirection="column" gap="10px" maxWidth="800px">
      <FormControl fullWidth>
        <Label htmlFor="token-select-label">
          Select a token from your wallet
        </Label>
        <Select
          id="token-select-label"
          labelId="token-select-label"
          value={selectedToken}
          onChange={(e) => setSelectedToken(e.target.value as string)}
        >
          <MenuItem value="SOL">SOL ({solBalance?.toFixed(4)} SOL)</MenuItem>
          {tokens.map((token) => (
            <MenuItem key={token.mint} value={token.mint}>
              {token.mint} ({token.amount})
            </MenuItem>
          ))}
        </Select>
      </FormControl>

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
        onChange={(e) =>
          setAmount(e.target.value ? parseFloat(e.target.value) : '')
        }
      />
      <Button
        variant="contained"
        onClick={createStream}
        disabled={loading || !isPositive(amount)}
      >
        {loading ? 'Creating Stream...' : 'Create Stream'}
      </Button>
    </Grid>
  );
};

const Label = styled('label')({
  fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
  fontSize: '1rem',
  display: 'block',
  marginBottom: '4px',
  fontWeight: '400',
  color: 'grey'
});

export default CreateStream;
