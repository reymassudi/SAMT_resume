import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { FormControl, InputAdornment, InputLabel, OutlinedInput } from "@mui/material";
import { Visibility, VisibilityOff, Edit as EditIcon } from "@mui/icons-material";
import LoadingButton from "@mui/lab/LoadingButton";
import api from "../../../helpers/api/Api";
import Box from "@mui/material/Box";
import CustomModal from "../../../components/Modal";
import Button from "@mui/material/Button";
import { showSnackbar } from "../../../redux/actions";
import { connect } from "react-redux";

function EditSubscriber({ showSnackbar, subscriber, handle_close_modals, setCommit }) {
  const [values, setValues] = useState({
    password: '',
    disabled: subscriber.disabled
  });
  const [showPassword, setShowPassword] = useState(false);
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
    setValues({ password: '', disabled: 0 });
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  };

  const checkInputs = () => {
    editSubscriber();
  }

  const editSubscriber = () => {
    setLoading(true);
    let postFormData = new FormData();
    postFormData.append('number', subscriber.number);
    postFormData.append('password', values.password);

    api.post("smt/editsubscriber.ms", postFormData)
      .then((response) => {
        setLoading(false);
        setCommit(response.data.dirty);
        showSnackbar("ویرایش مشترک با موفقیت انجام شد!", "success");
        setOpen(false);
        handle_close_modals();
      })
      .catch((error) => {
        setLoading(false);
        showSnackbar("خطا در ویرایش مشترک!", "error");
      });
  }

  return (
    <Box>
      <Button variant="outlined" aria-label="edit" color="warning" className="icon-button"
              onClick={handleOpen}>
        <EditIcon />
      </Button>

      {open ?
        <CustomModal open={open} handleClose={handleClose} title="ویرایش مشترک">
          <Box py={{ md: 3, xs: 1 }} px={{ md: 5, xs: 1 }}>
            <Grid container spacing={2} justifyContent="center" sx={{ mt: 1, mb: 2 }}
                  className="flex-column-md">
              <Grid item md={6}>
                <TextField id="username" label="شماره" variant="outlined" fullWidth
                           value={subscriber.number} disabled />
              </Grid>

              <Grid item md={6}>
                <FormControl variant="outlined" fullWidth>
                  <InputLabel htmlFor="password">رمز عبور</InputLabel>
                  <OutlinedInput
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={values.password}
                    onChange={(e) => handleChange(e.target.value, "password")}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="رمز عبور"
                  />
                </FormControl>
              </Grid>

              <Grid item md={4} mt={3}>
                <LoadingButton
                  color="warning"
                  loading={loading}
                  startIcon={<EditIcon />}
                  variant="outlined"
                  fullWidth
                  onClick={checkInputs}
                >
                  ویرایش مشترک
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

export default connect(null, mapDispatchToProps)(EditSubscriber);
