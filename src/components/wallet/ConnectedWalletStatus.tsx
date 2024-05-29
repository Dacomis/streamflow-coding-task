import { useWallet } from '../../contexts/ConnectWallet';  // Adjust the import path as necessary
import { Grid, Typography } from '@mui/material';

const ConnectedWalletStatus = () => {
  const { walletPublicKey } = useWallet();

  return (
    <Grid>
      {walletPublicKey ? (
        <Typography>{`Wallet connected: ${walletPublicKey}`}</Typography>
      ) : (
        <Typography>Please connect your wallet</Typography>
      )}
    </Grid>
  );
};

export default ConnectedWalletStatus;
