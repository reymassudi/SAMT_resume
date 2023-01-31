import { useState } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import api from "../../helpers/api/Api";
import DashboardLayout from "page-components/LayoutContainers/DashboardLayout";
import LoadingButton from '@mui/lab/LoadingButton';
import CustomDialog from "../../components/Dialog";
import { UploadFile, Check as CheckIcon } from "@mui/icons-material";
import { Chip } from "@mui/material";
import "./commit-button.css";
import ResultTable from "./components/result-table";
import { setCommit, showSnackbar } from "../../redux/actions";
import { connect } from "react-redux";

function Commit({ chip, setCommit, showSnackbar }) {
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState([]);

  const toCommitButton = () => {
    window.location.href = "/commit";
  }

  const toCommit = () => {
    setOpenDialog(true);
  }

  const commit = () => {
    setLoading(true);

    api.get("smt/allcommit.ms")
      .then((response) => {
        setLoading(false);
        setResult(response.data);
        setShowResult(true);
        setCommit(0);
        handle_close_dialog();
        showSnackbar("اجرای تغییرات با موفقیت انجام شد!", "success");
      })
      .catch((error) => {
        setLoading(false);
        handle_close_dialog();
        showSnackbar("خطا در اجرای تغییرات!", "error");
      });
  }

  const handle_close_dialog = () => {
    setOpenDialog(false);
  }

  return (
    <>
      {chip ?
        <Chip icon={<UploadFile />} label="کامیت تغییرات" color="success"
              clickable
              sx={{ direction: 'ltr' }} className="commit-button"
              onClick={toCommitButton}
        />
        :
        <DashboardLayout>
          <Card>
            <MDBox py={5} px={5}>
              <Grid container spacing={2} justifyContent="center" sx={{ mt: 1, mb: 2 }}>
                <p>
                  در صورتی که از تغییرات ایجاد شده مطمئن هستید، تغییرات را نهایی فرمایید.
                </p>

                <Grid item md={4} mt={3}>
                  <LoadingButton
                    color="error"
                    loading={loading}
                    startIcon={<CheckIcon />}
                    variant="contained"
                    fullWidth
                    onClick={toCommit}
                  >
                    اجرا
                  </LoadingButton>
                </Grid>
              </Grid>
            </MDBox>
          </Card>

          {showResult ?
            <ResultTable result={result}/>
            :
            null
          }
        </DashboardLayout>
      }

      <CustomDialog
        open={openDialog}
        title="اجرای تغییرات"
        text={"آیا از اجرای تغییرات اطمینان دارید؟"}
        handleClose={handle_close_dialog}
        onAccept={commit}
        loading={loading}
      />
    </>
  );
}

const mapDispatchToProps = dispatch => {
  return {
    setCommit: isCommit => dispatch(setCommit(isCommit)),
    showSnackbar: (message, severity) => dispatch(showSnackbar(message, severity))
  }
}

export default connect(null, mapDispatchToProps)(Commit);
