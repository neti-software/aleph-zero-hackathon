'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import * as React from 'react'

import { Grid, Tab, Tabs } from '@mui/material'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Toolbar from '@mui/material/Toolbar'
import logo from 'public/icons/logo.svg'

import { ConnectButton } from '../web3/connect-button'

function ResponsiveAppBar() {
  const [value, setValue] = React.useState(0)
  const path = usePathname()
  if (path === '/') return

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  return (
    <AppBar sx={{ bgcolor: '#090f13' }} position="static" className="box-shadow bg-[#090f13]">
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
                  <Link href="/dashboard" passHref>
                    <Tab
                      value={1}
                      className={value === 0 ? 'Mui-selected' : ''}
                      onClick={() => setValue(0)}
                      label="NUMBER PHONE"
                    />
                  </Link>
                  <Link href="/register-phone" passHref>
                    <Tab
                      value={2}
                      className={value === 1 ? 'Mui-selected' : ''}
                      onClick={() => setValue(1)}
                      label="REGISTER PHONE"
                    />
                  </Link>
                  <Link href="/transfer-request" passHref>
                    <Tab
                      value={3}
                      className={value === 2 ? 'Mui-selected' : ''}
                      onClick={() => setValue(2)}
                      label="TRANSFER REQUEST"
                    />
                  </Link>
                  <Link href="/assign-number" passHref>
                    <Tab
                      value={4}
                      className={value === 3 ? 'Mui-selected' : ''}
                      onClick={() => setValue(3)}
                      label="ASSIGN PHONE NUMBER"
                    />
                  </Link>
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
