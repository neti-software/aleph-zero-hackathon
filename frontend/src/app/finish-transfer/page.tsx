'use client'

import { useState } from 'react'

import { ContractIds } from '@/deployments/deployments'
import { Button } from '@mui/material'
import { useInkathon, useRegisteredContract } from '@scio-labs/use-inkathon'
import toast from 'react-hot-toast'

import { contractTxWithToast } from '@/utils/contract-tx-with-toast'

export default function FinishTransfer({
  phoneNumber,
  onClose,
  index,
}: {
  phoneNumber?: string | null
  onClose: () => void
  index: number
}) {
  const { api, activeAccount, activeSigner } = useInkathon()
  const { contract, address: contractAddress } = useRegisteredContract(ContractIds.TransferEscrow)
  const [updateIsLoading, setUpdateIsLoading] = useState<boolean>(false)

  const handleFormData = async () => {
    if (!activeAccount || !contract || !activeSigner || !api) {
      toast.error('Wallet not connected. Try again…')
      return
    }

    setUpdateIsLoading(true)
    try {
      if (!index) return
      await contractTxWithToast(api, activeAccount.address, contract, 'finish_transfer', {}, [
        index,
      ])

      onClose()
    } catch (e) {
      console.error(e)
    } finally {
      setUpdateIsLoading(false)
    }
  }

  if (!api) return null

  return (
    <>
      <Button
        type="submit"
        fullWidth
        variant="contained"
        disabled={updateIsLoading}
        style={{
          backgroundColor: '#00eac7',
        }}
        sx={{
          mt: 3,
          mb: 2,
        }}
        onClick={handleFormData}
      >
        CONFIRM
      </Button>
    </>
  )
}
