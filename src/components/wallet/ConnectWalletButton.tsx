import React from 'react';
import Button from '@mui/material/Button';
import { useWallet } from '../../contexts/ConnectWallet';  // Adjust the import path as necessary
import { Grid } from '@mui/material';

const ConnectWalletButton = () => {
  const { wallet, connectWallet, disconnectWallet } = useWallet();

  return (
    <Grid>
      {wallet ? (
        <Button variant="contained" color="primary" onClick={disconnectWallet}>
          Disconnect Wallet
        </Button>
      ) : (
        <Button variant="contained" color="secondary" onClick={connectWallet}>
          Connect Wallet
        </Button>
      )}
    </Grid>
  );
};

export default ConnectWalletButton;
