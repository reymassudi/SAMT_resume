import axios from 'axios';
import AppConfig from '../constants/AppConfig';

let LoginInstance = axios.create({
  baseURL:  AppConfig.api_baseURL
});
LoginInstance.defaults.headers.post['Content-Type'] = 'application/x-www-form-encoded';

LoginInstance.interceptors.response
    .use((response) => {
        return response;
    },
    function (error) {
        return Promise.reject(error);
    });

export default LoginInstance;