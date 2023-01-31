import { useState } from "react";
import { CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { Visibility } from "@mui/icons-material";
import api from "../../../helpers/api/Api";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import AppConfig from "../../../helpers/constants/AppConfig";
import { showSnackbar } from "../../../redux/actions";
import { connect } from "react-redux";

function ViewPassword({ showSnackbar, subscriber }) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState(null);

  const handleOpen = () => {
    setOpen(true);
    getSubscriberPassword();
  };
  const handleClose = () => {
    setOpen(false);
    setPassword(null);
  };

  const getSubscriberPassword = () => {
    setLoading(true);
    let postFormData = new FormData();
    postFormData.append('number', subscriber.number);

    api.post("smt/listsubscribers.ms", postFormData)
      .then((response) => {
        setLoading(false);
        setPassword(response.data.data && response.data.data[0].password);
      })
      .catch((error) => {
        setLoading(false);
        showSnackbar("خطا در دریافت رمز عبور!", "error");
      });
  }
  return (
    <Box className="subscriber-password">
      <IconButton aria-label="edit" onClick={handleOpen}>
        <Visibility />
      </IconButton>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          رمز عبور کاربر
        </DialogTitle>

        <Divider />

        <DialogContent style={ { minWidth: '300px' }}>
          <DialogContentText id="alert-dialog-description" style={{ textAlign: 'center' }}>
            {loading ?
              <CircularProgress color={AppConfig.color} />
              :
              <p style={{ textAlign: 'center' }}>{password}</p>
            }
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="error" variant="contained">بستن</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

const mapDispatchToProps = dispatch => {
  return {
    showSnackbar: (message, severity) => dispatch(showSnackbar(message, severity))
  }
}

export default connect(null, mapDispatchToProps)(ViewPassword);
