import { Grid, Typography } from '@mui/material';
import Table from './Table';
import { useStreamsList } from '../hooks/useStreamsList';

const List = () => {
  const { streams, loading, error } = useStreamsList();

  error && console.log(error);

  return (
    <Grid container mt="30px">
      {loading ? (
        <Typography>Loading your streams list</Typography>
      ) : (
        <Grid container flexDirection="column">
          <Typography fontSize="1.5rem" fontWeight="600" mb="20px">
            User's streams
          </Typography>
          <Table streams={streams} />
        </Grid>
      )}
    </Grid>
  );
};

export default List;
