import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";

function CustomDialog({ open, handleClose, onAccept, title, text, loading }) {

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="dialog-title">
        {title}
      </DialogTitle>

      <Divider />

      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {text}
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} color="error" variant="contained">انصراف</Button>

        <LoadingButton
          color="success"
          loading={loading}
          variant="contained"
          onClick={onAccept}
        >
          تایید
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}

export default CustomDialog;
