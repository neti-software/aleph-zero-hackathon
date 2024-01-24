import Image from 'next/image'
import Link from 'next/link'
import * as React from 'react'

import { Grid, Tab, Tabs } from '@mui/material'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Toolbar from '@mui/material/Toolbar'
import logo from 'public/icons/logo.svg'

import { ConnectButton } from '../web3/connect-button'

function ResponsiveAppBar() {
  const [value, setValue] = React.useState('one')

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  return (
    <AppBar position="static" className="box-shadow bg-[#090f13]">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Grid container direction="row" justifyContent="center" alignItems="center">
            <Grid item xs={2}>
              <Link href="/">
                <Image src={logo} alt="Logo aleph-esim" width={100} height={50} className="logo" />
              </Link>
            </Grid>

            <Grid item xs={6}>
              <Box display="flex" alignItems="center" justifyContent="center">
                <Tabs
                  value={value}
                  onChange={handleChange}
                  textColor="inherit"
                  indicatorColor="secondary"
                  TabIndicatorProps={{
                    style: { backgroundColor: '#00eac7' },
                  }}
                  aria-label="secondary tabs"
                >
                  <Tab value="1" label="NUMBER INFO" />
                  <Tab value="2" label="REGISTER PHONE" />
                  <Tab value="" label="REGISTER PHONE" />
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
  )
}
export default ResponsiveAppBar
