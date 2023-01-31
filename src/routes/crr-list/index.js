import { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import api from "../../helpers/api/Api";
import DashboardLayout from "page-components/LayoutContainers/DashboardLayout";
import DataTable from "page-components/Tables/DataTable";
import LoadingProgress from "../../components/LoadingProgress";
import AppConfig from "../../helpers/constants/AppConfig";
import Button from "@mui/material/Button";
import EditCarrier from "./components/edit-crr";
import DeleteCarrier from "./components/delete-crr";
import CarrierDisabled from "./components/crr-disabled";
import { connect } from "react-redux";
import { setCommit } from "../../redux/actions";

function CarrierList({ user_permission, setCommit }) {
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    get_crr_list();

    if (user_permission === "1" || user_permission === "2") {
      setColumns([
        { Header: "IP", accessor: "ip", align: "left" },
        { Header: "وضعیت", accessor: "disabled", align: "center" },
        { Header: "توضیحات", accessor: "description", align: "center" },
        { Header: "ویرایش", accessor: "edit", align: "center", width: '10%' },
        { Header: "حذف", accessor: "delete", align: "center", width: '10%' }
      ]);
    } else if (user_permission === "3") {
      setColumns([
        { Header: "IP", accessor: "ip", align: "left" },
        { Header: "وضعیت", accessor: "disabled", align: "center" },
        { Header: "توضیحات", accessor: "description", align: "center" }
      ]);
    }
  }, []);

  const get_crr_list = () => {
    setLoading(true);

    api.post("smt/listcrr.ms", {})
      .then((response) => {
        setLoading(false);
        set_data(response.data.data);
        setCommit(response.data.dirty);
      })
      .catch((error) => {
        setLoading(false);
      });
  }

  const set_data = (data) => {
    let temp_rows = [];
    if (user_permission === "1" || user_permission === "2") {
      temp_rows = data.map((carrier) => {
        return (
          {
            ip: carrier.ip,
            disabled: (<CarrierDisabled carrier={carrier} setCommit={setCommit} />),
            description: carrier.description,
            edit: (<EditCarrier carrier={carrier} handle_close_modals={handle_close_modals} setCommit={setCommit} />),
            delete: (<DeleteCarrier carrier={carrier} handle_close_modals={handle_close_modals} setCommit={setCommit} />)
          }
        )});
    } else if (user_permission === "3") {
      temp_rows = data.map((carrier) => {
        return (
          {
            ip: carrier.ip,
            disabled: (<CarrierDisabled carrier={carrier} setCommit={setCommit} />),
            description: carrier.description
          }
        )});
    }

    setRows(temp_rows);
  }

  const handle_close_modals = () => {
    get_crr_list();
  }

  return (
    <DashboardLayout name="لیست کریرها">
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
                      لیست کریرها
                    </MDTypography>

                    {user_permission === "1" ?
                      <Button variant="outlined" color={AppConfig.color} className="table-button" href="/add-carrier">
                        کریر جدید
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

const mapDispatchToProps = dispatch => {
  return {
    setCommit: isCommit => dispatch(setCommit(isCommit))
  }
}

const mapStateToProps = state => ({
  user_permission: state.user_permission
});

export default connect(mapStateToProps, mapDispatchToProps)(CarrierList);
