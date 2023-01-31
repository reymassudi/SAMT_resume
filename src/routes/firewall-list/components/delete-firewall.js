import { useState } from "react";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import LoadingButton from "@mui/lab/LoadingButton";
import api from "../../../helpers/api/Api";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import { showSnackbar } from "../../../redux/actions";
import { connect } from "react-redux";

function DeleteFirewall({ showSnackbar, firewall, handle_close_modals }) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const deleteFirewall = () => {
    setLoading(true);
    let postFormData = new FormData();
    postFormData.append('ipaddr', firewall.ip);

    api.post("smt/fwdel.ms", postFormData)
      .then((response) => {
        setLoading(false);
        if (response.data.status === "success") {
          showSnackbar("حذف فایروال با موفقیت انجام شد!", "success");
          setOpen(false);
          handle_close_modals();
        } else {
          showSnackbar("خطا در حذف فایروال!", "error");
        }
      })
      .catch((error) => {
        setLoading(false);
        showSnackbar("خطا در حذف فایروال!", "error");
      });
  }

  return (
    <Box>
      <Button variant="outlined" aria-label="edit" color="error" className="icon-button"
              onClick={handleOpen}>
        <DeleteIcon />
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          حذف فایروال
        </DialogTitle>

        <Divider />

        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            آیا  از تصمیم خود برای حذف فایروال {firewall.ip} اطمینان دارید؟
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="error" variant="contained">انصراف</Button>
          <LoadingButton
            color="success"
            loading={loading}
            variant="contained"
            onClick={deleteFirewall}
          >
            تایید
          </LoadingButton>
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

export default connect(null, mapDispatchToProps)(DeleteFirewall);
