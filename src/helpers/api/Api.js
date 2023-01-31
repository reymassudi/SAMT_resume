import axios from 'axios';
import AppConfig from '../constants/AppConfig';
import store from "../../redux/store";

let instance = axios.create({
  baseURL:  AppConfig.api_baseURL
});
instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-encoded';

instance.interceptors.response
    .use((response) => {
        if (response.data.status === "expired" || response.data.status === "not logged in") {
          localStorage.clear();
          window.location.href = "/sign-in";
        }
        let tokenTime = Date.now();
        localStorage.setItem("token", tokenTime);
        store.dispatch({
          type: "SET_TOKEN_TIMER",
          payload: tokenTime
        });
        return response;
    },
    function (error) {
      store.dispatch({
        type: "SHOW_SNACKBAR",
        payload: { message: "خطا در برقراری ارتباط", severity: "error", open: true }
      });
      return Promise.reject(error);
    });

export default instance;