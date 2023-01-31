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

function EditSBC({ showSnackbar, sbc, handle_close_modals, setCommit }) {
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
  };
  const handleClose = () => {
    setOpen(false);
  };

  const checkInputs = () => {
    let temp_alerts = [];
    if (values.intip === '') {
      temp_alerts.push("لطفا IP داخلی را وارد نمایید.");
    } else if (!validateIP(values.intip)) {
      temp_alerts.push("لطفا IP داخلی را به فرمت صحیح وارد نمایید.");
    }

    setAlerts(temp_alerts);
    if (temp_alerts.length === 0) {
      editSBC();
    }
  }

  const editSBC = () => {
    setLoading(true);
    let postFormData = new FormData();
    postFormData.append('extip', values.extip);
    postFormData.append('intip', values.intip);
    postFormData.append('description', values.description);

    api.post("smt/editsbc.ms", postFormData)
      .then((response) => {
        setLoading(false);
        setCommit(response.data.dirty);
        if (response.data.status === "success") {
          showSnackbar("ویرایش کنترلگر مرزی با موفقیت انجام شد!", "success");
          setOpen(false);
          handle_close_modals();
        } else {
          showSnackbar("خطا در ویرایش کنترلگر مرزی!", "error");
        }
      })
      .catch((error) => {
        setLoading(false);
        showSnackbar("خطا در ویرایش کنترلگر مرزی!", "error");
      });
  }
  return (
    <Box>
      <Button variant="outlined" aria-label="edit" color="warning" className="icon-button"
              onClick={handleOpen}>
        <EditIcon />
      </Button>

      {open ?
        <CustomModal open={open} handleClose={handleClose} title="ویرایش کنترلگر مرزی">
          <Box py={3} px={5}>
            <Grid container spacing={2} justifyContent="center" sx={{ mt: 1, mb: 2 }}
                  className="flex-column-md">
              <Grid item md={6}>
                <TextField id="extip" label="IP خارجی" variant="outlined" fullWidth
                           value={sbc.extip} disabled />
              </Grid>

              <Grid item md={6}>
                <TextField id="intip" label="IP داخلی" variant="outlined" fullWidth
                           value={values.intip}
                           onChange={(e) => handleChange(e.target.value, "intip")}
                />
              </Grid>

              <Grid item md={12}>
                <TextField id="description" label="توضیحات" variant="outlined" fullWidth multiline
                           value={values.description}
                           onChange={(e) => handleChange(e.target.value, "description")}
                />
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
                  ویرایش کنترلگر مرزی
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

export default connect(null, mapDispatchToProps)(EditSBC);
