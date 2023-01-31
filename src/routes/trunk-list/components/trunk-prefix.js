import { useEffect, useState } from "react";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { Edit as EditIcon, Delete as DeleteIcon, Add } from "@mui/icons-material";
import { Alert } from "@mui/lab";
import Box from "@mui/material/Box";
import "./trunk-numbers.css";
import CustomModal from "../../../components/Modal";
import LoadingButton from "@mui/lab/LoadingButton";
import CustomDialog from "../../../components/Dialog";
import api from "../../../helpers/api/Api";
import { validateNumber } from "../../../helpers/functions/functions";
import { connect } from "react-redux";
import { showSnackbar } from "../../../redux/actions";

function TrunkPrefix({ showSnackbar, trunk, user_permission, setCommit }) {
  const [loading, setLoading] = useState("");
  const [prefix, setPrefix] = useState(trunk.prefix);
  const [newPrefix, setNewPrefix] = useState("");
  const [open, setOpen] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    setPrefix(trunk.prefix);
  }, [trunk]);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const checkInputs = () => {
    let temp_alerts = [];
    if (newPrefix === "") {
      temp_alerts.push("لطفا پیش‌شماره را وارد نمایید.");
    } else if (!validateNumber(newPrefix)) {
      temp_alerts.push("پیش‌شماره فقط می‌تواند شامل اعداد باشد.");
    }

    setAlerts(temp_alerts);
    if (temp_alerts.length === 0) {
      addTrunkPrefix();
    }
  }

  const addTrunkPrefix = () => {
    setLoading(true);
    let postFormData = new FormData();
    postFormData.append('trid', trunk.id);
    postFormData.append('trprefix', newPrefix);

    api.post("smt/addtrunkprefix.ms", postFormData)
      .then((response) => {
        setLoading(false);
        setCommit(response.data.dirty);
        if (response.data.status === "success") {
          setPrefix(newPrefix);
          setNewPrefix("");
          showSnackbar("اضافه کردن پیش‌شماره به ترانک با موفقیت انجام شد!", "success");
        } else {
          showSnackbar("خطا در اضافه کردن پیش‌شماره به ترانک!", "error");
        }
      })
      .catch((error) => {
        setLoading("");
        showSnackbar("خطا در اضافه کردن پیش‌شماره به ترانک!", "error");
      });
  }

  const toDeletePrefix = () => {
    setOpenDialog(true);
  }

  const onDeletePrefix = () => {
    setLoading(true);
    let postFormData = new FormData();
    postFormData.append('trid', trunk.id);
    postFormData.append('trprefix', prefix);

    api.post("smt/deltrunkprefix.ms", postFormData)
      .then((response) => {
        setLoading(false);
        setCommit(response.data.dirty);
        if (response.data.status === "success") {
          setPrefix(null);
          handle_close_dialog();
          showSnackbar("حذف پیش‌شماره با موفقیت انجام شد.", "success");
        } else {
          showSnackbar("خطا در حذف پیش‌شماره!", "error");
        }
      })
      .catch((error) => {
        setLoading("");
        handle_close_dialog();
        showSnackbar("خطا در حذف پیش‌شماره!", "error");
      });
  }

  const handle_close_dialog = () => {
    setOpenDialog(false);
  }

  return (
    <div>
      <div className="trunk-IpNumbers">
        <div className="trunk-IpNumbers-column">
          {prefix}
        </div>

        <IconButton aria-label="edit" onClick={handleOpen}>
          {(user_permission === "1" || user_permission === "2") ?
            <EditIcon />
            :
            null
          }
        </IconButton>
      </div>

      {open ?
        <CustomModal open={open} handleClose={handleClose} width='auto' title="ویرایش پیش‌شماره‌های ترانک">
          <Box py={3} px={5}>
            <Grid spacing={2} justifyContent="center" sx={{ mt: 1, mb: 3 }} className="flex-column-md">

              {prefix ?
                <Grid item md={12} className="grid-flex" sx={{ mb: 3 }}>
                  <TextField id={trunk.prefix} label="پیش‌شماره" variant="outlined" fullWidth
                             value={prefix} disabled sx={{ mr: 2 }}
                  />

                  <LoadingButton
                    className="icon-loading-button"
                    color="error"
                    loading={loading}
                    variant="outlined"
                    onClick={toDeletePrefix}
                  >
                    <DeleteIcon />
                  </LoadingButton>
                </Grid>
                :
                <>
                  <h6>اضافه کردن پیش‌شماره</h6>

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
                    <TextField id="new_IP" label="پیش‌شماره" variant="outlined"
                               value={newPrefix} fullWidth sx={{ mr: 2 }}
                               onChange={(e) => setNewPrefix(e.target.value)}
                    />

                    <LoadingButton
                      className="icon-loading-button"
                      color="success"
                      loading={loading}
                      variant="outlined"
                      onClick={checkInputs}
                    >
                      <Add />
                    </LoadingButton>
                  </Grid>
                </>
              }

            </Grid>

          </Box>
        </CustomModal>
        :
        null
      }

      <CustomDialog
        open={openDialog}
        title="حذف پیش‌شماره"
        text={"آیا از حذف پیش‌شماره " + prefix + " اطمینان دارید؟"}
        handleClose={handle_close_dialog}
        onAccept={onDeletePrefix}
        loading={loading}
      />
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

export default connect(mapStateToProps, mapDispatchToProps)(TrunkPrefix);
