'use client'

import { useEffect, useState } from 'react'

import { ContractIds } from '@/deployments/deployments'
import {
  contractQuery,
  decodeOutput,
  useInkathon,
  useRegisteredContract,
} from '@scio-labs/use-inkathon'
import toast from 'react-hot-toast'

import BasicTable from '@/components/table/table'

export default function Dashboard() {
  const { api, activeAccount, activeSigner } = useInkathon()
  const { contract, address: contractAddress } = useRegisteredContract(ContractIds.PhoneNumbers)
  const [updateIsLoading, setUpdateIsLoading] = useState<boolean>(false)
  const [fetchIsLoading, setFetchIsLoading] = useState<boolean>()
  const [tableData, setTableData] = useState<any>()
  const fetchData = async () => {
    if (!contract || !api) return

    setFetchIsLoading(true)
    try {
      //todo iterate over owners(operators), pass data to the table
      const result = await contractQuery(
        api,
        '',
        contract,
        'PSP34Enumerable::owners_token_by_index',
        {},
        [activeAccount?.address, 0],
      )
      const { output, isError, decodedOutput } = decodeOutput(
        result,
        contract,
        'PSP34Enumerable::owners_token_by_index',
      )
      if (isError) throw new Error(decodedOutput)
      setTableData(output)
    } catch (e) {
      console.error(e)
      toast.error('Error while fetching table data. Try again…')
      setTableData(undefined)
    } finally {
      setFetchIsLoading(false)
    }
  }
  useEffect(() => {
    fetchData()
  }, [contract])

  if (!api) return null

  return (
    <>
      <BasicTable />
    </>
  )
}
