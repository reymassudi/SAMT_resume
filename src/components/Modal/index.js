import { Modal } from "@mui/material";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import CloseIcon from '@mui/icons-material/Close';
import IconButton from "@mui/material/IconButton";

function CustomModal({ open, handleClose, title, children, width }) {

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: width ? width : '70%',
    p: 4,
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      className="mui-modal-custom"
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Card sx={style}>
        <div className="modal-header-custom">
          <h4>{title}</h4>

          <IconButton aria-label="close">
            <CloseIcon onClick={handleClose}/>
          </IconButton>
        </div>

        <Divider variant="middle" />
        {children}
      </Card>
    </Modal>
  );
}

export default CustomModal;
