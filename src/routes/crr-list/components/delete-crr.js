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

function DeleteCarrier({ showSnackbar, carrier, handle_close_modals, setCommit }) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const deleteCarrier = () => {
    setLoading(true);
    let postFormData = new FormData();
    postFormData.append('ip', carrier.ip);

    api.post("smt/delcrr.ms", postFormData)
      .then((response) => {
        setLoading(false);
        setCommit(response.data.dirty);
        if (response.data.status === "success") {
          showSnackbar("حذف کریر با موفقیت انجام شد!", "success");
          setOpen(false);
          handle_close_modals();
        } else {
          showSnackbar("خطا در حذف کریر!", "error");
        }
      })
      .catch((error) => {
        setLoading(false);
        showSnackbar("خطا در حذف کریر!", "error");
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
          حذف کریر
        </DialogTitle>

        <Divider />

        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            آیا  از تصمیم خود برای حذف کریر {carrier.ip} اطمینان دارید؟
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="error" variant="contained">انصراف</Button>
          <LoadingButton
            color="success"
            loading={loading}
            variant="contained"
            onClick={deleteCarrier}
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

export default connect(null, mapDispatchToProps)(DeleteCarrier);
