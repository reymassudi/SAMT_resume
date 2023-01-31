import { useState } from "react";
import Grid from "@mui/material/Grid";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MDTypography from "../../../components/MDTypography";
import TextField from "@mui/material/TextField";
import MDBox from "../../../components/MDBox";
import Button from "@mui/material/Button";
import AppConfig from "../../../helpers/constants/AppConfig";

function SubscriberSearch({ handle_search }) {
  const [values, setValues] = useState({
    number: ''
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
      number: ''
    });
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
          <MDBox py={3} px={5} justifyContent="center">
            <Grid container spacing={2} justifyContent="center" sx={{ mt: 1, mb: 2 }} className="flex-column-md">

              <Grid item md={3} className="xsDisplayNone" />
              <Grid item md={6} sx={{ paddingLeft: '0 !important' }}>
                <TextField id="number" label="شماره" variant="outlined" fullWidth
                           value={values.number}
                           onChange={(e) => handleChange(e.target.value, "number")} />
              </Grid>
              <Grid item md={3} className="xsDisplayNone" />

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

export default SubscriberSearch;
