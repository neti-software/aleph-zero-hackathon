'use client'

import { useEffect, useState } from 'react'

import { ContractIds } from '@/deployments/deployments'
import Keyring from '@polkadot/keyring'
import { hexToU8a } from '@polkadot/util'
import {
  contractQuery,
  decodeOutput,
  useInkathon,
  useRegisteredContract,
} from '@scio-labs/use-inkathon'
import operatorData from 'public/operators.json'
import toast from 'react-hot-toast'

import BasicTable from '@/components/table/table'

const keyring = new Keyring()

export default function Dashboard() {
  const { api, activeAccount, activeSigner } = useInkathon()
  const { contract, address: contractAddress } = useRegisteredContract(ContractIds.PhoneNumbers)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(20)

  const [fetchIsLoading, setFetchIsLoading] = useState<boolean>()

  const [tableData, setTableData] = useState<
    {
      phoneNumber: string | null
      accountId: string | null
      operator: { name: string; walletAddress: string } | null
    }[]
  >([])

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
        const phonesNumber = await contractQuery(
          api,
          '',
          contract,
          'PSP34Enumerable::tokenByIndex',
          {},
          [index],
        )
        const { output, isError, decodedOutput } = decodeOutput(
          phonesNumber,
          contract,
          'PSP34Enumerable::tokenByIndex',
        )
        if (isError) throw new Error(decodedOutput)
        if (output && output.Ok && output.Ok.Bytes) {
          const metadata = await contractQuery(
            api,
            '',
            contract,
            'PSP34Metadata::get_attribute',
            {},
            [{ Bytes: output.Ok.Bytes }, 'owner'],
          )
          const {
            output: output2,
            isError: isError2,
            decodedOutput: decodedOutput2,
          } = decodeOutput(metadata, contract, 'PSP34Metadata::get_attribute')

          const output3 = output2 != null ? keyring.encodeAddress(hexToU8a(output2), 42) : output2
          const operator = await contractQuery(api, '', contract, 'PSP34::ownerOf', {}, [output.Ok])
          const {
            output: output4,
            isError: isError4,
            decodedOutput: decodedOutput4,
          } = decodeOutput(operator, contract, 'PSP34::ownerOf')
          const matchedOperator =
            operatorData.find((operator) => operator.walletAddress === output4) || null
          setTableData((prevData) => [
            ...prevData,
            { phoneNumber: output.Ok.Bytes, accountId: output3, operator: matchedOperator },
          ])
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
