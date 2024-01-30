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
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(20)

  const [fetchIsLoading, setFetchIsLoading] = useState<boolean>()
  const [tableData, setTableData] = useState<string[]>([])
  const fetchData = async () => {
    if (!contract || !api) return

    setFetchIsLoading(true)
    try {
      if (!api || !contract) return
      const result = await contractQuery(api, '', contract, 'PSP34::totalSupply')
      const { output, isError, decodedOutput } = decodeOutput(
        result,
        contract,
        'PSP34::totalSupply',
      )
      for (let index = 0; index < +output; index++) {
        const result = await contractQuery(api, '', contract, 'PSP34Enumerable::tokenByIndex', {}, [
          index,
        ])
        const { output, isError, decodedOutput } = decodeOutput(
          result,
          contract,
          'PSP34Enumerable::tokenByIndex',
        )
        if (isError) throw new Error(decodedOutput)
        if (output && output.Ok && output.Ok.Bytes) {
          setTableData((prevData) => {
            return [...prevData, output.Ok.Bytes]
          })
        }
      }
    } catch (e) {
      console.error(e)
      toast.error('Error while fetching table data. Try again…')
      setTableData([])
    } finally {
      setFetchIsLoading(false)
    }
  }
  useEffect(() => {
    fetchData()
  }, [contract])

  if (!api) return null

  return <>{!!tableData.length && <BasicTable data={tableData} />}</>
}
