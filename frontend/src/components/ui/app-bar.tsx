import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Image from 'next/image';
import Link from 'next/link';
import { ConnectButton } from '../web3/connect-button';
import { Grid, Tab, Tabs } from '@mui/material';

function ResponsiveAppBar() {
  const [value, setValue] = React.useState('one');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <AppBar position="static" color='primary'>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
          >
            <Grid item xs={4}>
              <Link href="/">
                <Image
                  src="/images/inkathon-logo.png"
                  alt="Logo aleph-esim"
                  width={100}
                  height={50}
                  className="logo"
                />
              </Link>
            </Grid>

            <Grid item xs={4}>
              <Box display="flex" alignItems="center" justifyContent="center">
                <Tabs
                  value={value}
                  onChange={handleChange}
                  textColor="inherit"
                  indicatorColor="secondary"
                  aria-label="secondary tabs"
                >
                  <Tab value="1" label="NUMBER INFO" />
                  <Tab value="2" label="REGISTER PHONE" />
                </Tabs>
              </Box>
            </Grid>

            <Grid item xs={4}>
              <Box display="flex" alignItems="center" justifyContent="end">
                <ConnectButton />
              </Box>
            </Grid>
          </Grid>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;