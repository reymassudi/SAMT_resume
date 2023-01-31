import { useState } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import api from "../../helpers/api/Api";
import DashboardLayout from "page-components/LayoutContainers/DashboardLayout";
import TextField from "@mui/material/TextField";
import { FormControl, InputAdornment, InputLabel, OutlinedInput } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { Visibility, VisibilityOff, Add } from "@mui/icons-material";
import LoadingButton from '@mui/lab/LoadingButton';
import { Alert } from "@mui/lab";
import Snackbar from "@mui/material/Snackbar";

function AddSubscriber() {
  const [values, setValues] = useState({
    number: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
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
    if (values.number === '') {
      temp_alerts.push("لطفا شماره مشترک را وارد نمایید.");
    }
    if (values.password === '') {
      temp_alerts.push("لطفا رمز عبور را وارد نمایید.");
    }

    setAlerts(temp_alerts);
    if (temp_alerts.length === 0) {
      addSubscriber();
    }
  }

  const addSubscriber = () => {
    setLoading(true);
    let postFormData = new FormData();
    postFormData.append('number', values.number);
    postFormData.append('password', values.password);

    api.post("smt/addsubscriber.ms", postFormData)
      .then((response) => {
        setLoading(false);
        if (response.data.status === "success") {
          showSnackbar("مشترک با موفقیت ایجاد شد!", "success");
          setTimeout(
            () => window.location.href = "/subscriber-list",
            500
          );
        } else {
          showSnackbar("خطا در ایجاد مشترک!", "error");
        }
      })
      .catch((error) => {
        setLoading(false);
        showSnackbar("خطا در ایجاد مشترک!", "error");
      });
  }

  const showSnackbar = (message, severity) => {
    setSnack({message: message, severity: severity});
    setSnackbarOpen(true);
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
                ایجاد مشترک جدید
              </MDTypography>
            </MDBox>

            <Card>
              <MDBox py={3} px={5}>
                <Grid container spacing={2} justifyContent="center" sx={{ mt: 1, mb: 2 }}
                      className="flex-column-md">
                  <Grid item md={6}>
                    <TextField id="number" label="شماره*" variant="outlined" fullWidth
                               value={values.user}
                               onChange={(e) => handleChange(e.target.value, "number")} />
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
                      ایجاد مشترک
                    </LoadingButton>
                  </Grid>
                </Grid>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>

      <Snackbar open={snackbarOpen} autoHideDuration={4000} onClose={() => setSnackbarOpen(false)}>
        <Alert severity={snack.severity} variant="filled">
          {snack.message}
        </Alert>
      </Snackbar>
    </DashboardLayout>
  );
}

export default AddSubscriber;
