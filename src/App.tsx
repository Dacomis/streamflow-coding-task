import CreateStream from './components/streams/CreateStream'

import { Buffer } from 'buffer'
import { Grid } from '@mui/material'
import { AutoConnectWalletProvider } from './contexts/AutoConnectWallet'
import ConnectedWalletStatus from './components/wallet/ConnectedWalletStatus'
import StreamsList from './components/streams/StreamsList'
import WithdrawFromStream from './components/streams/WithdrawFromStream'

window.Buffer = Buffer

function App() {
  return (
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

        <CreateStream />

        <StreamsList />

        <WithdrawFromStream />
      </Grid>
    </AutoConnectWalletProvider>
  )
}
export default App
