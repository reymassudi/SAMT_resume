import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import api from "../../helpers/api/Api";
import DashboardLayout from "page-components/LayoutContainers/DashboardLayout";
import DataTable from "page-components/Tables/DataTable";
import { useEffect, useState } from "react";
import EditUser from "./components/edit-user";
import LoadingProgress from "../../components/LoadingProgress";
import DeleteUser from "./components/delete-user";
import AppConfig from "../../helpers/constants/AppConfig";
import Button from "@mui/material/Button";
import { Chip } from "@mui/material";
import { connect } from "react-redux";
import { setCommit } from "../../redux/actions";

function UserList({ user_permission, setCommit }) {
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    get_user_list();

    if (user_permission === "1" || user_permission === "2") {
      setColumns([
        { Header: "شناسه کاربری", accessor: "user", align: "left" },
        { Header: "نام", accessor: "name", align: "center" },
        { Header: "دسترسی", accessor: "permission", align: "center" },
        { Header: "ویرایش", accessor: "edit", align: "center", width: '10%' },
        { Header: "حذف", accessor: "delete", align: "center", width: '10%' }
      ]);
    } else if (user_permission === "3") {
      setColumns([
        { Header: "شناسه کاربری", accessor: "user", align: "left" },
        { Header: "نام", accessor: "name", align: "center" },
        { Header: "دسترسی", accessor: "permission", align: "center" }
      ]);
    }
  }, []);

  const get_user_list = () => {
    setLoading(true);
    api.post("smt/listuser.ms", {})
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
      temp_rows = data.map((user) => {
        return (
          {
            user: (<div className="font-weight-bold">{user.user}</div>),
            name: user.name,
            permission: return_perms(user.perms),
            edit: (<EditUser user={user} handle_close_modals={handle_close_modals} setCommit={setCommit} />),
            delete: (<DeleteUser user={user} handle_close_modals={handle_close_modals} setCommit={setCommit} />)
          }
        )});
    } else if (user_permission === "3") {
      temp_rows = data.map((user) => {
        return (
          {
            user: (<div className="font-weight-bold">{user.user}</div>),
            name: user.name,
            permission: return_perms(user.perms)
          }
        )});
    }

    setRows(temp_rows);
  }

  const return_perms = (perm) => {
    if (perm === "1") {
      return <Chip label="ادمین" color="success" size="small" />
    } else if (perm === "2") {
      return <Chip label="اپراتور" color="info" size="small" />
    }
    return <Chip label="بازدیدکننده" color="warning" size="small" />
  }

  const handle_close_modals = () => {
    get_user_list();
  }

  return (
    <DashboardLayout name="لیست کاربران">
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            {loading ?
              <LoadingProgress color="error" />
              :
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
                    لیست کاربران
                  </MDTypography>

                  {user_permission === "1" ?
                    <Button variant="outlined" color={AppConfig.color} className="table-button" href="/add-user">
                      کاربر جدید
                    </Button>
                    :
                    null
                  }
                </MDBox>

                <MDBox pt={3}>
                  <DataTable
                    table={{ columns, rows }}
                    isSorted={false}
                    noEndBorder
                    showTotalEntries={false}
                    entriesPerPage={{ defaultValue: 25 }}
                  />
                </MDBox>

              </Card>
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

export default connect(mapStateToProps, mapDispatchToProps)(UserList);
