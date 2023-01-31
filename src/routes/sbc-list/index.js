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
import EditSBC from "./components/edit-sbc";
import DeleteSBC from "./components/delete-sbc";
import SBCDisabled from "./components/sbc-disabled";
import { connect } from "react-redux";
import { setCommit } from "../../redux/actions";

//session-border-controller
function SBCList({ user_permission, setCommit }) {
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    get_sbc_list();

    if (user_permission === "1" || user_permission === "2") {
      setColumns([
        { Header: "IP خارجی", accessor: "extip", align: "left" },
        { Header: "IP داخلی", accessor: "intip", align: "center" },
        { Header: "وضعیت", accessor: "disabled", align: "center" },
        { Header: "توضیحات", accessor: "description", align: "center" },
        { Header: "ویرایش", accessor: "edit", align: "center", width: '10%' },
        { Header: "حذف", accessor: "delete", align: "center", width: '10%' }
      ]);
    } else if (user_permission === "3") {
      setColumns([
        { Header: "IP خارجی", accessor: "extip", align: "left" },
        { Header: "IP داخلی", accessor: "intip", align: "center" },
        { Header: "وضعیت", accessor: "disabled", align: "center" },
        { Header: "توضیحات", accessor: "description", align: "center" }
      ]);
    }
  }, []);

  const get_sbc_list = () => {
    setLoading(true);

    api.post("smt/listsbc.ms", {})
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
      temp_rows = data.map((sbc) => {
        return (
          {
            extip: sbc.extip,
            intip: sbc.intip,
            disabled: (<SBCDisabled sbc={sbc} setCommit={setCommit} />),
            description: sbc.description,
            edit: (<EditSBC sbc={sbc} handle_close_modals={handle_close_modals} setCommit={setCommit} />),
            delete: (<DeleteSBC sbc={sbc} handle_close_modals={handle_close_modals} setCommit={setCommit} />)
          }
        )});
    } else if (user_permission === "3") {
      temp_rows = data.map((sbc) => {
        return (
          {
            extip: sbc.extip,
            intip: sbc.intip,
            disabled: (<SBCDisabled sbc={sbc} setCommit={setCommit} />),
            description: sbc.description
          }
        )});
    }

    setRows(temp_rows);
  }

  const handle_close_modals = () => {
    get_sbc_list();
  }

  return (
    <DashboardLayout name="لیست کنترلگرهای مرزی">
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
                      لیست کنترلگرهای مرزی
                    </MDTypography>

                    {user_permission === "1" ?
                      <Button variant="outlined" color={AppConfig.color} className="table-button" href="/add-sbc">
                        کنترلگر مرزی جدید
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

export default connect(mapStateToProps, mapDispatchToProps)(SBCList);
