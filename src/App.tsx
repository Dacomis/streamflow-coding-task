import CreateStream from './components/CreateStream';
import { WalletProvider } from './contexts/ConnectWallet';

import { Buffer } from 'buffer';
import ConnectWalletButton from './components/wallet/ConnectWalletButton';
import { Grid } from '@mui/material';
import ConnectedWalletStatus from './components/wallet/ConnectedWalletStatus';

window.Buffer = Buffer;

function App() {
  return (
    <WalletProvider>
      <Grid container flexDirection='column' gap='30px'>
        <ConnectWalletButton />

        <ConnectedWalletStatus />

        <CreateStream />
      </Grid>
    </WalletProvider>
  );
}

export default App;
