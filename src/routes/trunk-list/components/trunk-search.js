import { useState } from "react";
import Grid from "@mui/material/Grid";
import "./trunk-numbers.css";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MDTypography from "../../../components/MDTypography";
import TextField from "@mui/material/TextField";
import MDBox from "../../../components/MDBox";
import Button from "@mui/material/Button";
import AppConfig from "../../../helpers/constants/AppConfig";

function TrunkSearch({ handle_search }) {
  const [values, setValues] = useState({
    trname: '',
    trextip: '',
    trintip: '',
    trnum: ''
  });

  const handleChange = (value, name) => {
    setValues({
      ...values,
      [name]: value,
    });
  };

  const search = () => {
    handle_search(values);
  }

  const reset = () => {
    setValues({
      trname: '',
      trextip: '',
      trintip: '',
      trnum: ''
    })
  }

  return (
    <Grid item xs={12}>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <MDTypography variant="h6" color="white">
            جستجو
          </MDTypography>
        </AccordionSummary>

        <AccordionDetails>
          <MDBox pb={3} pt={0} px={5} justifyContent="center">
            <Grid container spacing={2} justifyContent="center" sx={{ mt: 1, mb: 2 }}
                  className="flex-column-md">
              <Grid item md={6}>
                <TextField id="trname" label="نام ترانک" variant="outlined" fullWidth
                           value={values.trname}
                           onChange={(e) => handleChange(e.target.value, "trname")} />
              </Grid>

              <Grid item md={6}>
                <TextField id="trextip" label="IP خارجی" variant="outlined" fullWidth className="ltr-textfield"
                           value={values.trextip}
                           onChange={(e) => handleChange(e.target.value, "trextip")}/>
              </Grid>

              <Grid item md={6}>
                <TextField id="trintip" label="IP داخلی" variant="outlined" fullWidth className="ltr-textfield"
                           value={values.trintip}
                           onChange={(e) => handleChange(e.target.value, "trintip")}/>
              </Grid>

              <Grid item md={6}>
                <TextField id="trnum" label="شماره تلفن" variant="outlined" fullWidth className="ltr-textfield"
                           value={values.trnum}
                           onChange={(e) => handleChange(e.target.value, "trnum")}/>
              </Grid>

              <Grid container spacing={2} justifyContent="center" mt={3} className="flex-column-md">
                <Grid item md={3}>
                  <Button
                    color={AppConfig.color}
                    variant="outlined"
                    fullWidth
                    onClick={search}
                  >
                    جستجو
                  </Button>
                </Grid>

                <Grid item md={3}>
                  <Button
                    color={AppConfig.color}
                    variant="outlined"
                    fullWidth
                    onClick={reset}
                  >
                    بازنشانی
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </MDBox>
        </AccordionDetails>
      </Accordion>
    </Grid>
  )
}

export default TrunkSearch;
