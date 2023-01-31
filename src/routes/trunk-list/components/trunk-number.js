import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { Edit as EditIcon, Delete as DeleteIcon, Add, ExpandCircleDown } from "@mui/icons-material";
import { Alert } from "@mui/lab";
import Box from "@mui/material/Box";
import "./trunk-numbers.css";
import CustomModal from "../../../components/Modal";
import LoadingButton from "@mui/lab/LoadingButton";
import CustomDialog from "../../../components/Dialog";
import api from "../../../helpers/api/Api";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import Divider from "@mui/material/Divider";
import { validateNumber } from "../../../helpers/functions/functions";
import { connect } from "react-redux";
import { showSnackbar } from "../../../redux/actions";

function TrunkNumber({ showSnackbar, trunk, user_permission, setCommit }) {
  const [loading, setLoading] = useState("");
  const [theTrunk, setTheTrunk] = useState(null);
  const [open, setOpen] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [editNumber, setEditNumber] = useState({ regex: 0, number: "" });
  const [newEditNumber, setNewEditNumber] = useState({ regex: 0, number: "" });
  const [deleteNumber, setDeleteNumber] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [newNumber, setNewNumber] = useState({ regex: 0, number: "" });

  const handleOpen = () => {
    setOpen(true);
    setTheTrunk(trunk);
  };
  const handleClose = () => {
    setOpen(false);
    setTheTrunk(null);
  };

  const handleChange = (value, name) => {
    setNewNumber({
      ...newNumber,
      [name]: value,
    });
  };

  const onEditNumberButton = (n) => {
    if (editNumber === n) {
      checkInputs("edit");
    } else {
      setEditNumber(n);
      setNewEditNumber(n);
    }
  }

  const checkInputs = (op) => {
    let temp_alerts = [];
    if (op === "add") {
      if (newNumber.regex === 0) {
        if (newNumber.number === "") {
          temp_alerts.push("لطفا شماره تلفن را وارد نمایید.");
        } else if (!validateNumber(newNumber.number)) {
          temp_alerts.push("شماره تلفن فقط می‌تواند شامل اعداد باشد.");
        }
      } else {
        if (newNumber.number === "") {
          temp_alerts.push("regex نمی‌تواند خالی باشد.");
        }
      }
    } else if (op === "edit") {
      if (newEditNumber.regex === 0) {
        if (newEditNumber.number === "") {
          temp_alerts.push("شماره تلفن نمی‌تواند خالی باشد.");
        } else if (!validateNumber(newEditNumber.number)) {
          temp_alerts.push("شماره تلفن فقط می‌تواند شامل اعداد باشد.");
        }
      } else {
        if (newEditNumber.number === "") {
          temp_alerts.push("regex نمی‌تواند خالی باشد.");
        }
      }
    }

    setAlerts(temp_alerts);
    if (temp_alerts.length === 0) {
      if (op === "add") {
        addTrunkNumber();
      } else if (op === "edit") {
        editTrunkNumber();
      }
    }
  }

  const editTrunkNumber = () => {
    setLoading("edit"+editNumber.number);
    let successM = "ویرایش شماره تلفن با موفقیت انجام شد.", errorM = "خطا در ویرایش شماره تلفن!";
    if (newEditNumber.regex === 1) {
      successM = "ویرایش regex با موفقیت انجام شد.";
      errorM = "خطا در ویرایش regex!";
    }
    let postFormData = new FormData();
    postFormData.append('trid', trunk.id);
    postFormData.append('trnum', editNumber.number);
    postFormData.append('trnewnum', newEditNumber.number);
    postFormData.append('regex', newEditNumber.regex);

    api.post("smt/edittrunknumber.ms", postFormData)
      .then((response) => {
        setLoading("");
        setCommit(response.data.dirty);
        if (response.data.status === "success") {
          const index = theTrunk.number.indexOf(editNumber);
          if (index > -1) {
            let numbers = theTrunk.number;
            numbers[index] = newEditNumber;
            setTheTrunk({ ...theTrunk, number: numbers });
          }
          setEditNumber({ regex: 0, number: "" })
          setNewEditNumber({ regex: 0, number: "" });
          showSnackbar(successM, "success");
        } else {
          showSnackbar(errorM, "error");
        }
      })
      .catch((error) => {
        setLoading("");
        showSnackbar(errorM, "error");
      });
  }

  const addTrunkNumber = () => {
    setLoading("add");
    let successM = "اضافه کردن شماره تلفن به ترانک با موفقیت انجام شد!", errorM = "خطا در اضافه کردن شماره تلفن به ترانک!";
    if (newNumber.regex === 1) {
      successM = "اضافه کردن regex به ترانک با موفقیت انجام شد!";
      errorM = "خطا در اضافه کردن regex به ترانک!";
    }
    let postFormData = new FormData();
    postFormData.append('trid', trunk.id);
    postFormData.append('trnum', newNumber.number);
    postFormData.append('regex', newNumber.regex);

    api.post("smt/addtrunknumber.ms", postFormData)
      .then((response) => {
        setLoading("");
        setCommit(response.data.dirty);
        if (response.data.status === "success") {
          let numbers = theTrunk.number;
          numbers.push(newNumber);
          setTheTrunk({ ...theTrunk, number: numbers });
          setNewNumber({ regex: 0, number: "" });
          showSnackbar(successM, "success");
        } else {
          showSnackbar(errorM, "error");
        }
      })
      .catch((error) => {
        setLoading("");
        showSnackbar(errorM, "error");
      });
  }

  const toDeleteNumber = (n) => {
    setDeleteNumber(n);
    setOpenDialog(true);
  }

  const onDeleteNumber = () => {
    setLoading("delete");
    let postFormData = new FormData();
    postFormData.append('trid', trunk.id);
    postFormData.append('trnum', deleteNumber.number);
    let successM = "حذف شماره تلفن با موفقیت انجام شد.", errorM = "خطا در حذف شماره تلفن!";
    if (deleteNumber.regex === 1) {
      successM = "حذف regex با موفقیت انجام شد.";
      errorM = "خطا در حذف regex!";
    }

    api.post("smt/deltrunknumber.ms", postFormData)
      .then((response) => {
        setLoading("");
        setCommit(response.data.dirty);
        handle_close_dialog();
        if (response.data.status === "success") {
          const index = theTrunk.number.indexOf(deleteNumber);
          if (index > -1) {
            let numbers = theTrunk.number;
            numbers.splice(index, 1);
            setTheTrunk({ ...theTrunk, number: numbers });
          }
          showSnackbar(successM, "success");
        } else {
          showSnackbar(errorM, "error");
        }
      })
      .catch((error) => {
        setLoading("");
        handle_close_dialog();
        showSnackbar(errorM, "error");
      });
  }

  const handle_close_dialog = () => {
    setOpenDialog(false);
    setDeleteNumber(null);
  }

  return (
    <div>
      <div className="trunk-IpNumbers">
        <div className="trunk-IpNumbers-column">
          {trunk.number.map((n) => {
            return (
              <div style={{ direction: 'ltr' }}>{n.number}</div>
            );
          })}
        </div>

        <IconButton aria-label="edit" onClick={handleOpen}>
          {(user_permission === "1" || user_permission === "2") ?
            <EditIcon />
            :
            <>
              {trunk.number.length > 0 ?
                <ExpandCircleDown />
                :
                null
              }
            </>
          }
        </IconButton>
      </div>

      {open ?
        <CustomModal open={open} handleClose={handleClose}
                     title={(user_permission === "1" || user_permission === "2") ? "ویرایش شماره تلفن‌های ترانک" : "شماره تلفن‌های ترانک"}>
          <Box py={3} px={5}>
            <Grid spacing={2} justifyContent="center" sx={{ mt: 1, mb: 3 }} className="flex-column-md">

              {theTrunk.number.map((n) => {
                return (
                  <Grid item md={12} className="grid-flex" sx={{ mb: 3 }}>
                    <Grid item md={4} sx={{ mr: 2 }}>
                      <TextField id={n.number} label={n.regex === 0 ? "شماره تلفن" : "regex"} variant="outlined" fullWidth className="ltr-textfield"
                                 value={editNumber.number === n.number ? newEditNumber.number : n.number} disabled={(!(user_permission === "1" || user_permission === "2")) ? true : (editNumber.number !== n.number)}
                                 onChange={(e) => setNewEditNumber({regex: newEditNumber.regex, number: e.target.value})}
                      />
                    </Grid>

                    <Grid item md={3} sx={{ mr: 2 }}>
                      <FormControl fullWidth>
                        <InputLabel id={"isNewNumberRegex"+n.number}>نوع</InputLabel>
                        <Select
                          disabled={!(user_permission === "1" || user_permission === "2")}
                          labelId="isNewNumberRegex"
                          id={"isNewNumberRegex-select"+n.number}
                          value={editNumber.number === n.number ? newEditNumber.regex : n.regex}
                          label="نوع"
                          onChange={(e) => setNewEditNumber({regex: e.target.value, number: newEditNumber.number})}
                        >
                          <MenuItem value={0}>شماره تلفن</MenuItem>
                          <MenuItem value={1}>regex</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    {(user_permission === "1" || user_permission === "2") ?
                      <>
                        <LoadingButton
                          sx={{ mr: 2 }}
                          className="icon-loading-button"
                          color="info"
                          loading={loading === ("edit"+n.number)}
                          variant="outlined"
                          onClick={() => onEditNumberButton(n)}
                        >
                          {editNumber.number === n.number ? "ویرایش" : <EditIcon />}
                        </LoadingButton>

                        <LoadingButton
                          className="icon-loading-button"
                          color="error"
                          loading={loading === ("delete"+n.number)}
                          variant="outlined"
                          onClick={() => toDeleteNumber(n)}
                        >
                          <DeleteIcon />
                        </LoadingButton>
                      </>
                      :
                      null
                    }
                  </Grid>
                )
              })}

              {(user_permission === "1" || user_permission === "2") ?
                <>
                  {theTrunk.number.length > 0 ?
                    <Divider variant="middle" />
                    :
                    null
                  }

                  <h6>اضافه کردن شماره تلفن جدید</h6>

                  {alerts.length > 0 ?
                    <Grid item md={12}>
                      {alerts.map((alert) => {
                        return <Alert severity="error">{alert}</Alert>
                      })}
                    </Grid>
                    :
                    null
                  }

                  <Grid item md={12} sx={{ mt: 2 }} className="grid-flex">
                    <Grid item md={4} sx={{ mr: 2 }}>
                      <TextField id="new_number" label={newNumber.regex === 0 ? "شماره تلفن جدید" : "regex جدید"} variant="outlined"
                                 value={newNumber.number} fullWidth className="ltr-textfield"
                                 onChange={(e) => handleChange(e.target.value, "number")} />
                    </Grid>

                    <Grid item md={3} sx={{ mr: 2 }}>
                      <FormControl fullWidth>
                        <InputLabel id="isNewNumberRegex">نوع</InputLabel>
                        <Select
                          labelId="isNewNumberRegex"
                          id="isNewNumberRegex-select"
                          value={newNumber.regex}
                          label="نوع"
                          onChange={(e) => handleChange(e.target.value, "regex")}
                        >
                          <MenuItem value={0}>شماره تلفن</MenuItem>
                          <MenuItem value={1}>regex</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    <LoadingButton
                      className="icon-loading-button"
                      color="success"
                      loading={loading === "add"}
                      variant="outlined"
                      onClick={() => checkInputs("add")}
                    >
                      <Add />
                    </LoadingButton>
                  </Grid>
                </>
                :
                null
              }
            </Grid>

          </Box>
        </CustomModal>
        :
        null
      }

      {deleteNumber ?
        <CustomDialog
          open={openDialog}
          title="حدف شماره تلفن"
          text={"آیا از حذف شماره تلفن " + deleteNumber.number + " اطمینان دارید؟"}
          handleClose={handle_close_dialog}
          onAccept={onDeleteNumber}
          loading={loading === "delete"}
        />
        :
        null
      }
    </div>
  )
}

const mapDispatchToProps = dispatch => {
  return {
    showSnackbar: (message, severity) => dispatch(showSnackbar(message, severity))
  }
}

const mapStateToProps = state => ({
  user_permission: state.user_permission
});

export default connect(mapStateToProps, mapDispatchToProps)(TrunkNumber);
