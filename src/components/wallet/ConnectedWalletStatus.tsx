import { useAutoConnectWallet } from '../../contexts/AutoConnectWallet'
import { useWallet } from '../../contexts/ConnectWallet' // Adjust the import path as necessary
import { Grid, Typography } from '@mui/material'

const ConnectedWalletStatus = () => {
  const { wallet } = useAutoConnectWallet()

  return (
    <Grid>
      {wallet ? (
        <Typography>{`Wallet connected: ${wallet.publicKey.toBase58()}`}</Typography>
      ) : (
        <Typography>Please connect your wallet</Typography>
      )}
    </Grid>
  )
}

export default ConnectedWalletStatus
