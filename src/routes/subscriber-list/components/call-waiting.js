import { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { Edit as EditIcon, ExpandCircleDown } from "@mui/icons-material";
import LoadingButton from "@mui/lab/LoadingButton";
import api from "../../../helpers/api/Api";
import Box from "@mui/material/Box";
import CustomModal from "../../../components/Modal";
import AppConfig from "../../../helpers/constants/AppConfig";
import IconButton from "@mui/material/IconButton";
import { showSnackbar } from "../../../redux/actions";
import { connect } from "react-redux";

function CallWaiting({ showSnackbar, subscriber, user_permission, setCommit }) {
  const [values, setValues] = useState({
    channels: subscriber.waiting && subscriber.waiting.channels ? subscriber.waiting.channels : 1,
    newChannels: subscriber.waiting && subscriber.waiting.channels ? subscriber.waiting.channels : 1
  });
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleChange = (value, name) => {
    setValues({
      ...values,
      [name]: value,
    });
  };

  useEffect(() => {
    setValues({
      channels: subscriber.waiting && subscriber.waiting.channels ? subscriber.waiting.channels : 1,
      newChannels: subscriber.waiting && subscriber.waiting.channels ? subscriber.waiting.channels : 1
    });
  }, [subscriber]);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    handleChange(values.channels, 'newChannels');
  };

  const checkInputs = () => {
    editCallWaiting();
  }

  const editCallWaiting = () => {
    setLoading(true);
    let postFormData = new FormData();
    postFormData.append('number', subscriber.number);
    postFormData.append('chn', values.newChannels);

    api.post("smt/callwaiting.ms", postFormData)
      .then((response) => {
        setLoading(false);
        setCommit(response.data.dirty);
        if (response.data.status === "success") {
          handleChange(values.newChannels, 'channels');
          setOpen(false);
          showSnackbar("ویرایش تماس‌های انتظار با موفقیت انجام شد!", "success");
        } else {
          showSnackbar("خطا در ویرایش تماس‌های انتظار!", "error");
        }
      })
      .catch((error) => {
        setLoading(false);
        showSnackbar("خطا در ویرایش تماس‌های انتظار!", "error");
      });
  }

  return (
    <Box>
      <div className="trunk-IpNumbers">
        <div className="trunk-IpNumbers-column">
          {values.channels}
        </div>

        <IconButton aria-label="edit" onClick={handleOpen}>
          {(user_permission === "1" || user_permission === "2") ?
            <EditIcon />
            :
            <ExpandCircleDown />
          }
        </IconButton>
      </div>

      {open ?
        <CustomModal open={open} handleClose={handleClose} title={(user_permission === "1" || user_permission === "2") ? "ویرایش تماس‌های انتظار" : "تماس‌های انتظار"}>
          <Box py={3} px={5}>
            <Grid container spacing={2} justifyContent="center" sx={{ mt: 1, mb: 2 }}
                  className="flex-column-md">
              <Grid item md={6}>
                <TextField id="username" label="شماره" variant="outlined" fullWidth
                           value={subscriber.number} disabled />
              </Grid>

              <Grid item md={6}>
                <TextField id="channels" label="تعداد تماس‌های همزمان" variant="outlined" fullWidth type="number" InputProps={{ inputProps: { min: 1 } }}
                           value={values.newChannels} onChange={(e) => handleChange(e.target.value, 'newChannels')}
                           disabled={!(user_permission === "1" || user_permission === "2")}/>
              </Grid>

              {(user_permission === "1" || user_permission === "2") ?
                <Grid item md={4} mt={3}>
                  <LoadingButton
                    color={AppConfig.color}
                    loading={loading}
                    startIcon={<EditIcon />}
                    variant="outlined"
                    fullWidth
                    onClick={checkInputs}
                  >
                    ویرایش تماس‌های انتظار
                  </LoadingButton>
                </Grid>
                :
                null
              }
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

const mapStateToProps = state => ({
  user_permission: state.user_permission
});

export default connect(mapStateToProps, mapDispatchToProps)(CallWaiting);
