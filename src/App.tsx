import { Buffer } from 'buffer';
import { Grid } from '@mui/material';
import { AutoConnectWalletProvider } from './components/contexts/AutoConnectWallet';
import Streams from './components/streams';
import ConnectedWalletStatus from './components/wallet/ConnectedWalletStatus';

window.Buffer = Buffer;

const App = () => (
  <AutoConnectWalletProvider>
    <Grid
      container
      flexDirection="column"
      gap="30px"
      maxWidth="90%"
      margin="0 auto"
    >
      {/* <ConnectWalletButton /> */}
      <ConnectedWalletStatus />

      <Streams />
    </Grid>
  </AutoConnectWalletProvider>
);

export default App;
