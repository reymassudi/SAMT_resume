import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { Edit as EditIcon, Add, ExpandCircleDown } from "@mui/icons-material";
import { Alert } from "@mui/lab";
import Box from "@mui/material/Box";
import "./trunk-numbers.css";
import CustomModal from "../../../components/Modal";
import LoadingButton from "@mui/lab/LoadingButton";
import api from "../../../helpers/api/Api";
import Divider from "@mui/material/Divider";
import { validateIP } from "../../../helpers/functions/functions";
import TrunkIP from "./trunk-ip";
import { connect } from "react-redux";
import { showSnackbar } from "../../../redux/actions";

function TrunkIPs({ trunk, dfltcpsip, user_permission, setCommit, showSnackbar }) {
  const [loading, setLoading] = useState("");
  const [theTrunk, setTheTrunk] = useState(null);
  const [open, setOpen] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [newIP, setNewIP] = useState("");

  const handleOpen = () => {
    setOpen(true);
    setTheTrunk(trunk);
  };
  const handleClose = () => {
    setOpen(false);
    setTheTrunk(null);
  };

  const handleDeleteIP = (ip) => {
    const index = theTrunk.allips.indexOf(ip);
    if (index > -1) {
      let ips = theTrunk.allips;
      ips.splice(index, 1);
      setTheTrunk({ ...theTrunk, allips: ips });
    }
  }
  const handleEditIP = (ip, newIP) => {
    const index = theTrunk.allips.indexOf(ip);
    if (index > -1) {
      let ips = theTrunk.allips;
      ips[index] = {...ips[index], ip: newIP };
      setTheTrunk({ ...theTrunk, allips: ips });
    }
  }

  const checkInputs = () => {
    let temp_alerts = [];
    if (newIP === "") {
      temp_alerts.push("لطفا IP را وارد نمایید.");
    } else if (!validateIP(newIP)) {
      temp_alerts.push("لطفا IP را به فرمت صحیح وارد نمایید.");
    }

    setAlerts(temp_alerts);
    if (temp_alerts.length === 0) {
      addTrunkIP();
    }
  }

  const addTrunkIP = () => {
    setLoading("add");
    let postFormData = new FormData();
    postFormData.append('trid', trunk.id);
    postFormData.append('trip', newIP);

    api.post("smt/addtrunkip.ms", postFormData)
      .then((response) => {
        setLoading("");
        setCommit(response.data.dirty);
        if (response.data.status === "success") {
          let ips = theTrunk.allips;
          ips.push({ "ip": newIP, prefix: null, cps: null });
          setTheTrunk({ ...theTrunk, allips: ips });
          setNewIP("");
          showSnackbar("اضافه کردن IP به ترانک با موفقیت انجام شد!", "success");
        } else {
          showSnackbar("خطا در اضافه کردن IP به ترانک!", "error");
        }
      })
      .catch((error) => {
        setLoading("");
        showSnackbar("خطا در اضافه کردن IP به ترانک!", "error");
      });
  }

  return (
    <div className="trunk-IpNumbers">
      <div className="trunk-IpNumbers">
        <div className="trunk-IpNumbers-column">
          {trunk.allips.map((ip) => {
            return (
              <div>{ip.ip}</div>
            );
          })}
        </div>

        <IconButton aria-label="edit" onClick={handleOpen}>
          {(user_permission === "1" || user_permission === "2") ?
            <EditIcon />
            :
            <>
              {trunk.allips.length > 0 ?
                <ExpandCircleDown />
                :
                null
              }
            </>
          }
        </IconButton>
      </div>

      {open ?
        <CustomModal open={open} handleClose={handleClose} width="80%"
                     title={(user_permission === "1" || user_permission === "2") ? "ویرایش IPهای ترانک" : "IPهای ترانک"}>
          <Box py={3} px={5}>
            <Grid spacing={2} justifyContent="center" sx={{ mt: 1, mb: 3 }} className="flex-column-md">

              {theTrunk.allips.map((ip) => {
                return (
                  <TrunkIP trunk={trunk} ip={ip} dfltcpsip={dfltcpsip} handleDeleteIP={handleDeleteIP} handleEditIP={handleEditIP}
                           key={ip.ip} setCommit={setCommit} setTheTrunk={setTheTrunk} theTrunk={theTrunk} />
                )
              })}

              {(user_permission === "1" || user_permission === "2") ?
                <>
                  {theTrunk.allips.length > 0 ?
                    <Divider variant="middle" />
                    :
                    null
                  }

                  <h6>اضافه کردن IP جدید</h6>

                  {alerts.length > 0 ?
                    <Grid item md={6}>
                      {alerts.map((alert) => {
                        return <Alert severity="error">{alert}</Alert>
                      })}
                    </Grid>
                    :
                    null
                  }

                  <Grid item md={6} sx={{ mt: 2 }} className="grid-flex">
                    <TextField id="new_number" label="IP جدید" variant="outlined"
                               value={newIP} fullWidth sx={{ mr: 1 }}
                               onChange={(e) => setNewIP(e.target.value)}/>

                    <LoadingButton
                      className="icon-loading-button"
                      color="success"
                      loading={loading === "add"}
                      variant="outlined"
                      onClick={checkInputs}
                    >
                      <Add />
                    </LoadingButton>
                  </Grid>
                </>
                :
                null
              }
            </Grid>

          </Box>
        </CustomModal>
        :
        null
      }
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

export default connect(mapStateToProps, mapDispatchToProps)(TrunkIPs);
