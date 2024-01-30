'use client'

import { useEffect, useState } from 'react'

import { ContractIds } from '@/deployments/deployments'
import Keyring from '@polkadot/keyring'
import {
  contractQuery,
  decodeOutput,
  useInkathon,
  useRegisteredContract,
} from '@scio-labs/use-inkathon'
import toast from 'react-hot-toast'

import TransferTable from '@/components/table/transferTable'

const keyring = new Keyring()

export default function TransferRequest() {
  const { api, activeAccount, activeSigner } = useInkathon()
  const { contract, address: contractAddress } = useRegisteredContract(ContractIds.TransferEscrow)

  const [fetchIsLoading, setFetchIsLoading] = useState<boolean>()

  const [tableData, setTableData] = useState<
    { phoneNumber: string | null; accountId: string | null }[]
  >([])

  const fetchData = async () => {
    if (!contract || !api) return

    setFetchIsLoading(true)

    try {
      const result = await contractQuery(api, '', contract, 'get_request_count')

      const { output } = decodeOutput(result, contract, 'get_request_count')

      const requests = []

      for (let index = 0; index < +output; index++) {
        const phonesNumber = contractQuery(api, '', contract, 'get_request', {}, [index])
        requests.push(phonesNumber)
      }

      const resultRequests = await Promise.all(requests)

      const outputData = resultRequests.map((phoneNumber) => {
        const { output, isError, decodedOutput } = decodeOutput(
          phoneNumber,
          contract,
          'get_request',
        )

        if (isError) throw new Error(decodedOutput)

        console.log(output)

        return { phoneNumber: output.Ok.Bytes, accountId: output }
      })

      setTableData(outputData)
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

  return <>{!tableData.length && !fetchIsLoading && <TransferTable data={tableData} />}</>
}
