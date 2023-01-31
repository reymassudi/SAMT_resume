import { useState } from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { Edit as EditIcon } from "@mui/icons-material";
import LoadingButton from "@mui/lab/LoadingButton";
import api from "../../../helpers/api/Api";
import Box from "@mui/material/Box";
import CustomModal from "../../../components/Modal";
import Button from "@mui/material/Button";
import { showSnackbar } from "../../../redux/actions";
import { connect } from "react-redux";

function EditCarrier({ showSnackbar, carrier, handle_close_modals, setCommit }) {
  const [values, setValues] = useState(null);
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
    setValues(carrier);
  };
  const handleClose = () => {
    setOpen(false);
    setValues(null);
  };

  const editCarrier = () => {
    setLoading(true);
    let postFormData = new FormData();
    postFormData.append('ip', carrier.ip);
    postFormData.append('description', values.description);

    api.post("smt/editcrr.ms", postFormData)
      .then((response) => {
        setLoading(false);
        setCommit(response.data.dirty);
        if (response.data.status === "success") {
          showSnackbar("ویرایش کریر با موفقیت انجام شد!", "success");
          setOpen(false);
          handle_close_modals();
        } else {
          showSnackbar("خطا در ویرایش کریر!", "error");
        }
      })
      .catch((error) => {
        setLoading(false);
        showSnackbar("خطا در ویرایش کریر!", "error");
      });
  }

  return (
    <Box>
      <Button variant="outlined" aria-label="edit" color="warning" className="icon-button"
              onClick={handleOpen}>
        <EditIcon />
      </Button>

      {open ?
        <CustomModal open={open} handleClose={handleClose} title="ویرایش کریر">
          <Box py={3} px={5}>
            <Grid container spacing={2} justifyContent="center" sx={{ mt: 1, mb: 2 }}
                  className="flex-column-md">
              <Grid item md={6}>
                <TextField id="ip" label="IP" variant="outlined" fullWidth
                           value={carrier.ip} disabled />
              </Grid>

              <Grid item md={6}>
                <TextField id="description" label="توضیحات" variant="outlined" fullWidth multiline
                           value={values.description}
                           onChange={(e) => handleChange(e.target.value, "description")}
                />
              </Grid>

              <Grid item md={4} mt={3}>
                <LoadingButton
                  color="warning"
                  loading={loading}
                  startIcon={<EditIcon />}
                  variant="outlined"
                  fullWidth
                  onClick={editCarrier}
                >
                  ویرایش کریر
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

export default connect(null, mapDispatchToProps)(EditCarrier);
