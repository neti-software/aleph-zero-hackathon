'use client'

import { useState } from 'react'

import { ContractIds } from '@/deployments/deployments'
import { Button, InputLabel, MenuItem, TextField } from '@mui/material'
import { useInkathon, useRegisteredContract } from '@scio-labs/use-inkathon'
import operatorData from 'public/operators.json'
import toast from 'react-hot-toast'

import { contractTxWithToast } from '@/utils/contract-tx-with-toast'

export default function RegisterRequest({
  phoneNumber,
  currentOperator,
  onClose,
}: {
  currentOperator?: { name: string; walletAddress: string } | null
  phoneNumber?: string | null
  onClose: () => void
}) {
  const { api, activeAccount, activeSigner } = useInkathon()
  const { contract: transferEscrowContract, address: transferEscrowAddress } =
    useRegisteredContract(ContractIds.TransferEscrow)
  const { contract: phoneNumberContract } = useRegisteredContract(ContractIds.PhoneNumbers)

  const [updateIsLoading, setUpdateIsLoading] = useState<boolean>(false)
  const [targetOperator, setTargetOperator] = useState<string>('')

  const handleFormData = async () => {
    if (
      !activeAccount ||
      !transferEscrowContract ||
      !phoneNumberContract ||
      !activeSigner ||
      !api
    ) {
      toast.error('Wallet not connected. Try again…')
      return
    }

    setUpdateIsLoading(true)
    try {
      if (!phoneNumber || !targetOperator || !currentOperator?.walletAddress) return

      await contractTxWithToast(
        api,
        activeAccount.address,
        transferEscrowContract,
        'register_new_request',
        {},
        [{ Bytes: phoneNumber }, targetOperator],
      )

      await contractTxWithToast(
        api,
        currentOperator?.walletAddress,
        phoneNumberContract,
        'PSP34::approve',
        {},
        [transferEscrowAddress, { Bytes: phoneNumber }, true],
      )

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
      <div>
        <InputLabel sx={{ color: '#00eac7' }}>current operator</InputLabel>
        <TextField
          margin="normal"
          value={currentOperator?.name}
          disabled={true}
          required
          fullWidth
          autoFocus
          sx={{
            mt: 0,
            input: { color: 'black' },
            backgroundColor: 'white',
            borderRadius: '10px',
            '& label.Mui-focused': {
              color: '#00eac7',
              borderRadius: '10px',
            },
            '& .MuiInput-underline:after': {
              borderBottomColor: '#00eac7',
              borderRadius: '10px',
            },
            '& .MuiOutlinedInput-root': {
              '&:hover fieldset': {
                borderColor: '#00eac7',
                borderRadius: '10px',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#00eac7',
                borderRadius: '10px',
              },
            },
          }}
        />
      </div>
      <div>
        <InputLabel sx={{ color: '#00eac7' }}>new operator</InputLabel>
        <TextField
          margin="normal"
          value={targetOperator}
          required
          fullWidth
          select
          autoFocus
          onChange={(e) => setTargetOperator(e.target.value)}
          sx={{
            mt: 0,
            input: { color: 'black' },
            backgroundColor: 'white',
            borderRadius: '10px',
            '& label.Mui-focused': {
              color: '#00eac7',
              borderRadius: '10px',
            },
            '& .MuiInput-underline:after': {
              borderBottomColor: '#00eac7',
              borderRadius: '10px',
            },
            '& .MuiOutlinedInput-root': {
              '&:hover fieldset': {
                borderColor: '#00eac7',
                borderRadius: '10px',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#00eac7',
                borderRadius: '10px',
              },
            },
          }}
        >
          {operatorData.map((operator) => (
            <MenuItem key={operator.walletAddress} value={operator.walletAddress}>
              {operator.name}
            </MenuItem>
          ))}
        </TextField>
      </div>

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
        CONFIRM REQUEST
      </Button>
    </>
  )
}
