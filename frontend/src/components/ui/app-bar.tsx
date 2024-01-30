'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import * as React from 'react'
import { useEffect, useState } from 'react'

import { ContractIds } from '@/deployments/deployments'
import { Grid, Tab, Tabs } from '@mui/material'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Toolbar from '@mui/material/Toolbar'
import {
  contractQuery,
  decodeOutput,
  useInkathon,
  useRegisteredContract,
} from '@scio-labs/use-inkathon'
import logo from 'public/icons/logo.svg'
import toast from 'react-hot-toast'

import { ConnectButton } from '../web3/connect-button'

function ResponsiveAppBar() {
  const [value, setValue] = React.useState(0)
  const path = usePathname()

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  const { api, activeAccount, activeSigner } = useInkathon()
  const { contract, address: contractAddress } = useRegisteredContract(ContractIds.PhoneNumbers)
  const [userType, setUserType] = useState<'owner' | 'operator' | 'user'>()

  const fetchData = async () => {
    if (!contract || !api) return

    setUserType(undefined)
    try {
      if (!api || !contract || !activeAccount) return
      const result = await contractQuery(api, '', contract, 'AccessControl::has_role', {}, [
        0,
        activeAccount.address,
      ])
      const { output, isError, decodedOutput } = decodeOutput(
        result,
        contract,
        'AccessControl::has_role',
      )
      if (output) {
        setUserType('owner')
      } else {
        const result = await contractQuery(api, '', contract, 'PSP34::balance_of', {}, [
          activeAccount.address,
        ])
        const { output, isError, decodedOutput } = decodeOutput(
          result,
          contract,
          'PSP34::balance_of',
        )
        if (Number(output) > 0) {
          setUserType('operator')
        } else {
          setUserType('user')
        }
      }
    } catch (e) {
      console.error(e)
      toast.error('Error while fetching user type. Try again…')
    }
  }

  useEffect(() => {
    fetchData()
  }, [activeAccount])

  const items = React.useMemo(() => {
    return [
      { label: 'NUMBER PHONE', href: '/dashboard' },
      userType === 'owner' && { label: 'REGISTER PHONE', href: '/register-phone' },
      userType != 'owner' && { label: 'TRANSFER REQUEST', href: '/transfer-request' },
    ].filter((v) => v)
  }, [userType])

  if (path === '/') return

  if (!api) return null
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
                  {items.map((item: any, index) => (
                    <Link key={item.href} href={item.href} passHref>
                      <Tab
                        value={index + 1}
                        className={value === index ? 'Mui-selected' : ''}
                        onClick={() => setValue(index)}
                        label={item.label}
                      />
                    </Link>
                  ))}
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
