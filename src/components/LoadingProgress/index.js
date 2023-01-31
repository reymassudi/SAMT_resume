import { CircularProgress } from "@mui/material";
import AppConfig from "../../helpers/constants/AppConfig";

function LoadingProgress({ color }) {
  return (
    <div className="loading">
      <CircularProgress color={AppConfig.color} />
    </div>
  );
}

export default LoadingProgress;
