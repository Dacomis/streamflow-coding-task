import { useState } from 'react';
import { Button, Grid, TextField, Typography } from '@mui/material';
import { isPositive } from '../../utils/mathUtils';
import { useWithdrawFromStream } from '../hooks/useWithdrawFromStream';

const Withdraw = () => {
  const { withdraw, loading, error } = useWithdrawFromStream();

  const [amount, setAmount] = useState<number | string>(0);
  const [streamID, setStreamID] = useState('');

  const handleWithdraw = async () => {
    if (isPositive(amount)) {
      await withdraw(streamID, Number(amount));
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
      <Typography fontSize="1.5rem" fontWeight="600" mb="40px">
        Withdraw a Stream
      </Typography>

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

export default Withdraw;
