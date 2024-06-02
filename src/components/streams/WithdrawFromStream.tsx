import { useState } from 'react';
import { Button, Grid, TextField } from '@mui/material';
import { isPositive } from '../../utils/mathUtils';
import { useWithdrawFromStream } from '../hooks/useWithdrawFromStream';

const WithdrawFromStream = () => {
  const [amount, setAmount] = useState<number | string>(0);

  const [streamID, setStreamID] = useState('');
  const { withdraw, loading, error } = useWithdrawFromStream();

  const handleWithdraw = async () => {
    if (isPositive(amount)) {
      await withdraw(streamID, Number(amount));
    }
  };

  error && console.log(error);

  return (
    <Grid container width="800px" flexDirection="column" gap="20px">
      <TextField
        type="text"
        placeholder="Stream ID"
        label="Stream ID"
        value={streamID}
        onChange={(e) => setStreamID(e.target.value)}
      />

      <TextField
        type="number"
        placeholder="Amount"
        label="Amount to withdraw"
        value={amount}
        onChange={(e) =>
          setAmount(e.target.value ? parseFloat(e.target.value) : '')
        }
      />

      <Button
        variant="contained"
        onClick={handleWithdraw}
        disabled={loading || !isPositive(Number(amount))}
      >
        {loading ? 'Withdrawing fom Stream...' : 'Withdraw fom Stream'}
      </Button>
    </Grid>
  );
};

export default WithdrawFromStream;
