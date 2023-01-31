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
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { showSnackbar } from "../../redux/actions";
import { connect } from "react-redux";

function DefaultParams({ showSnackbar }) {
  const [values, setValues] = useState({
    param: '',
    value: ''
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
    if (values.value === '') {
      temp_alerts.push("لطفا مقدار پارامتر را وارد نمایید.");
    }
    if (values.param === '') {
      temp_alerts.push("لطفا پارامتر مورد نظر را انتخاب نمایید.");
    }

    setAlerts(temp_alerts);
    if (temp_alerts.length === 0) {
      setParam();
    }
  }

  const setParam = () => {
    setLoading(true);
    let postFormData = new FormData();
    postFormData.append('param', values.param);
    postFormData.append('value', values.value);

    api.post("smt/setparams.ms", postFormData)
      .then((response) => {
        setLoading(false);
        if (response.data.status === "success") {
          showSnackbar("مقدار پارامتر با موفقیت تنظیم شد!", "success");
        } else {
          showSnackbar("خطا در تنظیم مقدار پارامتر!", "error");
        }
      })
      .catch((error) => {
        setLoading(false);
        showSnackbar("خطا در تنظیم مقدار پارامتر!", "error");
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
                تنظیم مقدار پیش‌فرض پارامترهای سیستم
              </MDTypography>
            </MDBox>

            <Card>
              <MDBox py={3} px={5}>
                <Grid container spacing={2} justifyContent="center" sx={{ mt: 1, mb: 2 }} className="flex-column-md">
                  <Grid item md={6}>
                    <FormControl fullWidth>
                      <InputLabel id="permission">انتخاب پارامتر</InputLabel>
                      <Select
                        labelId="param"
                        id="param-select"
                        value={values.param}
                        label="انتخاب پارامتر"
                        onChange={(e) => handleChange(e.target.value, "param")}
                      >
                        <MenuItem value={"dfltcpstrunk"}>تعداد تماس در ثانیه (ترانک)</MenuItem>
                        <MenuItem value={"dfltcpsip"}>تعداد تماس در ثانیه (IP)</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item md={6}>
                    <TextField id="value" label="مقدار پیش‌فرض" variant="outlined" fullWidth
                               value={values.value}
                               onChange={(e) => handleChange(e.target.value, "value")} />
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
                      تنظیم مقدار پارامتر
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
    showSnackbar: (message, severity) => dispatch(showSnackbar(message, severity))
  }
}

export default connect(null, mapDispatchToProps)(DefaultParams);
