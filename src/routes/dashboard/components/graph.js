import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Grid from "@mui/material/Grid";
import { useEffect, useRef, useState } from "react";
import IconButton from "@mui/material/IconButton";
import { Clear as ClearIcon } from "@mui/icons-material";
import "./graph.css";
import { setTokenTimer } from "../../../redux/actions";
import { connect } from "react-redux";

function Graph({ graph, index, clearGraph, setTokenTimer }) {
  const times = {
    day: "روز",
    hour: "ساعت",
    week: "هفته",
    month: "ماه",
    year: "سال"
  };
  const kinds = {
    call: "تعداد تماس‌ها",
    stat: "پردازنده"
  };
  const [timeUpdated, setTimeUpdated] = useState(new Date());
  const timeoutRef = useRef();

  useEffect(() => {
    return () => window.clearTimeout(timeoutRef.current);
  }, []);

  useEffect(() => {
    window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(
      () => {
        timeoutRef.current = null;
        setTimeUpdated(new Date());
        setTokenTimer(Date.now());
      }, 300000
    );
  }, [timeUpdated]);

  const handleClear = () => {
    clearGraph(index);
    window.clearTimeout(timeoutRef.current);
  };

  return (
    <Grid item md={8}>
      <Card>
        <MDBox padding="0.5rem">
          <MDBox py={0.5} px={1} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="d-flex">
              <span className="graph-title">{graph.name.name}</span>
              <span className="graph-description">
                {kinds[graph.kind]}
                {" "}
                ({times[graph.time]})
              </span>
            </div>

            <IconButton color="error">
              <ClearIcon sx={{ fontSize: '25px' }} onClick={handleClear} />
            </IconButton>
          </MDBox>

          <MDBox
            mt={0.5}
            sx={{ textAlign: 'center' }}
          >
            <img src={`${graph.src}?${timeUpdated}`} key={timeUpdated} alt="graph" style={{ maxWidth: '100%' }}/>
          </MDBox>

          <MDBox>
            <MDTypography variant="button" color="text" fontWeight="light" sx={{ fontSize: '12px', fontStyle: 'italic', marginLeft: '20px' }}>
              آخرین آپدیت:
              {" "}
              <span style={{ fontSize: 'smaller' }}>
                { timeUpdated.getHours()<= 9 ? '0'+timeUpdated.getHours() : timeUpdated.getHours() }
                {":"}
                { timeUpdated.getMinutes() <= 9 ? "0" + timeUpdated.getMinutes() : timeUpdated.getMinutes() }
              </span>
            </MDTypography>
          </MDBox>
        </MDBox>
      </Card>
    </Grid>
  );
}

const mapDispatchToProps = dispatch => {
  return {
    setTokenTimer: tokenTime => dispatch(setTokenTimer(tokenTime))
  }
}

export default connect(null, mapDispatchToProps)(Graph);
