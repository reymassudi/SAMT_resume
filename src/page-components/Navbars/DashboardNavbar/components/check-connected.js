import { useEffect, useRef, useState } from "react";
import { Check as CheckIcon, Circle as CircleIcon, Clear as ClearIcon, SyncProblem as SyncProblemIcon } from "@mui/icons-material";
import api from "../../../../helpers/api/Api";
import Box from "@mui/material/Box";
import * as React from "react";
import IconButton from "@mui/material/IconButton";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import "./check-connected-table.css";
import { Modal } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";

function CheckConnected() {
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState([]);
  const [connectColor, setConnectColor] = useState('success');
  const [timeConnectedUpdated, setTimeConnectedUpdated] = useState(new Date());
  const timeoutConnectedRef = useRef();
  const connectStateColor = {
    "success": "فعال",
    "error": "قطع",
    "warning": "در حال بررسی"
  }

  useEffect(() => {
    checkConnected();
    return () => window.clearTimeout(timeoutConnectedRef.current);
  }, []);

  useEffect(() => {
    window.clearTimeout(timeoutConnectedRef.current);
    timeoutConnectedRef.current = window.setTimeout(
      () => {
        timeoutConnectedRef.current = null;
        setTimeConnectedUpdated(new Date());
        checkConnected();
      }, 20000
    );
  }, [timeConnectedUpdated]);

  const handleOpen = () => {
    if (connectColor !== "success") {
      setOpen(true);
    }
  };
  const handleClose = () => {
    setOpen(false);
  };

  const checkConnected = () => {
    api.get("smt/conncheck.ms")
      .then((response) => {
        set_result(response.data);
      })
      .catch((error) => {
      });
  }

  const set_result = (result) => {
    let state = "success";
    let temp_rows = [];

    for (let key_1 of Object.keys(result)) {
      let temp_1 = result[key_1];

      for (let i = 0; i < temp_1.length; i++) {
        let temp_dest = temp_1[i].Destinations;
        for (let j = 0; j < temp_dest.length; j++) {
          let dest = temp_dest[j];
          let destState = dest.state.toLowerCase();
          if (destState !== "active") {
            if (state !== "error") {
              if (destState === "inactive") {
                state = "error";
              } else {
                state = "warning";
              }
            }

            temp_rows.push({
              name: key_1,
              destination: dest.description,
              state: destState
            });
          }
        }
      }
    }

    setConnectColor(state);
    setRows(temp_rows);
  }

  return (
    <Box>
      <Tooltip title={connectStateColor[connectColor]}>
        <IconButton aria-label="isConnected" color={connectColor} className="icon-button"
                    onClick={handleOpen} >
          <CircleIcon />
        </IconButton>
      </Tooltip>

      {open ?
        <Modal
          open={open}
          onClose={handleClose}
          className="mui-modal-custom"
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <TableContainer component={Paper} className="check-connected">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: '45%' }}>مبدا اتصال</TableCell>
                  <TableCell align="center" sx={{ width: '45%' }}>مقصد اتصال</TableCell>
                  <TableCell align="center" sx={{ width: '10%' }}>وضعیت</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {rows.length > 0 && rows.map((row, index) => (
                  <TableRow
                    key={index}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell align="center">{row.destination}</TableCell>
                    <TableCell align="center">
                      {row.state === "active" ?
                        <CheckIcon color="success" sx={{ fontSize: '25px' }} /> :
                        (row.state === "inactive" ?
                            <ClearIcon color="error" sx={{ fontSize: '25px' }} /> :
                            <SyncProblemIcon color="warning" sx={{ fontSize: '25px' }} />
                        )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Modal>
        :
        null
      }
    </Box>
  )
}

export default CheckConnected;
