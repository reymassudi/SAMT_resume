import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { FormControl, InputAdornment, InputLabel, MenuItem, OutlinedInput, Select } from "@mui/material";
import { Visibility, VisibilityOff, Edit as EditIcon } from "@mui/icons-material";
import LoadingButton from "@mui/lab/LoadingButton";
import api from "../../../helpers/api/Api";
import Box from "@mui/material/Box";
import CustomModal from "../../../components/Modal";
import Button from "@mui/material/Button";
import { showSnackbar } from "../../../redux/actions";
import { connect } from "react-redux";

function EditUser({ showSnackbar, user, handle_close_modals, setCommit }) {
  const [new_user, setNewUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleChange = (value, name) => {
    setNewUser({
      ...new_user,
      [name]: value,
    });
  };

  const handleOpen = () => {
    setOpen(true);
    setNewUser(user);
  };
  const handleClose = () => {
    setOpen(false);
    setNewUser(null);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  };

  const editUser = () => {
    setLoading(true);
    let postFormData = new FormData();
    postFormData.append('uid', new_user.id);
    postFormData.append('name', new_user.name);
    postFormData.append('perms', new_user.perms);
    postFormData.append('password', new_user.password);

    api.post("smt/edituser.ms", postFormData)
      .then((response) => {
        setLoading(false);
        setOpen(false);
        setCommit(response.data.dirty);
        if (response.data.status === "success") {
          handle_close_modals();
          showSnackbar("ویرایش کاربر با موفقیت انجام شد!", "success");
        } else {
          showSnackbar("خطا در ویرایش کاربر!", "error");
        }
      })
      .catch((error) => {
        setLoading(false);
        showSnackbar("خطا در ویرایش کاربر!", "error");
      });
  }

  return (
    <Box>
      <Button variant="outlined" aria-label="edit" color="warning" className="icon-button"
              onClick={handleOpen}>
        <EditIcon />
      </Button>

      {open ?
        <CustomModal open={open} handleClose={handleClose} title="ویرایش کاربر">
          <Box py={3} px={5}>
            <Grid container spacing={2} justifyContent="center" sx={{ mt: 1, mb: 2 }}
                  className="flex-column-md">
              <Grid item md={6}>
                <TextField id="username" label="شناسه کاربری" variant="outlined" fullWidth
                           value={new_user.user} disabled />
              </Grid>

              <Grid item md={6}>
                <TextField id="name" label="نام و نام خانوادگی" variant="outlined" fullWidth
                           value={new_user.name}
                           onChange={(e) => handleChange(e.target.value, "name")}
                />
              </Grid>

              <Grid item md={6}>
                <FormControl fullWidth>
                  <InputLabel id="permission">دسترسی</InputLabel>
                  <Select
                    labelId="permission"
                    id="permission-select"
                    value={new_user.perms}
                    label="دسترسی"
                    onChange={(e) => handleChange(e.target.value, "perms")}
                  >
                    <MenuItem value={1}>ادمین</MenuItem>
                    <MenuItem value={2}>اپراتور</MenuItem>
                    <MenuItem value={3}>بازدیدکننده</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item md={6}>
                <FormControl variant="outlined" fullWidth>
                  <InputLabel htmlFor="password">رمز عبور</InputLabel>
                  <OutlinedInput
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={new_user.password}
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
                  onClick={editUser}
                >
                  ویرایش کاربر
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

export default connect(null, mapDispatchToProps)(EditUser);
