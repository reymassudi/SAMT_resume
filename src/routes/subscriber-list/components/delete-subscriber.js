import { useState } from "react";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import LoadingButton from "@mui/lab/LoadingButton";
import api from "../../../helpers/api/Api";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import * as React from "react";
import Box from "@mui/material/Box";
import { showSnackbar } from "../../../redux/actions";
import { connect } from "react-redux";

function DeleteSubscriber({ showSnackbar, subscriber, handle_close_modals, setCommit }) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const deleteSubscriber = () => {
    setLoading(true);
    let postFormData = new FormData();
    postFormData.append('number', subscriber.number);

    api.post("smt/delsubscriber.ms", postFormData)
      .then((response) => {
        setLoading(false);
        setCommit(response.data.dirty);
        showSnackbar("حذف مشترک با موفقیت انجام شد!", "success");
        setOpen(false);
        handle_close_modals();
      })
      .catch((error) => {
        setLoading(false);
        showSnackbar("خطا در حذف مشترک!", "error");
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
          حذف مشترک
        </DialogTitle>

        <Divider />

        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            آیا از تصمیم خود برای حذف مشترک {subscriber.number} اطمینان دارید؟
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="error" variant="contained">انصراف</Button>
          <LoadingButton
            color="success"
            loading={loading}
            variant="contained"
            onClick={deleteSubscriber}
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

export default connect(null, mapDispatchToProps)(DeleteSubscriber);
