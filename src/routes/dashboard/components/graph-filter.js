import { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import api from "../../../helpers/api/Api";

function GraphFilter({ setNewGraph }) {
  const [machines, setMachines] = useState([]);
  const times = [
    { value: "hour", name: "ساعت"},
    { value: "day", name: "روز"},
    { value: "week", name: "هفته"},
    { value: "month", name: "ماه"},
    { value: "year", name: "سال"}
  ];
  const kinds = [
    { value: "call", name: "تعداد تماس‌ها"},
    { value: "stat", name: "پردازنده"}
  ];
  const [values, setValues] = useState({
    name: null,
    time: "hour",
    kind: "call",
    timeUpdated: new Date()
  });

  useEffect(() => {
    get_machine_list();
  }, []);

  const get_machine_list = () => {
    api.get("smt/getgraphs.ms")
      .then((response) => {
        setMachines(response.data);
      })
      .catch((error) => {
      });
  }

  const handleChange = (value, name) => {
    setValues({
      ...values,
      [name]: value
    });
  };

  useEffect(() => {
    if (values.name) {
      setNewGraph(values);
    }
  }, [values]);

  return (
    <Grid container spacing={2} justifyContent="center"
          sx={{ mt: 1, mb: 1 }} className="flex-column-md">

      <Grid item md={4}>
        <FormControl fullWidth>
          <InputLabel id="name">دستگاه</InputLabel>
          <Select
            labelId="name"
            id="name-select"
            value={values.name}
            label="دستگاه"
            onChange={(e) => handleChange(e.target.value, "name")}
          >
            {machines.map((machine) => {
              return <MenuItem value={machine}>{machine.name}</MenuItem>
            })}
          </Select>
        </FormControl>
      </Grid>

      <Grid item md={4}>
        <FormControl fullWidth>
          <InputLabel id="kind">نوع</InputLabel>
          <Select
            labelId="kind"
            id="kind-select"
            value={values.kind}
            disabled={!values.name}
            label="نوع"
            onChange={(e) => handleChange(e.target.value, "kind")}
          >
            {kinds.map((kind) => {
              return <MenuItem value={kind.value}>{kind.name}</MenuItem>
            })}
          </Select>
        </FormControl>
      </Grid>

      <Grid item md={4}>
        <FormControl fullWidth>
          <InputLabel id="time">بازه زمانی</InputLabel>
          <Select
            labelId="time"
            id="time-select"
            value={values.time}
            disabled={!values.name}
            label="بازه زمانی"
            onChange={(e) => handleChange(e.target.value, "time")}
          >
            {times.map((time) => {
              return <MenuItem value={time.value}>{time.name}</MenuItem>
            })}
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
}

export default GraphFilter;
