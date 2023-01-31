import { useState } from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { Edit as EditIcon, Delete as DeleteIcon, Add } from "@mui/icons-material";
import { Alert } from "@mui/lab";
import "./trunk-numbers.css";
import LoadingButton from "@mui/lab/LoadingButton";
import CustomDialog from "../../../components/Dialog";
import api from "../../../helpers/api/Api";
import { validateIP, validateNumber } from "../../../helpers/functions/functions";
import { connect } from "react-redux";
import { showSnackbar } from "../../../redux/actions";

function TrunkIP({ trunk, ip, dfltcpsip, handleDeleteIP, handleEditIP, user_permission, setCommit, showSnackbar }) {
  const [loading, setLoading] = useState("");
  const [theIP, setTheIP] = useState(ip);
  const [isOnEdit, setIsOnEdit] = useState(false);
  const [newPrefix, setNewPrefix] = useState("");
  const [newCPS, setNewCPS] = useState(dfltcpsip);
  const [isOnCPSEdit, setIsOnCPSEdit] = useState(false);
  const [isOnCPSAdd, setIsOnCPSAdd] = useState(false);

  const [alerts, setAlerts] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openPrefixDialog, setOpenPrefixDialog] = useState(false);
  const [openCPSDialog, setOpenCPSDialog] = useState(false);

  const onEditIPButton = () => {
    if (isOnEdit) {
      checkInputs("edit");
    } else {
      setIsOnEdit(true);
    }
  }

  const checkInputs = (op) => {
    let temp_alerts = [];
    if (op === "edit") {
      if (theIP.ip === "") {
        temp_alerts.push("IP نمی‌تواند خالی باشد.");
      } else if (!validateIP(theIP.ip)) {
        temp_alerts.push("لطفا IP را به فرمت صحیح وارد نمایید.");
      }
    } else if (op === "add-prefix") {
      if (newPrefix === "") {
        temp_alerts.push("پیش‌شماره نمی‌تواند خالی باشد.");
      } else if (!validateNumber(newPrefix)) {
        temp_alerts.push("پیش‌شماره فقط می‌تواند شامل اعداد باشد.");
      }
    } else if (op === "add-cps") {
      if (newCPS === "") {
        temp_alerts.push("تعداد تماس در ثانیه نمی‌تواند خالی باشد.");
      }
    } else if (op === "edit-cps") {
      if (theIP.cps === "") {
        temp_alerts.push("تعداد تماس در ثانیه نمی‌تواند خالی باشد.");
      }
    }

    setAlerts(temp_alerts);
    if (temp_alerts.length === 0) {
      if (op === "edit") {
        editTrunkIP();
      } else if (op === "add-prefix") {
        addPrefix();
      } else if (op === "add-cps") {
        addCPS();
      } else if (op === "edit-cps") {
        editCPS();
      }
    }
  }

  const editTrunkIP = () => {
    setLoading("edit");
    let postFormData = new FormData();
    postFormData.append('trid', trunk.id);
    postFormData.append('trip', ip.ip);
    postFormData.append('trnewip', theIP.ip);

    api.post("smt/edittrunkip.ms", postFormData)
      .then((response) => {
        setLoading("");
        setIsOnEdit(false);
        setCommit(response.data.dirty);
        if (response.data.status === "success") {
          showSnackbar("ویرایش IP با موفقیت انجام شد.", "success");
          handleEditIP(ip, theIP.ip);
        } else {
          showSnackbar("خطا در ویرایش IP!", "error");
        }
      })
      .catch((error) => {
        setLoading("");
        showSnackbar("خطا در ویرایش IP!", "error");
      });
  }

  const toDeleteIP = () => {
    setOpenDialog(true);
  }

  const onDeleteIP = () => {
    setLoading("delete");
    let postFormData = new FormData();
    postFormData.append('trid', trunk.id);
    postFormData.append('trip', theIP.ip);

    api.post("smt/deltrunkip.ms", postFormData)
      .then((response) => {
        setLoading("");
        handle_close_dialog();
        setCommit(response.data.dirty);
        if (response.data.status === "success") {
          handleDeleteIP(theIP);
          showSnackbar("حذف IP با موفقیت انجام شد.", "success");
        } else {
          showSnackbar("خطا در حذف IP!", "error");
        }
      })
      .catch((error) => {
        setLoading("");
        handle_close_dialog();
        showSnackbar("خطا در حذف IP!", "error");
      });
  }

  const toDeletePrefix = () => {
    setOpenPrefixDialog(true);
  }

  const onDeletePrefix = () => {
    setLoading("delete-prefix");
    let postFormData = new FormData();
    postFormData.append('ip', theIP.ip);
    postFormData.append('trprefix', theIP.prefix);

    api.post("smt/delipprefix.ms", postFormData)
      .then((response) => {
        setLoading("");
        setOpenPrefixDialog(false);
        setCommit(response.data.dirty);
        if (response.data.status === "success") {
          setTheIP({...theIP, prefix: null});
          showSnackbar("حذف پیش‌شماره با موفقیت انجام شد!", "success");
        } else {
          showSnackbar("خطا در حذف پیش‌شماره!", "error");
        }
      })
      .catch((error) => {
        setLoading("");
        setOpenPrefixDialog(false);
        showSnackbar("خطا در حذف پیش‌شماره!", "error");
      });
  }

  const addPrefix = () => {
    setLoading("add-prefix");
    let postFormData = new FormData();
    postFormData.append('ip', theIP.ip);
    postFormData.append('trprefix', newPrefix);

    api.post("smt/addipprefix.ms", postFormData)
      .then((response) => {
        setLoading("");
        setCommit(response.data.dirty);
        if (response.data.status === "success") {
          setTheIP({...theIP, prefix: newPrefix});
          setNewPrefix("");
          showSnackbar("پیش‌شماره با موفقیت به IP اضافه شد!", "success");
        } else {
          showSnackbar("خطا در اضافه کردن پیش‌شماره!", "error");
        }
      })
      .catch((error) => {
        setLoading("");
        showSnackbar("خطا در اضافه کردن پیش‌شماره!", "error");
      });
  }

  const addCPS = () => {
    setLoading("add-cps");
    let postFormData = new FormData();
    postFormData.append('ip', theIP.ip);
    postFormData.append('cps', newCPS);

    api.post("smt/addcps.ms", postFormData)
      .then((response) => {
        setLoading("");
        setIsOnCPSAdd(false);
        setCommit(response.data.dirty);
        if (response.data.status === "success") {
          setTheIP({...theIP, cps: newCPS});
          setNewCPS(dfltcpsip);
          showSnackbar("تعداد تماس در ثانیه با موفقیت به IP اضافه شد!", "success");
        } else {
          showSnackbar("خطا در اضافه کردن تعداد تماس در ثانیه!", "error");
        }
      })
      .catch((error) => {
        setLoading("");
        showSnackbar("خطا در اضافه کردن تعداد تماس در ثانیه!", "error");
      });
  }

  const toDeleteCPS = () => {
    setOpenCPSDialog(true);
  }

  const onDeleteCPS = () => {
    setLoading("delete-cps");
    let postFormData = new FormData();
    postFormData.append('ip', theIP.ip);

    api.post("smt/delcps.ms", postFormData)
      .then((response) => {
        setLoading("");
        setOpenCPSDialog(false);
        setCommit(response.data.dirty);
        if (response.data.status === "success") {
          setTheIP({...theIP, cps: null});
          showSnackbar("حذف تعداد تماس در ثانیه با موفقیت انجام شد!", "success");
        } else {
          showSnackbar("خطا در حذف تعداد تماس در ثانیه!", "error");
        }
      })
      .catch((error) => {
        setLoading("");
        setOpenPrefixDialog(false);
        showSnackbar("خطا در حذف تعداد تماس در ثانیه!", "error");
      });
  }

  const onEditCPSButton = () => {
    if (isOnCPSEdit) {
      checkInputs("edit-cps");
    } else {
      setIsOnCPSEdit(true);
    }
  }

  const onAddCPSButton = () => {
    if (isOnCPSAdd) {
      checkInputs("add-cps");
    } else {
      setIsOnCPSAdd(true);
    }
  }

  const editCPS = () => {
    setLoading("edit-cps");
    let postFormData = new FormData();
    postFormData.append('ip', ip.ip);
    postFormData.append('cps', theIP.cps);

    api.post("smt/editcps.ms", postFormData)
      .then((response) => {
        setLoading("");
        setIsOnCPSEdit(false);
        setCommit(response.data.dirty);
        if (response.data.status === "success") {
          showSnackbar("ویرایش تماس در ثانیه با موفقیت انجام شد.", "success");
        } else {
          showSnackbar("خطا در ویرایش تماس در ثانیه!", "error");
        }
      })
      .catch((error) => {
        setLoading("");
        showSnackbar("خطا در ویرایش تماس در ثانیه!", "error");
      });
  }

  const handle_close_dialog = () => {
    setOpenDialog(false);
  }

  return (
    <>
      {theIP ?
        <>
          <Grid container justifyContent="center" className="flex-column-md" sx={{ mb: 2, mt: 1 }}>

            <Grid item md={4} className="grid-flex">
              <TextField id={ip.ip} label="IP" variant="outlined" fullWidth
                         value={theIP.ip} sx={{ mr: 1 }}
                         disabled={(!(user_permission === "1" || user_permission === "2")) ? true : (!isOnEdit)}
                         onChange={(e) => setTheIP({...theIP, ip: e.target.value})}
              />

              {(user_permission === "1" || user_permission === "2") ?
                <>
                  <LoadingButton
                    sx={{ mr: 1 }}
                    className="icon-loading-button"
                    color="info"
                    loading={loading === "edit"}
                    variant="outlined"
                    onClick={onEditIPButton}
                  >
                    {isOnEdit ? "ویرایش" : <EditIcon />}
                  </LoadingButton>

                  <LoadingButton
                    className="icon-loading-button"
                    color="error"
                    loading={loading === "delete"}
                    variant="outlined"
                    onClick={toDeleteIP}
                  >
                    <DeleteIcon />
                  </LoadingButton>
                </>
                :
                null
              }
            </Grid>

            {theIP.prefix || !(user_permission === "1" || user_permission === "2") ?
              <Grid item md={4} className="grid-flex">
                <TextField id={theIP.prefix} label="پیش‌شماره" variant="outlined" fullWidth
                           value={theIP.prefix} disabled sx={{ mr: 1, ml: 3 }}
                />

                {(user_permission === "1" || user_permission === "2") ?
                  <LoadingButton
                    className="icon-loading-button"
                    color="error"
                    loading={loading === "delete-prefix"}
                    variant="outlined"
                    onClick={toDeletePrefix}
                  >
                    <DeleteIcon />
                  </LoadingButton>
                  :
                  null
                }
              </Grid>
              :
              <Grid item md={4} className="grid-flex">
                <TextField id="newPrefix" label="پیش‌شماره" variant="outlined" fullWidth
                           value={newPrefix} sx={{ mr: 1, ml: 3 }}
                           onChange={(e) => setNewPrefix(e.target.value)}
                />

                <LoadingButton
                  className="icon-loading-button"
                  color="success"
                  loading={loading === "add-prefix"}
                  variant="outlined"
                  onClick={() => checkInputs("add-prefix")}
                >
                  <Add />
                </LoadingButton>
              </Grid>
            }

            {/*call-per-second*/}
            {theIP.cps || !(user_permission === "1" || user_permission === "2") ?
              <Grid item md={4} className="grid-flex">
                <TextField id={theIP.cps} label="تعداد تماس در ثانیه" variant="outlined" fullWidth type={"number"}
                           value={(!(user_permission === "1" || user_permission === "2") && !theIP.cps) ? dfltcpsip : theIP.cps}
                           sx={{ mr: 1, ml: 3 }} InputProps={{ inputProps: { min: dfltcpsip } }}
                           onChange={(e) => setTheIP({...theIP, cps: e.target.value})}
                           disabled={(!(user_permission === "1" || user_permission === "2")) ? true : (!isOnCPSEdit)}
                />

                {(user_permission === "1" || user_permission === "2") ?
                  <>
                    <LoadingButton
                      sx={{ mr: 1 }}
                      className="icon-loading-button"
                      color="info"
                      loading={loading === "edit-cps"}
                      variant="outlined"
                      onClick={onEditCPSButton}
                    >
                      {isOnCPSEdit ? "ویرایش" : <EditIcon />}
                    </LoadingButton>

                    <LoadingButton
                      className="icon-loading-button"
                      color="error"
                      loading={loading === "delete-cps"}
                      variant="outlined"
                      onClick={toDeleteCPS}
                    >
                      <DeleteIcon />
                    </LoadingButton>
                  </>
                  :
                  null
                }
              </Grid>
              :
              <Grid item md={4} className="grid-flex">
                <TextField id="newCPS" label="تعداد تماس در ثانیه" variant="outlined" fullWidth
                           value={newCPS} sx={{ mr: 1, ml: 3 }} type={"number"} InputProps={{ inputProps: { min: dfltcpsip } }}
                           onChange={(e) => setNewCPS(e.target.value)} disabled={!isOnCPSAdd}
                />

                <LoadingButton
                  className="icon-loading-button"
                  color="success"
                  loading={loading === "add-cps"}
                  variant="outlined"
                  onClick={onAddCPSButton}
                >
                  {isOnCPSAdd ? "ویرایش" : <EditIcon />}
                </LoadingButton>
              </Grid>
            }

          </Grid>

          {alerts.length > 0 ?
            <Grid item md={12}>
              {alerts.map((alert) => {
                return <Alert severity="error">{alert}</Alert>
              })}
            </Grid>
            :
            null
          }

          <CustomDialog
            open={openDialog}
            title="حدف IP"
            text={"آیا از حذف " + theIP.ip + " اطمینان دارید؟"}
            handleClose={handle_close_dialog}
            onAccept={onDeleteIP}
            loading={loading === "delete"}
          />
          <CustomDialog
            open={openPrefixDialog}
            title="حدف پیش‌شماره"
            text={"آیا از حذف پیش‌شماره" + theIP.prefix + " اطمینان دارید؟"}
            handleClose={() => setOpenPrefixDialog(false)}
            onAccept={onDeletePrefix}
            loading={loading === "delete-prefix"}
          />
          <CustomDialog
            open={openCPSDialog}
            title="حدف تماس در ثانیه"
            text={"آیا از حذف تعداد تماس در ثانیه اطمینان دارید؟"}
            handleClose={() => setOpenCPSDialog(false)}
            onAccept={onDeleteCPS}
            loading={loading === "delete-cps"}
          />
        </>
        :
        null
      }
    </>
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

export default connect(mapStateToProps, mapDispatchToProps)(TrunkIP);
