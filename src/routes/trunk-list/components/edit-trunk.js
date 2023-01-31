import { useState } from "react";
import MDBox from "../../../components/MDBox";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { FormControl, InputAdornment, InputLabel, MenuItem, Select } from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";
import LoadingButton from "@mui/lab/LoadingButton";
import api from "../../../helpers/api/Api";
import { Alert } from "@mui/lab";
import { validateIP, validateNumber } from "../../../helpers/functions/functions";
import Box from "@mui/material/Box";
import CustomModal from "../../../components/Modal";
import Button from "@mui/material/Button";
import { showSnackbar } from "../../../redux/actions";
import { connect } from "react-redux";

function EditTrunk({ trunk, dfltcpstrunk, handle_close_modals, setCommit, showSnackbar }) {
  const [loading, setLoading] = useState(false);
  const [new_trunk, setNewTrunk] = useState(null);
  const [open, setOpen] = useState(false);
  const [alerts, setAlerts] = useState([]);

  const handleOpen = () => {
    setOpen(true);
    let int_ip = trunk.intip.substring(4, trunk.intip.length);
    setNewTrunk({
      ...trunk,
      "intip": int_ip,
    });
  };
  const handleClose = () => {
    setOpen(false);
    setNewTrunk(null);
  };

  const handleChange = (value, name) => {
    setNewTrunk({
      ...new_trunk,
      [name]: value,
    });
  };

  const checkInputs = () => {
    let temp_alerts = [];
    if (new_trunk.extip === '') {
      temp_alerts.push("لطفا IP خارجی را وارد نمایید.");
    } else if (!validateIP(new_trunk.extip)) {
      temp_alerts.push("لطفا IP خارجی را به فرمت صحیح وارد نمایید.");
    }

    if (new_trunk.intip === '') {
      temp_alerts.push("لطفا IP داخلی را وارد نمایید.");
    } else if (!validateIP("172."+new_trunk.intip)) {
      temp_alerts.push("لطفا IP داخلی را به فرمت صحیح وارد نمایید.");
    }

    if (new_trunk.ssw === '') {
      temp_alerts.push("لطفا شناسه SSW را وارد نمایید.");
    } else if (!validateNumber(new_trunk.ssw)) {
      temp_alerts.push("شناسه SSW فقط می‌تواند شامل اعداد باشد.");
    }

    setAlerts(temp_alerts);
    if (temp_alerts.length === 0) {
      editTrunk();
    }
  }

  const editTrunk = () => {
    setLoading(true);
    let postFormData = new FormData();
    postFormData.append('trid', new_trunk.id);
    postFormData.append('trextip', new_trunk.extip);
    postFormData.append('trextport', new_trunk.extport);
    postFormData.append('trintip', "172."+new_trunk.intip);
    postFormData.append('channels', new_trunk.channels);
    postFormData.append('trtype', new_trunk.type);
    postFormData.append('trssw', new_trunk.ssw);
    postFormData.append('cps', new_trunk.cps ? new_trunk.cps : "");
    postFormData.append('disabled', new_trunk.disabled);

    api.post("smt/edittrunk.ms", postFormData)
      .then((response) => {
        setLoading(false);
        setCommit(response.data.dirty);
        showSnackbar("ویرایش ترانک با موفقیت انجام شد!", "success");
        setOpen(false);
        handle_close_modals();
      })
      .catch((error) => {
        setLoading(false);
        showSnackbar("خطا در ویرایش ترانک!", "error");
      });
  }

  return (
    <MDBox lineHeight={1} textAlign="left">
      <Button variant="outlined" aria-label="edit" color="warning" className="icon-button"
              onClick={handleOpen}>
        <EditIcon />
      </Button>

      {open ?
        <CustomModal open={open} handleClose={handleClose} title="ویرایش ترانک">
          <Box py={3} px={5}>
            <Grid container spacing={2} justifyContent="center" sx={{ mt: 1, mb: 2 }}
                  className="flex-column-md">

              <Grid item md={6}>
                <TextField id="name" label="نام" variant="outlined" fullWidth
                           value={new_trunk.name} disabled />
              </Grid>

              <Grid item md={6}>
                <TextField id="trextip" label="IP خارجی*" variant="outlined" fullWidth className="ltr-textfield"
                           value={new_trunk.extip}
                           onChange={(e) => handleChange(e.target.value, "extip")}/>
              </Grid>

              <Grid item md={6}>
                <TextField id="trextport" label="پورت" variant="outlined" fullWidth
                           value={new_trunk.extport} helperText="پورت از پیش تعیین شده: 5060"
                           onChange={(e) => handleChange(e.target.value, "extport")} />
              </Grid>

              <Grid item md={6}>
                <TextField id="trintip" label="IP داخلی*" variant="outlined" fullWidth className="ltr-textfield adornment-ltr-textfield"
                           value={new_trunk.intip}
                           InputProps={{ startAdornment: <InputAdornment position="start">172.</InputAdornment>}}
                           onChange={(e) => handleChange(e.target.value, "intip")}/>
              </Grid>

              <Grid item md={6}>
                <TextField id="channels" label="تعداد کانال‌ها*" variant="outlined" fullWidth
                           value={new_trunk.channels} type="number" InputProps={{ inputProps: { min: 0 } }}
                           onChange={(e) => handleChange(e.target.value, "channels")}/>
              </Grid>

              <Grid item md={6}>
                <FormControl fullWidth>
                  <InputLabel id="permission">نوع</InputLabel>
                  <Select
                    labelId="permission"
                    id="permission-select"
                    value={new_trunk.type}
                    label="دسترسی"
                    onChange={(e) => handleChange(e.target.value, "type")}
                  >
                    <MenuItem value={0}>دیفالت</MenuItem>
                    <MenuItem value={1}>مخصوص</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item md={6}>
                <TextField id="trssw" label="*شناسه SSW" variant="outlined" fullWidth
                           value={new_trunk.ssw}
                           onChange={(e) => handleChange(e.target.value, "ssw")}/>
              </Grid>

              <Grid item md={6}>
                <TextField id="cps" label="تعداد تماس در ثانیه" variant="outlined" fullWidth
                           value={(new_trunk.cps ? new_trunk.cps : dfltcpstrunk)} type="number" InputProps={{ inputProps: { min: 1 } }}
                           onChange={(e) => handleChange(e.target.value, "cps")}/>
              </Grid>

              <Grid item md={3} className="xsDisplayNone" />
              <Grid item md={6}>
                <FormControl fullWidth>
                  <InputLabel id="disabled">وضعیت</InputLabel>
                  <Select
                    labelId="disabled"
                    id="disabled-select"
                    value={new_trunk.disabled}
                    label="وضعیت"
                    onChange={(e) => handleChange(e.target.value, "disabled")}
                  >
                    <MenuItem value={0}>فعال</MenuItem>
                    <MenuItem value={1}>قطع ترانک از طرف امنیت شبکه</MenuItem>
                    <MenuItem value={2}>قطع ترانک از طرف مدیران داخل سازمان</MenuItem>
                    <MenuItem value={3}>قطع ترانک به درخواست مشترک</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item md={3} className="xsDisplayNone" />

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
                  ویرایش ترانک
                </LoadingButton>
              </Grid>
            </Grid>

          </Box>
        </CustomModal>
        :
        null
      }
    </MDBox>
  )
}

const mapDispatchToProps = dispatch => {
  return {
    showSnackbar: (message, severity) => dispatch(showSnackbar(message, severity))
  }
}

export default connect(null, mapDispatchToProps)(EditTrunk);
