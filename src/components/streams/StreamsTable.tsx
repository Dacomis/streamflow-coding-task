import { FC } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material'
import { Stream } from '@streamflow/stream'
import { BN } from '@streamflow/stream/solana'

type StreamsTableProps = {
  streams: [string, Stream][]
}

const lamportsToSol = (lamports: BN) => {
  return lamports.div(new BN(1_000_000_000)).toString() // Converts lamports to SOL and converts to string for display
}

const StreamsTable: FC<StreamsTableProps> = ({ streams }) => {
  return (
    <TableContainer component={Paper} style={{ overflowX: 'auto' }}>
      <Table sx={{ minWidth: 650 }} aria-label="streams table">
        <TableHead>
          <TableRow>
            <TableCell>Stream ID</TableCell>
            <TableCell align="left">Sender</TableCell>
            <TableCell align="left">Recipient</TableCell>
            <TableCell align="left">Start Time</TableCell>
            <TableCell align="left">Cliff Time</TableCell>
            <TableCell align="left">End Time</TableCell>
            <TableCell align="left">Amount Per Period</TableCell>
            <TableCell align="left">Cliff Amount</TableCell>
            <TableCell align="left">Automatic Withdrawal</TableCell>
            <TableCell align="left">Deposited Amount</TableCell>
            <TableCell align="left">Withdrawn Amount</TableCell>
            <TableCell align="left">Withdrawal Frequency</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {streams.map(([streamId, stream]) => (
            <TableRow
              key={streamId}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {streamId}
              </TableCell>
              <TableCell align="left">{stream.sender}</TableCell>
              <TableCell align="left">{stream.recipient}</TableCell>
              <TableCell align="left">
                {new Date(stream.start * 1000).toLocaleString()}
              </TableCell>
              <TableCell align="left">
                {new Date(stream.cliff * 1000).toLocaleString()}
              </TableCell>
              <TableCell align="left">
                {new Date(stream.end * 1000).toLocaleString()}
              </TableCell>
              <TableCell align="left">
                {lamportsToSol(new BN(stream.amountPerPeriod))}
              </TableCell>
              <TableCell align="left">
                {lamportsToSol(new BN(stream.cliffAmount))}
              </TableCell>
              <TableCell align="left">
                {stream.automaticWithdrawal.toString()}
              </TableCell>
              <TableCell align="left">
                {lamportsToSol(new BN(stream.depositedAmount))}
              </TableCell>
              <TableCell align="left">
                {lamportsToSol(new BN(stream.withdrawnAmount))}
              </TableCell>
              <TableCell align="left">{stream.withdrawalFrequency}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default StreamsTable
