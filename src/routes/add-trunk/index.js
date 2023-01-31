import { useState } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import api from "../../helpers/api/Api";
import DashboardLayout from "page-components/LayoutContainers/DashboardLayout";
import TextField from "@mui/material/TextField";
import { FormControl, InputAdornment, InputLabel, MenuItem, Select } from "@mui/material";
import { Add } from "@mui/icons-material";
import LoadingButton from '@mui/lab/LoadingButton';
import { Alert } from "@mui/lab";
import { validateIP, validateNumber } from "../../helpers/functions/functions";
import AppConfig from "../../helpers/constants/AppConfig";
import { setCommit, showSnackbar } from "../../redux/actions";
import { connect } from "react-redux";

function AddTrunk({ showSnackbar, setCommit }) {
  const [values, setValues] = useState({
    trname: '',
    trextip: '',
    trextport: '',
    trintip: '',
    channels: 0,
    trtype: 0,
    trssw: '',
    cps: 1,
    disabled: 0
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
    if (values.trname === '') {
      temp_alerts.push("لطفا نام ترانک را وارد نمایید.");
    }
    if (values.trextip === '') {
      temp_alerts.push("لطفا IP خارجی را وارد نمایید.");
    } else if (!validateIP(values.trextip)) {
      temp_alerts.push("لطفا IP خارجی را به فرمت صحیح وارد نمایید.");
    }

    if (values.trintip === '') {
      temp_alerts.push("لطفا IP داخلی را وارد نمایید.");
    } else if (!validateIP("172."+values.trintip)) {
      temp_alerts.push("لطفا IP داخلی را به فرمت صحیح وارد نمایید.");
    }

    if (values.trssw === '') {
      temp_alerts.push("لطفا شناسه SSW را وارد نمایید.");
    } else if (!validateNumber(values.trssw)) {
      temp_alerts.push("شناسه SSW فقط می‌تواند شامل اعداد باشد.");
    }

    setAlerts(temp_alerts);
    if (temp_alerts.length === 0) {
      addTrunk();
    }
  }

  const addTrunk = () => {
    setLoading(true);
    let postFormData = new FormData();
    postFormData.append('trname', values.trname);
    postFormData.append('trextip', values.trextip);
    postFormData.append('trextport', values.trextport);
    postFormData.append('trintip', "172."+values.trintip);
    postFormData.append('channels', values.channels);
    postFormData.append('trtype', values.trtype);
    postFormData.append('trssw', values.trssw);
    postFormData.append('cps', values.cps);
    // postFormData.append('disabled', values.disabled);

    api.post("smt/addtrunk.ms", postFormData)
      .then((response) => {
        setLoading(false);
        setCommit(response.data.dirty);
        if (response.data.status === "success") {
          showSnackbar("ترانک با موفقیت ایجاد شد!", "success");
          setTimeout(
            () => window.location.href = "/trunk-list",
            500
          );
        } else {
          showSnackbar("خطا در ایجاد ترانک!", "error");
        }
      })
      .catch((error) => {
        setLoading(false);
        showSnackbar("خطا در ایجاد ترانک!", "error");
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
              coloredShadow={AppConfig.color}
            >
              <MDTypography variant="h6" color="white">
                ایجاد ترانک جدید
              </MDTypography>
            </MDBox>

            <Card>
              <MDBox py={3} px={5} justifyContent="center">
                <Grid container spacing={2} justifyContent="center" sx={{ mt: 1, mb: 2 }}
                      className="flex-column-md">
                  <Grid item md={6}>
                    <TextField id="trname" label="نام ترانک*" variant="outlined" fullWidth
                               value={values.trname}
                               onChange={(e) => handleChange(e.target.value, "trname")} />
                  </Grid>

                  <Grid item md={6}>
                    <TextField id="trextip" label="IP خارجی*" variant="outlined" fullWidth className="ltr-textfield"
                               value={values.trextip}
                               onChange={(e) => handleChange(e.target.value, "trextip")}/>
                  </Grid>

                  <Grid item md={6}>
                    <TextField id="trextport" label="پورت" variant="outlined" fullWidth
                               value={values.trextport} helperText="پورت از پیش تعیین شده: 5060"
                               onChange={(e) => handleChange(e.target.value, "trextport")} />
                  </Grid>

                  <Grid item md={6}>
                    <TextField id="trintip" label="IP داخلی*" variant="outlined" fullWidth className="ltr-textfield adornment-ltr-textfield"
                               value={values.trintip}
                               InputProps={{ startAdornment: <InputAdornment position="start">172.</InputAdornment>}}
                               onChange={(e) => handleChange(e.target.value, "trintip")}/>
                  </Grid>

                  <Grid item md={6}>
                    <TextField id="channels" label="تعداد کانال‌ها*" variant="outlined" fullWidth
                               value={values.channels} type="number" InputProps={{ inputProps: { min: 0 } }}
                               onChange={(e) => handleChange(e.target.value, "channels")}/>
                  </Grid>

                  <Grid item md={6}>
                    <FormControl fullWidth>
                      <InputLabel id="permission">نوع</InputLabel>
                      <Select
                        labelId="permission"
                        id="permission-select"
                        value={values.trtype}
                        label="دسترسی"
                        onChange={(e) => handleChange(e.target.value, "trtype")}
                      >
                        <MenuItem value={0}>دیفالت</MenuItem>
                        <MenuItem value={1}>مخصوص</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item md={6}>
                    <TextField id="trssw" label="*شناسه SSW" variant="outlined" fullWidth
                               value={values.trssw}
                               onChange={(e) => handleChange(e.target.value, "trssw")}/>
                  </Grid>

                  <Grid item md={6}>
                    <TextField id="cps" label="تعداد تماس در ثانیه" variant="outlined" fullWidth
                               value={values.cps} type="number" InputProps={{ inputProps: { min: 1 } }}
                               onChange={(e) => handleChange(e.target.value, "cps")}/>
                  </Grid>

                  {/*<Grid item md={3} className="xsDisplayNone" />*/}
                  {/*<Grid item md={6}>*/}
                  {/*  <FormControl fullWidth>*/}
                  {/*    <InputLabel id="disabled">وضعیت</InputLabel>*/}
                  {/*    <Select*/}
                  {/*      labelId="disabled"*/}
                  {/*      id="disabled-select"*/}
                  {/*      value={values.disabled}*/}
                  {/*      label="وضعیت"*/}
                  {/*      onChange={(e) => handleChange(e.target.value, "disabled")}*/}
                  {/*    >*/}
                  {/*      <MenuItem value={0}>فعال</MenuItem>*/}
                  {/*      <MenuItem value={1}>قطع ترانک از طرف امنیت شبکه</MenuItem>*/}
                  {/*      <MenuItem value={2}>قطع ترانک از طرف مدیران داخل سازمان</MenuItem>*/}
                  {/*      <MenuItem value={3}>قطع ترانک به درخواست مشترک</MenuItem>*/}
                  {/*    </Select>*/}
                  {/*  </FormControl>*/}
                  {/*</Grid>*/}
                  {/*<Grid item md={3} className="xsDisplayNone" />*/}

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
                      ایجاد ترانک
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

export default connect(null, mapDispatchToProps)(AddTrunk);
