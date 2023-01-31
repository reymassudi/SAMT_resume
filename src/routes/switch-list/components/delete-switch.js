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

function DeleteSwitch({ showSnackbar, ssw, handle_close_modals, setCommit }) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const deleteSSW = () => {
    setLoading(true);
    let postFormData = new FormData();
    postFormData.append('sswip', ssw.ip);
    postFormData.append('mngip', ssw.mngip);

    api.post("smt/delssw.ms", postFormData)
      .then((response) => {
        setLoading(false);
        setCommit(response.data.dirty);
        if (response.data.status === "success") {
          showSnackbar("حذف سوییچ با موفقیت انجام شد!", "success");
          setOpen(false);
          handle_close_modals();
        } else {
          showSnackbar("خطا در حذف سوییچ!", "error");
        }
      })
      .catch((error) => {
        setLoading(false);
        showSnackbar("خطا در حذف سوییچ!", "error");
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
          حذف سوییچ
        </DialogTitle>

        <Divider />

        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            آیا  از تصمیم خود برای حذف سوییچ {ssw.ip} اطمینان دارید؟
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="error" variant="contained">انصراف</Button>
          <LoadingButton
            color="success"
            loading={loading}
            variant="contained"
            onClick={deleteSSW}
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

export default connect(null, mapDispatchToProps)(DeleteSwitch);
