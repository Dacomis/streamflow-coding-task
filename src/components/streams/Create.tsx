import { FC, useState } from 'react';
import {
  Button,
  FormControl,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
  styled
} from '@mui/material';
import { useAutoConnectWallet } from '../contexts/AutoConnectWallet';
import { isPositive } from '../../utils/mathUtils';
import { useCreateStream } from '../hooks/useCreateStream';

const Create: FC = () => {
  const { tokens, solBalance } = useAutoConnectWallet();
  const { createStream, loading, error } = useCreateStream();

  const [name, setName] = useState('');
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState<number | string>(0);
  const [selectedToken, setSelectedToken] = useState('');

  const handleSubmit = async () => {
    if (isPositive(amount as number)) {
      await createStream(recipient, selectedToken, amount as number, name);
    }
  };

  error && console.log(error);

  return (
    <Grid
      container
      flexDirection="column"
      gap="10px"
      maxWidth="800px"
      mt="30px"
    >
      <Typography fontSize="1.5rem" fontWeight="600" mb="20px">
        Create a Stream
      </Typography>

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
        onClick={handleSubmit}
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

export default Create;
