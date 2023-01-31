import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import DashboardLayout from "page-components/LayoutContainers/DashboardLayout";
import { useState } from "react";
import GraphFilter from "./components/graph-filter";
import Graph from "./components/graph";
import Card from "@mui/material/Card";
import AppConfig from "../../helpers/constants/AppConfig";

function Dashboard() {
  const [graphs, setGraphs] = useState([]);

  const setNewGraph = (newGraph) => {
    let temp_graphs = [...graphs];
    let kind = newGraph.kind === "call" ? "" : `-${newGraph.kind}`;
    temp_graphs.push({
      ...newGraph,
      src: `${AppConfig.api_baseURL}mrtg/${newGraph.name.file}${kind}-${newGraph.time}.png`
    });
    setGraphs(temp_graphs);
  }

  const clearGraph = (index) => {
    let temp_graphs = [...graphs];
    temp_graphs.splice(index, 1);
    setGraphs(temp_graphs);
  }

  return (
    <DashboardLayout name="داشبورد">

      <MDBox py={1}>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12}>
            <Card sx={{ height: "100%", py: 4, px: 2 }}>
              <GraphFilter setNewGraph={setNewGraph} />
            </Card>
          </Grid>

          {graphs.map((graph, index) => {
            return (
              <Graph graph={graph} key={index} index={index} clearGraph={clearGraph} />
            )
          })}
        </Grid>
      </MDBox>

    </DashboardLayout>
  );
}

export default Dashboard;
