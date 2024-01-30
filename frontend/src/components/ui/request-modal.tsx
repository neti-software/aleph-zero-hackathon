import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'

import FinishTransfer from '@/app/finish-transfer/page'
import RegisterRequest from '@/app/register-request/page'

import RequestMetadata from './request-metadata'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'black',
  border: '2px solid #00eac7',
  borderRadius: '10px',
  boxShadow: 24,
  p: 4,
}

interface Props {
  mode?: 'setMetadata' | 'registerNewRequest' | 'finishTransfer' | 'approveTransfer'
  open: boolean
  onClose: () => void
  phoneNumber?: string | null
  currentOperator?: string | null
}

export default function RequestModal({
  mode = 'setMetadata',
  open,
  onClose,
  phoneNumber,
  currentOperator,
}: Props) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        {mode == 'setMetadata' && <RequestMetadata phoneNumber={phoneNumber} onClose={onClose} />}
        {mode == 'finishTransfer' && <FinishTransfer phoneNumber={phoneNumber} onClose={onClose} />}
        {mode == 'registerNewRequest' && (
          <RegisterRequest
            phoneNumber={phoneNumber}
            currentOperator={currentOperator}
            onClose={onClose}
          />
        )}
        {mode == 'approveTransfer' && (
          <RegisterRequest
            phoneNumber={phoneNumber}
            currentOperator={currentOperator}
            onClose={onClose}
          />
        )}
      </Box>
    </Modal>
  )
}
