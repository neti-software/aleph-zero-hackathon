import { ChangeEvent, useState } from 'react'

import { IconButton, TablePagination } from '@mui/material'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { createTheme, styled } from '@mui/material/styles'
import { BellPlusIcon, PlusCircleIcon } from 'lucide-react'

import RequestModal from '../ui/request-modal'

function createData(id: number, phoneNumber: string) {
  return { id, phoneNumber }
}
const theme = createTheme({
  palette: {
    primary: {
      main: '#00eac7',
    },
  },
})

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(even)': {
    backgroundColor: '#14202A',
  },
  '&:nth-of-type(odd)': {
    backgroundColor: '#111B24',
  },
  '& td': {
    border: 0,
    color: 'white',
  },
  '& th': {
    border: 0,
    color: 'white',
  },
}))

const StyledTableHeaderRow = styled(TableRow)(({ theme }) => ({
  backgroundColor: '#0D141B',
  '& th': {
    border: 0,
    color: 'white',
  },
}))

export default function BasicTable({
  data,
}: {
  data: {
    phoneNumber: string | null
    accountId: string | null
    operator: { name: string; walletAddress: string } | null
  }[]
}) {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [rows, setRows] = useState(data?.length || 0)
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState<'setMetadata' | 'registerNewRequest'>('setMetadata')
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null)
  const [currentOperator, setCurrentOperator] = useState<{
    name: string
    walletAddress: string
  } | null>()

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }
  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }
  console.log(data)
  return (
    <div className="container relative flex grow flex-col items-center justify-center text-white">
      <TableContainer component={Paper} elevation={10}>
        <Table sx={{ minWidth: 200 }} aria-label="simple table">
          <TableHead>
            <StyledTableHeaderRow>
              <TableCell>Id </TableCell>
              <TableCell>Phone Numbers </TableCell>
              <TableCell>Current phone number holder</TableCell>
              <TableCell>Operator </TableCell>
              <TableCell width="120px">Actions</TableCell>
            </StyledTableHeaderRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0 && data.length
              ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : data
            ).map((row, index) => (
              <StyledTableRow key={row.phoneNumber}>
                <TableCell component="th" scope="row">
                  {index + 1}
                </TableCell>
                <TableCell>{row.phoneNumber}</TableCell>
                <TableCell>{row.accountId}</TableCell>
                <TableCell>{row.operator?.name}</TableCell>
                <TableCell width="120px">
                  <IconButton
                    sx={{ color: '#00eac7', pl: 0 }}
                    onClick={(e) => {
                      setModalMode('setMetadata')
                      setShowModal(true)
                      setPhoneNumber(row.phoneNumber)
                    }}
                  >
                    <PlusCircleIcon />
                  </IconButton>
                  <IconButton
                    sx={{ color: '#00eac7', pl: 0 }}
                    onClick={(e) => {
                      setModalMode('registerNewRequest')
                      setShowModal(true)
                      setPhoneNumber(row.phoneNumber)
                      setCurrentOperator(row.operator)
                    }}
                  >
                    <BellPlusIcon />
                  </IconButton>
                </TableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
        <div
          style={{
            backgroundColor: '#0D141B',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px',
          }}
        >
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 100]}
            component="div"
            count={rows}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            className="bg-[#0D141B] text-white"
            sx={{
              '.MuiTablePagination-nativeInput': {
                color: 'white',
              },
              '.MuiTablePagination-select': {
                color: 'white',
              },
              '.MuiTablePagination-selectIcon': {
                color: 'white',
              },
              '.MuiButtonBase-root': {
                color: 'white',
              },
            }}
          />
        </div>
      </TableContainer>
      <RequestModal
        open={showModal}
        mode={modalMode}
        phoneNumber={phoneNumber}
        currentOperator={currentOperator}
        onClose={() => {
          setShowModal(false)
        }}
      ></RequestModal>
    </div>
  )
}
