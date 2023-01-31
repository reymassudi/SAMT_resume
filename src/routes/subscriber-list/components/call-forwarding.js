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
import { validateNumber } from "../../../helpers/functions/functions";
import { showSnackbar } from "../../../redux/actions";
import { connect } from "react-redux";

function CallForwarding({ showSnackbar, subscriber, handle_close_modals, setCommit }) {
  const [values, setValues] = useState({
    forwardUnconditional: subscriber.cfu && subscriber.cfu.cfu ? subscriber.cfu.cfu : "",
    forwardBusy: subscriber.cfb && subscriber.cfb.cfb ? subscriber.cfb.cfb : "",
    noResponse: subscriber.cfnr && subscriber.cfnr.cfnr ? subscriber.cfnr.cfnr : "",
    notAvailable: subscriber.cfna && subscriber.cfna.cfna ? subscriber.cfna.cfna : "",
  });
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleChange = (value, name) => {
    setValues({
      ...values,
      [name]: value,
    });
  };

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setValues({
      forwardUnconditional: "",
      forwardBusy: "",
      noResponse: "",
      notAvailable: "",
    });
  };

  const checkInputs = () => {
    let temp_alerts = [];
    if (!validateNumber(values.forwardUnconditional) || !validateNumber(values.forwardBusy)
        || !validateNumber(values.noResponse) || !validateNumber(values.notAvailable)) {
      temp_alerts.push("شماره‌های وارد شده فقط می‌توانند شامل اعداد باشند.");
    }

    setAlerts(temp_alerts);
    if (temp_alerts.length === 0) {
      editCallForwarding();
    }
  }

  const editCallForwarding = () => {
    setLoading(true);
    let postFormData = new FormData();
    postFormData.append('number', subscriber.number);
    postFormData.append('cfu', values.forwardUnconditional);
    postFormData.append('cfb', values.forwardBusy);
    postFormData.append('cfnr', values.noResponse);
    postFormData.append('cfna', values.notAvailable);

    api.post("smt/callforwarding.ms", postFormData)
      .then((response) => {
        setLoading(false);
        setCommit(response.data.dirty);
        showSnackbar("ویرایش هدایت تماس با موفقیت انجام شد!", "success");
        setOpen(false);
        handle_close_modals();
      })
      .catch((error) => {
        setLoading(false);
        showSnackbar("خطا در ویرایش هدایت تماس!", "error");
      });
  }

  return (
    <Box>
      <Button variant="outlined" aria-label="edit" color="warning" className="icon-button"
              onClick={handleOpen}>
        <EditIcon />
      </Button>

      {open ?
        <CustomModal open={open} handleClose={handleClose} title="ویرایش تماس‌های انتظار">
          <Box py={3} px={5}>
            <Grid container spacing={2} justifyContent="center" sx={{ mt: 1, mb: 2 }}>
              <Grid item md={6}>
                <TextField id="username" label="شماره" variant="outlined" fullWidth
                           value={subscriber.number} disabled />
              </Grid>

              <Grid item md={6} className="xsDisplayNone" />

              <Grid item md={6} sx={{ mt: 1 }}>
                <h5> تماس هدایت شود به: </h5>
              </Grid>

              <Grid item md={6} className="xsDisplayNone" />

              <Grid container spacing={2} justifyContent="center" sx={{ mt: 1, mb: 2 }} className="flex-column-md">
                <Grid item md={6}>
                  <TextField id="forwardUnconditional" label="در هر شرایطی" variant="outlined" fullWidth
                             value={values.forwardUnconditional} onChange={(e) => handleChange(e.target.value, 'forwardUnconditional')} />
                </Grid>

                <Grid item md={6}>
                  <TextField id="forwardBusy" label="در صورت اشغال بودن" variant="outlined" fullWidth
                             value={values.forwardBusy} onChange={(e) => handleChange(e.target.value, 'forwardBusy')} />
                </Grid>

                <Grid item md={6}>
                  <TextField id="noResponse" label="در صورت پاسخگو نبودن" variant="outlined" fullWidth
                             value={values.noResponse} onChange={(e) => handleChange(e.target.value, 'noResponse')} />
                </Grid>

                <Grid item md={6}>
                  <TextField id="notAvailable" label="در صورت در دسترس نبودن" variant="outlined" fullWidth
                             value={values.notAvailable} onChange={(e) => handleChange(e.target.value, 'notAvailable')} />
                </Grid>
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

              <Grid item md={4} mt={3}>
                <LoadingButton
                  color="warning"
                  loading={loading}
                  startIcon={<EditIcon />}
                  variant="outlined"
                  fullWidth
                  onClick={checkInputs}
                >
                  ویرایش هدایت تماس
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

export default connect(null, mapDispatchToProps)(CallForwarding);
