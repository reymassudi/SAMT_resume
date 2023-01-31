import { useEffect, useState } from "react";
import CustomDialog from "../../../components/Dialog";
import Switch from "@mui/material/Switch";
import api from "../../../helpers/api/Api";
import { connect } from "react-redux";
import { showSnackbar } from "../../../redux/actions";

function SwitchDisabled({ showSnackbar, ssw, user_permission, setCommit }) {
  const [loading, setLoading] = useState("");
  const [checked, setChecked] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    let disabled = true;
    if (ssw.state !== 0) {
      disabled = false;
    }
    setChecked(disabled);
  }, [ssw]);

  const onChangeSwitch = () => {
    setOpenDialog(true);
  }

  const changeDisabled = () => {
    setLoading(true);

    let disabled = 0;
    let successM = "فعال کردن سوییچ با موفقیت انجام شد!";
    let errorM = "خطا در فعال کردن سوییچ!";
    if (checked) {
      disabled = 1;
      successM = "غیرفعال کردن سوییچ با موفقیت انجام شد!";
      errorM = "خطا در غیرفعال کردن سوییچ!";
    }
    let postFormData = new FormData();
    postFormData.append('ip', ssw.ip);
    postFormData.append('state', disabled);

    setChecked(!checked);
    api.post("smt/setstatessw.ms", postFormData)
      .then((response) => {
        setLoading(false);
        setCommit(response.data.dirty);
        let res = response.data.data;
        let success = true;
        for (let i = 0; i < res.length; i++) {
          let res_i = res[i];
          for (let key of Object.keys(res_i)) {
            if (res_i[key] != "OK") {
              success = false;
              break;
            }
          }
        }
        if (success) {
          showSnackbar(successM, "success");
        } else {
          showSnackbar(errorM, "error");
        }
        handle_close_dialog();
      })
      .catch((error) => {
        setLoading(false);
        handle_close_dialog();
        showSnackbar(errorM, "error");
      });
  }

  const handle_close_dialog = () => {
    setOpenDialog(false);
  }

  return (
    <div>

      <Switch checked={checked} onChange={onChangeSwitch} disabled={!(user_permission === "1" || user_permission === "2")} />

      <CustomDialog
        open={openDialog}
        title={checked ? "غیرفعال کردن" : "فعال کردن"}
        text={checked ? "آیا از غیرفعال کردن سوییچ اطمینان دارید؟" : "آیا از فعال کردن سوییچ اطمینان دارید؟"}
        handleClose={handle_close_dialog}
        onAccept={changeDisabled}
        loading={loading}
      />
    </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(SwitchDisabled);
