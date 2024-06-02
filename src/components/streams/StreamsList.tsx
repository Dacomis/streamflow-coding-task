import { useState, useEffect } from 'react'
import { useAutoConnectWallet } from '../../contexts/AutoConnectWallet'
import {
  Stream,
  StreamDirection,
  StreamType,
  StreamflowSolana
} from '@streamflow/stream'
import { Grid, Typography } from '@mui/material'
import StreamsTable from './StreamsTable'

const StreamsList = () => {
  const { wallet } = useAutoConnectWallet()
  const [streams, setStreams] = useState<[string, Stream][]>([])
  const [loading, setLoading] = useState(false)

  const client = new StreamflowSolana.SolanaStreamClient(
    'https://api.devnet.solana.com'
  )

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const data = {
          address: wallet.publicKey,
          type: StreamType.All,
          direction: StreamDirection.All
        }
        const result: [string, Stream][] = await client.get(data)
        setStreams(result)
      } catch (error) {
        console.error('Failed to fetch streams:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [wallet])

  return (
    <Grid container>
      {loading ? (
        <Typography>Loading your streams list</Typography>
      ) : (
        <StreamsTable streams={streams} />
      )}
    </Grid>
  )
}

export default StreamsList