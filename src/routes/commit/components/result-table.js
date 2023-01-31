import { useEffect, useState } from "react";
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Check as CheckIcon, Clear as ClearIcon } from "@mui/icons-material";
import "./result-table.css";
import Grid from "@mui/material/Grid";
import { Chip } from "@mui/material";

function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell align="left" component="th" scope="row">{row.act}</TableCell>
        <TableCell align="center">{row.result ? <CheckIcon color="success" sx={{ fontSize: '25px' }} /> : <ClearIcon color="error" sx={{ fontSize: '25px' }} />}</TableCell>
      </TableRow>

      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Chip label="جزئیات عملیات" size="small" sx={{ color: 'black' }} />

              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>عملیات</TableCell>
                    <TableCell>نتیجه</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {row.list_result.map((historyRow) => (
                    <TableRow key={historyRow.act}>
                      <TableCell component="th" scope="row">
                        {historyRow.act}
                      </TableCell>
                      <TableCell>{historyRow.res}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default function ResultTable({ result }) {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    set_result();
  }, [result]);

  const set_result = () => {
    let temp_rows = [];

    for (let key_1 of Object.keys(result)) {
      let temp_1 = result[key_1];

      for (let key_2 of Object.keys(temp_1)) {
        let temp_2 = temp_1[key_2];
        let key_end_result = true;
        let list_end_result = [];

        for (let key_3 of Object.keys(temp_2)) {
          let temp_4 = temp_2[key_3];
          if (temp_4.res !== "OK") {
            key_end_result = false;
          }
          list_end_result.push(
            {
              act: temp_4.act,
              res: (temp_4.res === "OK" ? <CheckIcon color="success" sx={{ fontSize: '25px' }} /> : temp_4.res),
            }
          )
        }

        temp_rows.push({
          act: key_2,
          result: key_end_result,
          list_result: list_end_result
        });
      }
    }

    setRows(temp_rows);
  }

  return (
    <Grid container spacing={2} xs={12} justifyContent="center" sx={{ mt: 3, mb: 2 }} className="result-table">
      <Grid item md={6} xs={12}>
          <TableContainer component={Paper}>
            <Table aria-label="collapsible table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: '10%' }} />
                  <TableCell sx={{ width: '45%' }} align="left">عملیات</TableCell>
                  <TableCell sx={{ width: '45%' }} align="center">نتیجه</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {rows.map((row) => (
                  <Row key={row.name} row={row} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
      </Grid>
    </Grid>
  );
}