import { useState, useEffect, useMemo } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Sidenav from "page-components/Sidenav";
import themeRTL from "assets/theme/theme-rtl";
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import routes from "routes";
import { useMaterialUIController, setMiniSidenav } from "context";
import brandWhite from "assets/images/logo-ct.png";
import brandDark from "assets/images/logo-ct-dark.png";
import SignIn from "./routes/authentication/sign-in";
import { connect } from "react-redux";
import UserList from "./routes/user-list";
import AppConfig from "./helpers/constants/AppConfig";

function App({ user_permission, tokenTimer }) {
  const [controller, dispatch] = useMaterialUIController();
  const {
    miniSidenav,
    direction,
    layout,
    sidenavColor,
    transparentSidenav,
    whiteSidenav,
  } = controller;

  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const [rtlCache, setRtlCache] = useState(null);
  const { pathname } = useLocation();
  const timeoutTime = AppConfig.token_expire;

  useEffect(() => {
    if (tokenTimer + timeoutTime < Date.now()) {
      localStorage.clear();
      window.location.href = "/sign-in";
    }
  }, []);

  useMemo(() => {
    const cacheRtl = createCache({
      key: "rtl",
      stylisPlugins: [rtlPlugin],
    });

    setRtlCache(cacheRtl);
  }, []);

  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }

      if (route.route && route.perms.includes(user_permission)) {
        return <Route exact path={route.route} element={route.component} key={route.key} />;
      }

      return null;
    });

  return tokenTimer ? (
    <CacheProvider value={rtlCache}>
      <ThemeProvider theme={themeRTL}>
        <CssBaseline />

        {layout === "dashboard" && (
          <>
            <Sidenav
              color={sidenavColor}
              brand={(transparentSidenav) || whiteSidenav ? brandDark : brandWhite}
              brandName="سمـــت"
              routes={routes}
              onMouseEnter={handleOnMouseEnter}
              onMouseLeave={handleOnMouseLeave}
            />
          </>
        )}

        <Routes>
          {getRoutes(routes)}
          <Route exact path="/user-list" element={<UserList />} key="user-list" />
          <Route exact path="/sign-in" element={<SignIn />} key="sign-in" />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>

      </ThemeProvider>
    </CacheProvider>
  ) : (
    <CacheProvider value={rtlCache}>
      <ThemeProvider theme={themeRTL}>
        <CssBaseline />

        <Routes>
          <Route exact path="/sign-in" element={<SignIn />} key="sign-in" />;
          <Route path="*" element={<Navigate to="/sign-in" />} />
        </Routes>
      </ThemeProvider>
    </CacheProvider>
  )
}

const mapStateToProps = state => ({
  user_permission: state.user_permission,
  tokenTimer: state.tokenTimer
});

export default connect(mapStateToProps)(App);