import { useState } from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { Edit as EditIcon } from "@mui/icons-material";
import LoadingButton from "@mui/lab/LoadingButton";
import api from "../../../helpers/api/Api";
import { Alert } from "@mui/lab";
import Box from "@mui/material/Box";
import CustomModal from "../../../components/Modal";
import Button from "@mui/material/Button";
import { validateIP } from "../../../helpers/functions/functions";
import { showSnackbar } from "../../../redux/actions";
import { connect } from "react-redux";

function EditSwitch({ showSnackbar, ssw, handle_close_modals, setCommit }) {
  const [values, setValues] = useState(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [alerts, setAlerts] = useState([]);

  const handleChange = (value, name) => {
    setValues({
      ...values,
      [name]: value,
    });
  };

  const handleOpen = () => {
    setOpen(true);
    setValues(ssw);
  };
  const handleClose = () => {
    setOpen(false);
    setValues(null);
  };

  const checkInputs = () => {
    let temp_alerts = [];
    if (values.mngip === '') {
      temp_alerts.push("لطفا IP مدیریت را وارد نمایید.");
    } else if (!validateIP(values.mngip)) {
      temp_alerts.push("لطفا IP مدیریت را به فرمت صحیح وارد نمایید.");
    }

    setAlerts(temp_alerts);
    if (temp_alerts.length === 0) {
      editSwitch();
    }
  }

  const editSwitch = () => {
    setLoading(true);
    let postFormData = new FormData();
    postFormData.append('sswip', ssw.ip);
    postFormData.append('mngip', values.mngip);
    postFormData.append('description', values.description);

    api.post("smt/editssw.ms", postFormData)
      .then((response) => {
        setLoading(false);
        setCommit(response.data.dirty);
        if (response.data.status === "success") {
          showSnackbar("ویرایش سوییچ با موفقیت انجام شد!", "success");
          setOpen(false);
          handle_close_modals();
        } else {
          showSnackbar("خطا در ویرایش سوییچ!", "error");
        }
      })
      .catch((error) => {
        setLoading(false);
        showSnackbar("خطا در ویرایش سوییچ!", "error");
      });
  }

  return (
    <Box>
      <Button variant="outlined" aria-label="edit" color="warning" className="icon-button"
              onClick={handleOpen}>
        <EditIcon />
      </Button>

      {open ?
        <CustomModal open={open} handleClose={handleClose} title="ویرایش سوییچ">
          <Box py={3} px={5}>
            <Grid container spacing={2} justifyContent="center" sx={{ mt: 1, mb: 2 }}
                  className="flex-column-md">
              <Grid item md={6}>
                <TextField id="sswip" label="IP سوییچ" variant="outlined" fullWidth
                           value={ssw.ip} disabled />
              </Grid>

              <Grid item md={6}>
                <TextField id="mngip" label="IP مدیریت" variant="outlined" fullWidth
                           value={values.mngip}
                           onChange={(e) => handleChange(e.target.value, "mngip")}/>
              </Grid>

              <Grid item md={3} className="xsDisplayNone" />
              <Grid item md={6}>
                <TextField id="description" label="توضیحات" variant="outlined" fullWidth multiline
                           value={values.description}
                           onChange={(e) => handleChange(e.target.value, "description")}
                />
              </Grid>
              <Grid item md={3} className="xsDisplayNone" />

              {alerts.length > 0 ?
                <Grid item md={12}>
                  {alerts.map((alert) => {
                    return <Alert severity="error">{alert}</Alert>
                  })}
                </Grid>
                :
                null
              }

              <Grid item md={4} mt={3}>
                <LoadingButton
                  color="warning"
                  loading={loading}
                  startIcon={<EditIcon />}
                  variant="outlined"
                  fullWidth
                  onClick={checkInputs}
                >
                  ویرایش سوییچ
                </LoadingButton>
              </Grid>
            </Grid>
          </Box>
        </CustomModal>
        :
        null
      }
    </Box>
  )
}

const mapDispatchToProps = dispatch => {
  return {
    showSnackbar: (message, severity) => dispatch(showSnackbar(message, severity))
  }
}

export default connect(null, mapDispatchToProps)(EditSwitch);
