import { useAutoConnectWallet } from '../../contexts/AutoConnectWallet';
import { Grid, Typography } from '@mui/material';
import StreamsTable from './StreamsTable';
import { useStreamsList } from '../hooks/useStreamsList';

const StreamsList = () => {
  const { streams, loading, error } = useStreamsList();

  error && console.log(error);

  return (
    <Grid container>
      {loading ? (
        <Typography>Loading your streams list</Typography>
      ) : (
        <StreamsTable streams={streams} />
      )}
    </Grid>
  );
};

export default StreamsList;
