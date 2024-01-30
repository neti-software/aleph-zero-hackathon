import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Mint from '@/app/register-phone/page';
import SetMetadata from '@/app/set-metadata/page';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'black',
  border: '2px solid #00eac7',
  borderRadius: '10px',
  boxShadow: 24,
  p: 4,
};

interface Props {
  mode?: 'minting' | 'setting';
  open: boolean,
  onClose: () => void;
}

export default function RequestModal({
  mode = 'minting',
  open,
  onClose
}: Props) {
  return (
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {mode == 'minting' && (<Mint />)}
          {mode == 'setting' && (<SetMetadata />)}
        </Box>
      </Modal>
  );
}