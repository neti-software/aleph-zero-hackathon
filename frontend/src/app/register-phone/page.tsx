'use client'

import { useState } from 'react'

import { ContractIds } from '@/deployments/deployments'
import { Box } from '@mui/material'
import { useInkathon, useRegisteredContract } from '@scio-labs/use-inkathon'
import toast from 'react-hot-toast'

import RequestForm from '@/components/ui/request-form'
import { contractTxWithToast } from '@/utils/contract-tx-with-toast'

export default function Mint() {
  const { api, activeAccount, activeSigner } = useInkathon()
  const { contract, address: contractAddress } = useRegisteredContract(ContractIds.PhoneNumbers)
  const [updateIsLoading, setUpdateIsLoading] = useState<boolean>(false)

  const handleFormData = async ({ input, operator }: { input: string; operator: string }) => {
    if (!activeAccount || !contract || !activeSigner || !api) {
      toast.error('Wallet not connected. Try again…')
      return
    }
    setUpdateIsLoading(true)
    try {
      await contractTxWithToast(api, activeAccount.address, contract, 'mint', {}, [input])
      await contractTxWithToast(api, activeAccount.address, contract, 'PSP34::transfer', {}, [
        operator,
        { Bytes: input },
        '',
      ])
    } catch (e) {
      console.error(e)
    } finally {
      setUpdateIsLoading(false)
    }
  }

  if (!api) return null

  return (
    <>
      <Box sx={{ mt: '20vh' }}>
        <RequestForm
          onFormDataSubmit={handleFormData}
          updateIsLoading={updateIsLoading}
          name="register_phone"
        />
      </Box>
    </>
  )
}
