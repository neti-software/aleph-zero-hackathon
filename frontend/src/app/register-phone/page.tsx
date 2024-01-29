'use client'

import { useState } from 'react'

import { ContractIds } from '@/deployments/deployments'
import { useInkathon, useRegisteredContract } from '@scio-labs/use-inkathon'
import toast from 'react-hot-toast'

import RequestForm from '@/components/ui/request-form'
import { contractTxWithToast } from '@/utils/contract-tx-with-toast'

type UpdateGreetingValues = { newMessage: string }
export default function Mint() {
  const { api, activeAccount, activeSigner } = useInkathon()
  const { contract, address: contractAddress } = useRegisteredContract(ContractIds.PhoneNumbers)
  const [updateIsLoading, setUpdateIsLoading] = useState<boolean>(false)

  const handleFormData = async (phoneNumber: string) => {
    if (!activeAccount || !contract || !activeSigner || !api) {
      toast.error('Wallet not connected. Try again…')
      return
    }

    setUpdateIsLoading(true)
    try {
      await contractTxWithToast(api, activeAccount.address, contract, 'mint', {}, [phoneNumber])
    } catch (e) {
      console.error(e)
    } finally {
      setUpdateIsLoading(false)
    }
  }

  if (!api) return null

  return (
    <>
      <RequestForm
        onFormDataSubmit={handleFormData}
        operatorIncluded={false}
        updateIsLoading={updateIsLoading}
      />
    </>
  )
}
