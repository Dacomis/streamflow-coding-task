import { extractWalletPublicKey } from '../../utils/utils';
import { useAutoConnectWallet } from '../contexts/AutoConnectWallet';
import { Grid, Typography } from '@mui/material';

const ConnectedWalletStatus = () => {
  const { wallet } = useAutoConnectWallet();

  return (
    <Grid textAlign="center">
      {wallet ? (
        <Typography
          fontSize="1.5rem"
          fontWeight="600"
          mb="20px"
        >{`Wallet connected: ${extractWalletPublicKey(wallet)}`}</Typography>
      ) : (
        <Typography fontSize="1.5rem" fontWeight="600" mb="20px">
          Please connect your wallet
        </Typography>
      )}
    </Grid>
  );
};

export default ConnectedWalletStatus;
