import { FC } from 'react';
import { Grid } from '@mui/material';
import Create from './Create';
import List from './List';
import Withdraw from './Withdraw';

const Streams: FC = () => (
  <Grid container flexDirection="column" gap="30px">
    <Grid container gap="30px">
      <Create />
      <Withdraw />
    </Grid>
    <List />
  </Grid>
);
export default Streams;
