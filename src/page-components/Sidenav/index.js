import { useEffect } from "react";
import { useLocation, NavLink } from "react-router-dom";
import PropTypes from "prop-types";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import SidenavCollapse from "page-components/Sidenav/SidenavCollapse";
import SidenavRoot from "page-components/Sidenav/SidenavRoot";
import sidenavLogoLabel from "page-components/Sidenav/styles/sidenav";
import {
  useMaterialUIController,
  setMiniSidenav,
  setTransparentSidenav,
  setWhiteSidenav,
} from "context";
import { Logout } from "@mui/icons-material";
import SidenavLink from "./SidenavLink";
import BroadcastOnPersonalIcon from '@mui/icons-material/BroadcastOnPersonal';
import api from "../../helpers/api/Api";
import IconButton from "@mui/material/IconButton";
import { connect } from "react-redux";
import CloseIcon from '@mui/icons-material/Close';
import * as React from "react";

function Sidenav({ color, brand, brandName, routes, user_permission, ...rest }) {
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, transparentSidenav, whiteSidenav } = controller;
  const location = useLocation();
  const collapseName = location.pathname.replace("/", "");

  let textColor = "white";

  if (transparentSidenav || whiteSidenav) {
    textColor = "dark";
  }

  const closeSidenav = () => setMiniSidenav(dispatch, true);

  useEffect(() => {
    function handleMiniSidenav() {
      setMiniSidenav(dispatch, window.innerWidth < 1200);
      setTransparentSidenav(dispatch, window.innerWidth < 1200 ? false : transparentSidenav);
      setWhiteSidenav(dispatch, window.innerWidth < 1200 ? false : whiteSidenav);
    }

    window.addEventListener("resize", handleMiniSidenav);

    handleMiniSidenav();

    return () => window.removeEventListener("resize", handleMiniSidenav);
  }, [dispatch, location]);

  const logout = () => {
    api.post("smt/logout.ms", { })
      .then((response) => {
        if (response.data && response.data.status === "success") {
          localStorage.removeItem("logged-in");
          window.location.href = "/sign-in";
        }
      })
      .catch((error) => {
      });
  }

  const renderRoutes = routes.map(({ type, name, icon, color, collapse, key, href, route, perms }) => {
    let returnValue;

    if (perms.includes(user_permission)) {
      if (type === "collapse") {
        returnValue = href ? (
          <Link
            href={href}
            key={key}
            target="_blank"
            rel="noreferrer"
            sx={{ textDecoration: "none" }}
          >
            <SidenavLink
              sidenavColor={color}
              name={name}
              icon={icon}
              active={key === collapseName}
              collapse={collapse}
            />
          </Link>
        ) : (
          <NavLink key={key} to={route}>
            <SidenavLink
              sidenavColor={color}
              name={name}
              icon={icon}
              active={key === collapseName}
              collapse={collapse}
            />
          </NavLink>
        );
      } else if (type === "title") {
        returnValue = (
          <MDTypography
            key={key}
            color={textColor}
            display="block"
            variant="caption"
            fontWeight="bold"
          >
            <SidenavCollapse
              name={name}
              icon={icon}
              active={key.includes(collapseName)}
              collapse={collapse}
            />
          </MDTypography>
        );
      } else if (type === "divider") {
        returnValue = (
          <Divider
            key={key}
            light={!whiteSidenav && !transparentSidenav}
          />
        );
      }
    }

    return returnValue;
  });

  return (
    <SidenavRoot
      {...rest}
      variant="permanent"
      ownerState={{ transparentSidenav, whiteSidenav, miniSidenav }}
    >
      <MDBox pt={3} pb={1} px={4} textAlign="center">
        <MDBox
          display={{ xs: "block", xl: "none" }}
          position="absolute"
          top={0}
          right={0}
          p={1.625}
          onClick={closeSidenav}
          sx={{ cursor: "pointer" }}
        >
          <MDTypography variant="h6" color="secondary">
            <CloseIcon />
          </MDTypography>
        </MDBox>

        <MDBox component={NavLink} to="/" className="sidenavbar">

          <div className="site-name">
            <BroadcastOnPersonalIcon sx={{ fontSize: 40, color: 'white' }} />

            <MDBox
              width={!brandName && "100%"}
              sx={(theme) => sidenavLogoLabel(theme, { miniSidenav })}
            >
              <MDTypography component="h6" variant="button" fontWeight="medium" color={textColor}>
                {brandName}
              </MDTypography>
            </MDBox>
          </div>

          <IconButton onClick={logout}>
            <Logout sx={{ fontSize: 20, transform: 'rotate(180deg)' }} />
          </IconButton>
        </MDBox>
      </MDBox>
      <Divider
        light={!whiteSidenav && !transparentSidenav}
      />
      <List>
        {renderRoutes}
      </List>
    </SidenavRoot>
  );
}

// Setting default values for the props of Sidenav
Sidenav.defaultProps = {
  color: "info",
  brand: "",
};

// Typechecking props for the Sidenav
Sidenav.propTypes = {
  color: PropTypes.oneOf(["primary", "secondary", "info", "success", "warning", "error", "dark"]),
  brand: PropTypes.string,
  brandName: PropTypes.string.isRequired,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};


const mapStateToProps = state => ({
  user_permission: state.user_permission
});

export default connect(mapStateToProps)(Sidenav);
