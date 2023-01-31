import { useRef, useState } from "react";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import BasicLayout from "routes/authentication/components/BasicLayout";
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import api from "../../../helpers/api/LoginApi";
import { Alert } from "@mui/lab";
import Snackbar from "@mui/material/Snackbar";
import * as React from "react";
import { FormControl, InputAdornment, InputLabel, OutlinedInput } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import LoadingButton from "@mui/lab/LoadingButton";
import { setUserPermission } from "../../../redux/actions";
import { connect } from "react-redux";

function SignIn({ setUserPermission }) {
  const [values, setValues] = useState({
    user: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const inputRef = useRef(null);

  const [alerts, setAlerts] = useState([]);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snack, setSnack] = useState({message: '', severity: ''});

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
    if (values.user === '') {
      temp_alerts.push("لطفا شناسه کاربری را وارد نمایید.");
    }

    setAlerts(temp_alerts);
    if (temp_alerts.length === 0) {
      login();
    }
  }

  const login = () => {
    setLoading(true);
    let postFormData = new FormData();
    postFormData.append('user', values.user);
    postFormData.append('password', values.password);

    api.post("smt/login.ms", postFormData)
      .then((response) => {
        setLoading(false);
        if (response.data) {
          if (response.data.status === "success") {
            localStorage.setItem("token", Date.now());
            localStorage.setItem("perms", response.data.perms);
            setUserPermission(response.data.perms);
            window.location.href = "/";
          } else if (response.data.status === "user not found") {
            showSnackbar("شناسه کاربری یا رمز عبور غلط می‌باشد!", "error");
          }
        }
      })
      .catch((error) => {
        setLoading(false);
        showSnackbar("خطا در ورود به حساب کاربری!", "error");
      });
  }

  const showSnackbar = (message, severity) => {
    setSnack({message: message, severity: severity});
    setSnackbarOpen(true);
  }

  return (
    <BasicLayout image={bgImage} isAuth>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="error"
          borderRadius="lg"
          coloredShadow="error"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            ورود
          </MDTypography>
        </MDBox>

        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form">
            <MDBox mb={2}>
              <TextField id="user" label="شناسه کاربری" variant="outlined" fullWidth
                         value={values.user} autoFocus
                         onKeyPress={(e) => e.key === 'Enter' && inputRef.current.focus()}
                         onChange={(e) => handleChange(e.target.value, "user")} />
            </MDBox>

            <MDBox mb={2}>
              <FormControl variant="outlined" fullWidth>
                <InputLabel htmlFor="password">رمز عبور</InputLabel>
                <OutlinedInput
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  inputRef={inputRef}
                  value={values.password}
                  onChange={(e) => handleChange(e.target.value, "password")}
                  onKeyPress={(e) => e.key === 'Enter' && checkInputs()}
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
            </MDBox>

            {alerts.length > 0 ?
              <Grid item md={12}>
                {alerts.map((alert) => {
                  return <Alert severity="error">{alert}</Alert>
                })}
              </Grid>
              :
              null
            }

            <MDBox mt={4} mb={1}>
              <LoadingButton
                id="sign-in-button"
                color="error"
                loading={loading}
                variant="contained"
                fullWidth
                onClick={checkInputs}
              >
                ورود
              </LoadingButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>

      <Snackbar open={snackbarOpen} autoHideDuration={4000} onClose={() => setSnackbarOpen(false)}>
        <Alert severity={snack.severity} variant="filled">
          {snack.message}
        </Alert>
      </Snackbar>
    </BasicLayout>
  );
}

const mapDispatchToProps = dispatch => {
  return {
    setUserPermission: permission => dispatch(setUserPermission(permission))
  }
}

export default connect(null, mapDispatchToProps)(SignIn);
