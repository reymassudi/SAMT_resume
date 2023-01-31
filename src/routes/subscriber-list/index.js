import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import api from "../../helpers/api/Api";
import DashboardLayout from "page-components/LayoutContainers/DashboardLayout";
import DataTable from "page-components/Tables/DataTable";
import { useEffect, useState } from "react";
import LoadingProgress from "../../components/LoadingProgress";
import { Pagination } from "@mui/lab";
import AppConfig from "../../helpers/constants/AppConfig";
import Button from "@mui/material/Button";
import EditSubscriber from "./components/edit-subscriber";
import DeleteSubscriber from "./components/delete-subscriber";
import CallWaiting from "./components/call-waiting";
import CallForwarding from "./components/call-forwarding";
import SubscriberDisabled from "./components/subscriber-disabled";
import ViewPassword from "./components/view-password";
import SubscriberSearch from "./components/subscriber-search";
import { connect } from "react-redux";
import { setCommit } from "../../redux/actions";

function SubscriberList({ user_permission, setCommit }) {
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(1);
  const [page, setPage] = useState(1);
  const [searchValues, setSearchValues] = useState({ number: '' });
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    get_subscriber_list();

    if (user_permission === "1" || user_permission === "2") {
      setColumns([
        { Header: "شماره", accessor: "number", align: "left" },
        { Header: "وضعیت", accessor: "disabled", align: "center" },
        { Header: "تماس‌های انتظار", accessor: "waiting", align: "center" },
        { Header: "ویرایش هدایت تماس", accessor: "forwarding", align: "center" },
        { Header: "در هر شرایطی", accessor: "cfu", align: "center" },
        { Header: "در صورت اشغال بودن", accessor: "cfb", align: "center" },
        { Header: "در صورت پاسخگو نبودن", accessor: "nr", align: "center" },
        { Header: "در صورت در دسترس نبودن", accessor: "na", align: "center" },
        { Header: "مشاهده رمز عبور", accessor: "password", align: "center" },
        { Header: "ویرایش", accessor: "edit", align: "center", width: '25%' },
        { Header: "حذف", accessor: "delete", align: "center", width: '25%' }
      ]);
    } else if (user_permission === "3") {
      setColumns([
        { Header: "شماره", accessor: "number", align: "left" },
        { Header: "وضعیت", accessor: "disabled", align: "center" },
        { Header: "تماس‌های انتظار", accessor: "waiting", align: "center" },
        { Header: "در هر شرایطی", accessor: "cfu", align: "center" },
        { Header: "در صورت اشغال بودن", accessor: "cfb", align: "center" },
        { Header: "در صورت پاسخگو نبودن", accessor: "nr", align: "center" },
        { Header: "در صورت در دسترس نبودن", accessor: "na", align: "center" },
        { Header: "مشاهده رمز عبور", accessor: "password", align: "center" }
      ]);
    }
  }, []);

  const get_subscriber_list = (listPage = page, listSearchValues = searchValues) => {
    setLoading(true);
    let postFormData = new FormData();
    postFormData.append('page', listPage);
    postFormData.append('number', listSearchValues.number);

    api.post("smt/listsubscribers.ms", postFormData)
      .then((response) => {
        setLoading(false);
        setSearchLoading(false);
        setCommit(response.data.dirty);
        set_data(response.data.data);
        setTotal(Math.ceil(response.data.total/20));
      })
      .catch((error) => {
        setLoading(false);
      });
  }

  const set_data = (data) => {
    let temp_rows = [];
    if (user_permission === "1" || user_permission === "2") {
      temp_rows = data.map((subscriber) => {
        return (
          {
            number: subscriber.number,
            disabled: (<SubscriberDisabled subscriber={subscriber} setCommit={setCommit}/>),
            waiting: (<CallWaiting subscriber={subscriber} setCommit={setCommit} />),
            forwarding: (<CallForwarding subscriber={subscriber} handle_close_modals={handle_close_modals} setCommit={setCommit}/>),
            cfu: subscriber.cfu && subscriber.cfu.cfu ? subscriber.cfu.cfu : "",
            cfb: subscriber.cfb && subscriber.cfb.cfb ? subscriber.cfb.cfb : "",
            nr: subscriber.cfnr && subscriber.cfnr.cfnr ? subscriber.cfnr.cfnr : "",
            na: subscriber.cfna && subscriber.cfna.cfna ? subscriber.cfna.cfna : "",
            password: (<ViewPassword subscriber={subscriber} />),
            edit: (<EditSubscriber subscriber={subscriber} handle_close_modals={handle_close_modals} setCommit={setCommit}/>),
            delete: (<DeleteSubscriber subscriber={subscriber} handle_close_modals={handle_close_modals} setCommit={setCommit}/>)
          }
        )});
    } else if (user_permission === "3") {
      temp_rows = data.map((subscriber) => {
        return (
          {
            number: subscriber.number,
            disabled: (<SubscriberDisabled subscriber={subscriber} setCommit={setCommit}/>),
            waiting: (<CallWaiting subscriber={subscriber} setCommit={setCommit} />),
            cfu: subscriber.cfu && subscriber.cfu.cfu ? subscriber.cfu.cfu : "",
            cfb: subscriber.cfb && subscriber.cfb.cfb ? subscriber.cfb.cfb : "",
            nr: subscriber.cfnr && subscriber.cfnr.cfnr ? subscriber.cfnr.cfnr : "",
            na: subscriber.cfna && subscriber.cfna.cfna ? subscriber.cfna.cfna : "",
            password: (<ViewPassword subscriber={subscriber} />)
          }
        )});
    }

    setRows(temp_rows);
  }

  useEffect(() => {
    get_subscriber_list();
  }, [page]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handle_close_modals = () => {
    get_subscriber_list();
  }

  const handle_search = (values) => {
    setSearchValues(values);
    setSearchLoading(true);
    get_subscriber_list(1, values);
  }

  return (
    <DashboardLayout name="لیست مشترکین">
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>

          <SubscriberSearch handle_search={handle_search} />

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
                      لیست مشترکین
                    </MDTypography>

                    {user_permission === "1" ?
                      <Button variant="outlined" color={AppConfig.color} className="table-button" href="/add-subscriber">
                        مشترک جدید
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

            {!searchLoading && total > 1 ?
              <div className="pagination-custom">
                <Pagination count={total} color={AppConfig.color} onChange={handlePageChange}
                            style={loading ? { display: 'none' } : null} />
              </div>
              :
              null
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

export default connect(mapStateToProps, mapDispatchToProps)(SubscriberList);
