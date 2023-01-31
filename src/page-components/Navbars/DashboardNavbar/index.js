import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import { MenuOpen, Menu as MenuIcon } from "@mui/icons-material";
import {
  navbar,
  navbarContainer,
  navbarRow,
  navbarMobileMenu,
} from "page-components/Navbars/DashboardNavbar/styles";
import {
  useMaterialUIController,
  setMiniSidenav,
} from "context";
import MDTypography from "../../../components/MDTypography";
import Box from "@mui/material/Box";
import Commit from "../../../routes/commit/index";
import { connect } from "react-redux";
import CheckConnected from "./components/check-connected";

function DashboardNavbar({ absolute, light, isMini, name, show_commit, user_permission }) {
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav } = controller;

  const handleMiniSidenav = () => setMiniSidenav(dispatch, !miniSidenav);

  const iconsStyle = ({ palette: { dark, white, text }, functions: { } }) => ({
    color: () => {
      let colorValue = light ? white.main : dark.main;

      if (!light) {
        colorValue = text.main;
      }

      return colorValue;
    },
  });

  return (
    <AppBar
      position={absolute ? "absolute" : "static"}
      color="inherit"
      sx={(theme) => navbar(theme, { absolute, light })}
    >
      <Toolbar sx={(theme) => navbarContainer(theme)}>
        <Box color="inherit" mb={{ xs: 1, md: 0 }} sx={(theme) => navbarRow(theme, { isMini })}>
          <MDTypography
            fontWeight="bold"
            textTransform="capitalize"
            variant="h6"
            color={light ? "white" : "dark"}
            noWrap
          >
            {name}
          </MDTypography>
        </Box>

        {isMini ? null : (
          <Box sx={(theme) => navbarRow(theme, { isMini })}>

            <Box color={light ? "white" : "inherit"} className="navbar-mini">
              <IconButton
                size="small"
                disableRipple
                color="inherit"
                sx={navbarMobileMenu}
                onClick={handleMiniSidenav}
              >
                {miniSidenav ? <MenuOpen sx={iconsStyle} /> : <MenuIcon sx={iconsStyle} />}
              </IconButton>

              {show_commit === "1" && (user_permission === "1" || user_permission === "2") ? <Commit chip /> : null}
              <CheckConnected />
            </Box>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}

DashboardNavbar.defaultProps = {
  absolute: false,
  light: false,
  isMini: false,
};

DashboardNavbar.propTypes = {
  absolute: PropTypes.bool,
  light: PropTypes.bool,
  isMini: PropTypes.bool,
};

const mapStateToProps = state => ({
  show_commit: state.show_commit,
  user_permission: state.user_permission
});

export default connect(mapStateToProps)(DashboardNavbar);
