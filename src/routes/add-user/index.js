import { useState } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import api from "../../helpers/api/Api";
import DashboardLayout from "page-components/LayoutContainers/DashboardLayout";
import TextField from "@mui/material/TextField";
import { FormControl, InputAdornment, InputLabel, OutlinedInput, MenuItem, Select } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { Visibility, VisibilityOff, Add } from "@mui/icons-material";
import LoadingButton from '@mui/lab/LoadingButton';
import { Alert } from "@mui/lab";
import { setCommit, showSnackbar } from "../../redux/actions";
import { connect } from "react-redux";

function AddUser({ showSnackbar, setCommit }) {
  const [values, setValues] = useState({
    user: '',
    name: '',
    password: '',
    permission: 1
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alerts, setAlerts] = useState([]);

  const handleChange = (value, name) => {
    setValues({
      ...values,
      [name]: value,
    });
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  };

  const checkInputs = () => {
    let temp_alerts = [];
    if (values.username === '') {
      temp_alerts.push("لطفا شناسه کاربری را وارد نمایید.");
    }
    if (values.password === '') {
      temp_alerts.push("لطفا رمز عبور را وارد نمایید.");
    }

    setAlerts(temp_alerts);
    if (temp_alerts.length === 0) {
      addUser();
    }
  }

  const addUser = () => {
    setLoading(true);
    let postFormData = new FormData();
    postFormData.append('user', values.user);
    postFormData.append('name', values.name);
    postFormData.append('perms', values.permission);
    postFormData.append('password', values.password);

    api.post("smt/adduser.ms", postFormData)
      .then((response) => {
        setLoading(false);
        setCommit(response.data.dirty);
        if (response.data.status === "success") {
          showSnackbar("کاربر با موفقیت ایجاد شد!", "success");
          setTimeout(
            () => window.location.href = "/user-list",
            500
          );
        } else {
          showSnackbar("خطا در ایجاد کاربر!", "error");
        }
      })
      .catch((error) => {
        setLoading(false);
        showSnackbar("خطا در ایجاد کاربر!", "error");
      });
  }

  return (
    <DashboardLayout>
      <MDBox pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <MDBox
              mb={3}
              py={3}
              px={2}
              variant="gradient"
              bgColor="error"
              borderRadius="lg"
              coloredShadow="error"
            >
              <MDTypography variant="h6" color="white">
                ایجاد کاربر جدید
              </MDTypography>
            </MDBox>

            <Card>
              <MDBox py={3} px={5}>
                <Grid container spacing={2} justifyContent="center" sx={{ mt: 1, mb: 2 }}
                      className="flex-column-md">
                  <Grid item md={6}>
                    <TextField id="user" label="شناسه کاربری*" variant="outlined" fullWidth
                               value={values.user}
                               onChange={(e) => handleChange(e.target.value, "user")} />
                  </Grid>

                  <Grid item md={6}>
                    <TextField id="name" label="نام و نام خانوادگی" variant="outlined" fullWidth
                               value={values.name}
                               onChange={(e) => handleChange(e.target.value, "name")}/>
                  </Grid>

                  <Grid item md={6}>
                    <FormControl fullWidth>
                      <InputLabel id="permission">دسترسی</InputLabel>
                      <Select
                        labelId="permission"
                        id="permission-select"
                        value={values.permission}
                        label="دسترسی"
                        onChange={(e) => handleChange(e.target.value, "permission")}
                      >
                        <MenuItem value={1}>ادمین</MenuItem>
                        <MenuItem value={2}>اپراتور</MenuItem>
                        <MenuItem value={3}>بازدیدکننده</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item md={6}>
                    <FormControl variant="outlined" fullWidth>
                      <InputLabel htmlFor="password">رمز عبور*</InputLabel>
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
                      color="error"
                      loading={loading}
                      startIcon={<Add />}
                      variant="outlined"
                      fullWidth
                      onClick={checkInputs}
                    >
                      ایجاد کاربر
                    </LoadingButton>
                  </Grid>
                </Grid>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

const mapDispatchToProps = dispatch => {
  return {
    setCommit: isCommit => dispatch(setCommit(isCommit)),
    showSnackbar: (message, severity) => dispatch(showSnackbar(message, severity))
  }
}

export default connect(null, mapDispatchToProps)(AddUser);
