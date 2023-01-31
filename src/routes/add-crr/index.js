import { useState } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import api from "../../helpers/api/Api";
import DashboardLayout from "page-components/LayoutContainers/DashboardLayout";
import TextField from "@mui/material/TextField";
import { Add } from "@mui/icons-material";
import LoadingButton from '@mui/lab/LoadingButton';
import { Alert } from "@mui/lab";
import AppConfig from "../../helpers/constants/AppConfig";
import { validateIP } from "../../helpers/functions/functions";
import { setCommit, showSnackbar } from "../../redux/actions";
import { connect } from "react-redux";

//carrier
function AddCarrier({ showSnackbar, setCommit }) {
  const [values, setValues] = useState({
    ip: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [alerts, setAlerts] = useState([]);

  const handleChange = (value, name) => {
    setValues({
      ...values,
      [name]: value,
    });
  };

  const checkInputs = () => {
    let temp_alerts = [];
    if (values.ip === '') {
      temp_alerts.push("لطفا IP را وارد نمایید.");
    } else if (!validateIP(values.ip)) {
      temp_alerts.push("لطفا IP را به فرمت صحیح وارد نمایید.");
    }

    setAlerts(temp_alerts);
    if (temp_alerts.length === 0) {
      addSBC();
    }
  }

  const addSBC = () => {
    setLoading(true);
    let postFormData = new FormData();
    postFormData.append('ip', values.ip);
    postFormData.append('description', values.description);

    api.post("smt/addcrr.ms", postFormData)
      .then((response) => {
        setLoading(false);
        setCommit(response.data.dirty);
        if (response.data.status === "success") {
          showSnackbar("کریر با موفقیت ایجاد شد!", "success");
          setTimeout(
            () => window.location.href = "/carrier-list",
            500
          );
        } else {
          showSnackbar("خطا در ایجاد کریر!", "error");
        }
      })
      .catch((error) => {
        setLoading(false);
        showSnackbar("خطا در ایجاد کریر!", "error");
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
              bgColor={AppConfig.color}
              borderRadius="lg"
            >
              <MDTypography variant="h6" color="white">
                ایجاد کریر جدید
              </MDTypography>
            </MDBox>

            <Card>
              <MDBox py={3} px={5}>
                <Grid container spacing={2} justifyContent="center" sx={{ mt: 1, mb: 2 }} className="flex-column-md">
                  <Grid item md={6}>
                    <TextField id="ip" label="IP*" variant="outlined" fullWidth
                               value={values.ip}
                               onChange={(e) => handleChange(e.target.value, "ip")} />
                  </Grid>

                  <Grid item md={6}>
                    <TextField id="description" label="توضیحات" variant="outlined" fullWidth multiline
                               value={values.description}
                               onChange={(e) => handleChange(e.target.value, "description")} />
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
                      color={AppConfig.color}
                      loading={loading}
                      startIcon={<Add />}
                      variant="outlined"
                      fullWidth
                      onClick={checkInputs}
                    >
                      ایجاد کریر
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

export default connect(null, mapDispatchToProps)(AddCarrier);
