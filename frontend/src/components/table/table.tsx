import { ChangeEvent, useState } from 'react'

import { TablePagination } from '@mui/material'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { createTheme, styled } from '@mui/material/styles'

function createData(name: number, calories: number, fat: number, carbs: number, protein: number) {
  return { name, calories, fat, carbs, protein }
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
const data = [
  createData(23, 159, 6.0, 24, 4.0),
  createData(23, 237, 9.0, 37, 4.3),
  createData(23, 262, 16.0, 24, 6.0),
  createData(23, 305, 3.7, 67, 4.3),
  createData(23, 356, 16.0, 49, 3.9),
]

export default function BasicTable() {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [rows, setRows] = useState(data)

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  // const addRow = () => {
  //   const newRow = createData(0, 0, 0, 0, 0)
  //   rows.push(newRow)
  //   // Make a copy of the rows array to trigger a re-render
  //   setRows([...rows])
  // }

  return (
    <div className="container relative flex grow flex-col items-center justify-center text-white">
      <TableContainer component={Paper} elevation={10}>
        <Table sx={{ minWidth: 200 }} aria-label="simple table">
          <TableHead>
            <StyledTableHeaderRow>
              <TableCell>Dessert </TableCell>
              <TableCell>Calories</TableCell>
              <TableCell>Fat&nbsp;(g)</TableCell>
              <TableCell>Carbs&nbsp;(g)</TableCell>
              <TableCell>Protein&nbsp;(g)</TableCell>
            </StyledTableHeaderRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : rows
            ).map((row) => (
              <StyledTableRow key={row.name}>
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell>{row.calories}</TableCell>
                <TableCell>{row.fat}</TableCell>
                <TableCell>{row.carbs}</TableCell>
                <TableCell>{row.protein}</TableCell>
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
            count={rows.length}
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
    </div>
  )
}
