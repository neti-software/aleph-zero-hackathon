import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'

import SetMetadata from '@/app/set-metadata/page'

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
  mode?: 'minting' | 'setting'
  open: boolean
  onClose: () => void
  phoneNumber?: string | null
}

export default function RequestModal({ mode = 'minting', open, onClose, phoneNumber }: Props) {
  const handleClose = () => {
    onClose()
  }
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        {mode == 'minting' && <RequestMetadata phoneNumber={phoneNumber} onClose={onClose} />}
        {mode == 'setting' && <SetMetadata />}
      </Box>
    </Modal>
  )
}
