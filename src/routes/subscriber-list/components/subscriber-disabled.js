import { useEffect, useState } from "react";
import CustomDialog from "../../../components/Dialog";
import Switch from "@mui/material/Switch";
import * as React from "react";
import api from "../../../helpers/api/Api";
import { connect } from "react-redux";
import { showSnackbar } from "../../../redux/actions";

function SubscriberDisabled({ showSnackbar, subscriber, user_permission, setCommit }) {
  const [loading, setLoading] = useState("");
  const [checked, setChecked] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    let disabled = true;
    if (subscriber.disabled != "0") {
      disabled = false;
    }
    setChecked(disabled);
  }, [subscriber]);

  const onChangeSwitch = () => {
    setOpenDialog(true);
  }

  const changeDisabled = () => {
    setLoading(true);

    let disabled = "0";
    let successM = "فعال کردن مشترک با موفقیت انجام شد!";
    let errorM = "خطا در فعال کردن مشترک!";
    if (checked) {
      disabled = "1";
      successM = "غیرفعال کردن مشترک با موفقیت انجام شد!";
      errorM = "خطا در غیرفعال کردن مشترک!";
    }

    let postFormData = new FormData();
    postFormData.append('number', subscriber.number);
    postFormData.append('disabled', disabled);

    api.post("smt/editsubscriber.ms", postFormData)
      .then((response) => {
        setLoading(false);
        setCommit(response.data.dirty);
        if (response.data.status === "disabled 1 updated" || response.data.status === "disabled 0 updated") {
          setChecked(!checked);
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
        text={checked ? "آیا از غیرفعال کردن مشترک اطمینان دارید؟" : "آیا از فعال کردن مشترک اطمینان دارید؟"}
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

export default connect(mapStateToProps, mapDispatchToProps)(SubscriberDisabled);
