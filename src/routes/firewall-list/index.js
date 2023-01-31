import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import api from "../../helpers/api/Api";
import DashboardLayout from "page-components/LayoutContainers/DashboardLayout";
import DataTable from "page-components/Tables/DataTable";
import { useEffect, useState } from "react";
import LoadingProgress from "../../components/LoadingProgress";
import AppConfig from "../../helpers/constants/AppConfig";
import Button from "@mui/material/Button";
import DeleteFirewall from "./components/delete-firewall";
import { connect } from "react-redux";

function FirewallList({ user_permission }) {
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    get_firewall_list();

    if (user_permission === "1" || user_permission === "2") {
      setColumns([
        { Header: "IP", accessor: "ip", align: "center" },
        { Header: "حذف", accessor: "delete", align: "center" }
      ]);
    } else if (user_permission === "3") {
      setColumns([
        { Header: "IP", accessor: "ip", align: "center" }
      ]);
    }
  }, []);

  const get_firewall_list = () => {
    setLoading(true);

    api.post("smt/fwlist.ms")
      .then((response) => {
        setLoading(false);
        set_data(response.data);
      })
      .catch((error) => {
        setLoading(false);
      });
  }

  const set_data = (data) => {
    let temp_rows = [];
    if (user_permission === "1" || user_permission === "2") {
      temp_rows = data.map((firewall) => {
        return (
          {
            ip: firewall.ip,
            delete: (<DeleteFirewall firewall={firewall} handle_close_modals={handle_close_modals}/>)
          }
        )});
    } else if (user_permission === "3") {
      temp_rows = data.map((firewall) => {
        return (
          {
            ip: firewall.ip
          }
        )});
    }

    setRows(temp_rows);
  }

  const handle_close_modals = () => {
    get_firewall_list();
  }

  return (
    <DashboardLayout name="لیست فایروال‌ها">
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            {loading ?
              <LoadingProgress />
              :
              <>
                <Card>
                  <MDBox
                    mx={2}
                    mt={-3}
                    py={3}
                    px={2}
                    variant="gradient"
                    bgColor={AppConfig.color}
                    borderRadius="lg"
                    className="table-with-button flex-column-md"
                  >
                    <MDTypography variant="h6" color="white">
                      لیست فایروال‌ها
                    </MDTypography>

                    {user_permission === "1" ?
                      <Button variant="outlined" color={AppConfig.color} className="table-button" href="/add-firewall">
                        فایروال جدید
                      </Button>
                      :
                      null
                    }
                  </MDBox>

                  <MDBox pt={3}>
                    <DataTable
                      table={{ columns, rows }}
                      isSorted={false}
                      showTotalEntries={false}
                      noEndBorder
                      pagination
                      entriesPerPage={{ defaultValue: AppConfig.pagination_size }}
                    />
                  </MDBox>
                </Card>
              </>
            }
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

const mapStateToProps = state => ({
  user_permission: state.user_permission
});

export default connect(mapStateToProps)(FirewallList);
