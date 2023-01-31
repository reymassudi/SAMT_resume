import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import MDBox from "components/MDBox";
import { useMaterialUIController, setLayout } from "context";
import DashboardNavbar from "../../Navbars/DashboardNavbar";
import * as React from "react";
import { Alert } from "@mui/lab";
import Snackbar from "@mui/material/Snackbar";
import { connect } from "react-redux";
import { hideSnackbar } from "../../../redux/actions";
import AppConfig from "../../../helpers/constants/AppConfig";

function DashboardLayout({ children, name, snackbar, tokenTimer, hideSnackbar }) {
  const [snackbarOpen, setSnackbarOpen] = useState(snackbar.open);
  const [snack, setSnack] = useState(snackbar);
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav } = controller;
  const { pathname } = useLocation();
  const timeoutRef = useRef();
  const timeoutTime = AppConfig.token_expire;

  useEffect(() => {
    return () => window.clearTimeout(timeoutRef.current);
  }, []);

  useEffect(() => {
    setLogOutTimer();
  }, [tokenTimer]);

  const setLogOutTimer = () => {
    window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(
      () => {
        if (tokenTimer + timeoutTime < Date.now()) {
          localStorage.clear();
          window.location.href = "/sign-in";
        } else {
          setLogOutTimer();
        }
      }, timeoutTime
    );
  }

  useEffect(() => {
    setLayout(dispatch, "dashboard");
  }, [pathname]);

  useEffect(() => {
    if (snackbar.open) {
      showSnackbar();
    } else {
      closeSnackbar();
    }
  }, [snackbar]);

  const showSnackbar = () => {
    setSnack({message: snackbar.message, severity: snackbar.severity});
    setSnackbarOpen(true);
  }
  const closeSnackbar = () => {
    setSnackbarOpen(false);
  }

  return (
    <MDBox
      sx={({ breakpoints, transitions, functions: { pxToRem } }) => ({
        p: 3,
        position: "relative",

        [breakpoints.up("xl")]: {
          marginLeft: miniSidenav ? pxToRem(120) : pxToRem(274),
          transition: transitions.create(["margin-left", "margin-right"], {
            easing: transitions.easing.easeInOut,
            duration: transitions.duration.standard,
          }),
        },
      })}
    >
      <DashboardNavbar name={name} />
      {children}

      <Snackbar open={snackbarOpen} autoHideDuration={4000} onClose={() => hideSnackbar()}>
        <Alert severity={snack.severity} variant="filled">
          {snack.message}
        </Alert>
      </Snackbar>
    </MDBox>
  );
}

const mapDispatchToProps = dispatch => {
  return {
    hideSnackbar: () => dispatch(hideSnackbar())
  }
}

const mapStateToProps = state => ({
  snackbar: state.snackbar,
  tokenTimer: state.tokenTimer
});

export default connect(mapStateToProps, mapDispatchToProps)(DashboardLayout);
