import { useState } from 'react'
import { useAutoConnectWallet } from '../../contexts/AutoConnectWallet'
import { IWithdrawData, StreamflowSolana } from '@streamflow/stream'
import { Button, Grid, TextField } from '@mui/material'
import { solToLamports } from './CreateStream'
import { gt } from 'lodash'

const WithdrawFromStream = () => {
  const { wallet } = useAutoConnectWallet()
  const [amount, setAmount] = useState<number | string>(0)
  const [loading, setLoading] = useState(false)

  const [streamID, setStreamID] = useState('')

  const client = new StreamflowSolana.SolanaStreamClient(
    'https://api.devnet.solana.com'
  )

  const createStream = async () => {
    if (!wallet) {
      console.error('Wallet is not connected.')
      return
    }

    if (!streamID) {
      console.error('All fields are required.')
      return
    }

    const withdrawStreamParams: IWithdrawData = {
      id: streamID, // Identifier of a stream to be withdrawn from.
      amount: gt(amount, 0) && solToLamports(amount as number) // Requested amount to withdraw. If stream is completed, the whole amount will be withdrawn.
    }

    const solanaParams = {
      invoker: wallet
    }

    try {
      const { ixs, txId } = await client.withdraw(
        withdrawStreamParams,
        solanaParams
      )
      console.log('Withdrawal created successfully:', txId)
      console.log('Withdrawal transaction instructions:', ixs)

      setLoading(true)
    } catch (exception) {
      console.error('Failed to create withdrawal:', exception)
    } finally {
      setLoading(false) // Ensure loading is set to false irrespective of outcome
    }
  }

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
        onClick={createStream}
        disabled={loading || !gt(amount, 0)}
      >
        {loading ? 'Withdrawing fom Stream...' : 'Withdraw fom Stream'}
      </Button>
    </Grid>
  )
}

export default WithdrawFromStream
