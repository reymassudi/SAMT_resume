import PropTypes from "prop-types";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MDBox from "components/MDBox";
import {
  collapseItem,
  collapseIconBox,
  collapseText,
} from "page-components/Sidenav/styles/sidenavCollapse";
import { useMaterialUIController } from "context";
import { Collapse } from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import List from "@mui/material/List";
import { useEffect, useState } from "react";
import SidenavLink from "./SidenavLink";
import { NavLink } from "react-router-dom";

function SidenavCollapse({ icon, name, active, collapse, ...rest }) {
  const [controller] = useMaterialUIController();
  const { miniSidenav, transparentSidenav, whiteSidenav, sidenavColor } = controller;
  const [open, setOpen] = useState(active);
  const collapseName = location.pathname.replace("/", "");

  useEffect(() => {
    setOpen(active);
  }, [active]);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <>
      <ListItem component="li" onClick={handleClick}>
        <MDBox
          {...rest}
          sx={(theme) =>
            collapseItem(theme, {
              transparentSidenav,
              whiteSidenav,
              sidenavColor,
            })
          }
        >
          <ListItemIcon
            sx={(theme) =>
              collapseIconBox(theme, { transparentSidenav, whiteSidenav, active })
            }
          >
            {icon}
          </ListItemIcon>

          <ListItemText
            primary={name}
            sx={(theme) =>
              collapseText(theme, {
                miniSidenav,
                transparentSidenav,
                whiteSidenav,
                active,
              })
            }
          />

          {open ? <ExpandLess /> : <ExpandMore />}
        </MDBox>
      </ListItem>

      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {collapse.map(({ icon, name, key, color, route }) => {
            return (
              <NavLink key={key} to={route}>
                <SidenavLink
                  sidenavColor={color}
                  name={name}
                  icon={icon}
                  active={key === collapseName}
                />
              </NavLink>
            )
          })}
        </List>
      </Collapse>
    </>
  );
}

// Setting default values for the props of SidenavCollapse
SidenavCollapse.defaultProps = {
  active: false,
};

// Typechecking props for the SidenavCollapse
SidenavCollapse.propTypes = {
  icon: PropTypes.node.isRequired,
  name: PropTypes.string.isRequired,
  active: PropTypes.bool,
};

export default SidenavCollapse;
