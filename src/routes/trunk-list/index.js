import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import api from "../../helpers/api/Api";
import DashboardLayout from "page-components/LayoutContainers/DashboardLayout";
import DataTable from "page-components/Tables/DataTable";
import { useEffect, useState } from "react";
import EditTrunk from "./components/edit-trunk";
import LoadingProgress from "../../components/LoadingProgress";
import DeleteTrunk from "./components/delete-trunk";
import TrunkNumber from "./components/trunk-number";
import TrunkIPs from "./components/trunk-ips";
import { Pagination } from "@mui/lab";
import { CheckCircle, RemoveCircle } from '@mui/icons-material';
import TrunkPrefix from "./components/trunk-prefix";
import Button from "@mui/material/Button";
import TrunkSearch from "./components/trunk-search";
import AppConfig from "../../helpers/constants/AppConfig";
import { setCommit } from "../../redux/actions";
import { connect } from "react-redux";

function TrunkList({ setCommit, user_permission }) {
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(1);
  const [page, setPage] = useState(1);
  const [searchValues, setSearchValues] = useState({
    trname: '',
    trextip: '',
    trintip: '',
    trnum: ''
  });
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    get_trunk_list();

    if (user_permission === "1" || user_permission === "2") {
      setColumns([
        { Header: "نام", accessor: "name", align: "left" },
        { Header: "IP خارجی", accessor: "extip", align: "center" },
        { Header: "IP داخلی", accessor: "intip", align: "center" },
        { Header: "پورت", accessor: "port", align: "center" },
        { Header: "شماره تلفن", accessor: "number", align: "center" },
        { Header: "IPها", accessor: "allips", align: "center" },
        { Header: "پیش‌شماره", accessor: "prefix", align: "center" },
        { Header: "نوع", accessor: "type", align: "center" },
        { Header: "کانال‌ها", accessor: "channels", align: "center" },
        { Header: "SSW", accessor: "ssw", align: "center" },
        { Header: "تعداد تماس در ثانیه", accessor: "cps", align: "center" },
        { Header: "وضعیت", accessor: "disabled", align: "center" },
        { Header: "ویرایش", accessor: "edit", align: "center", width: '10%' },
        { Header: "حذف", accessor: "delete", align: "center", width: '10%' }
      ]);
    } else if (user_permission === "3") {
      setColumns([
        { Header: "نام", accessor: "name", align: "left" },
        { Header: "IP خارجی", accessor: "extip", align: "center" },
        { Header: "IP داخلی", accessor: "intip", align: "center" },
        { Header: "پورت", accessor: "port", align: "center" },
        { Header: "شماره تلفن", accessor: "number", align: "center" },
        { Header: "IPها", accessor: "allips", align: "center" },
        { Header: "پیش‌شماره", accessor: "prefix", align: "center" },
        { Header: "نوع", accessor: "type", align: "center" },
        { Header: "کانال‌ها", accessor: "channels", align: "center" },
        { Header: "SSW", accessor: "ssw", align: "center" },
        { Header: "تعداد تماس در ثانیه", accessor: "cps", align: "center" },
        { Header: "وضعیت", accessor: "disabled", align: "center" }
      ]);
    }
  }, []);

  const get_trunk_list = (listPage = page, listSearchValues = searchValues) => {
    setLoading(true);
    let postFormData = new FormData();
    postFormData.append('page', listPage);
    postFormData.append('trname', listSearchValues.trname);
    postFormData.append('trextip', listSearchValues.trextip);
    postFormData.append('trintip', listSearchValues.trintip);
    postFormData.append('trnum', listSearchValues.trnum);

    api.post("smt/listtrunk.ms", postFormData)
      .then((response) => {
        setLoading(false);
        setSearchLoading(false);
        setTotal(Math.ceil(response.data.total/20));
        setCommit(response.data.dirty);
        set_data(response.data);
      })
      .catch((error) => {
        setLoading(false);
      });
  }

  const set_data = (data) => {
    let dfltcpstrunk = data.dfltcpstrunk;
    let dfltcpsip = data.dfltcpsip;
    let temp_data = data.data;

    let temp_rows = [];
    if (user_permission === "1" || user_permission === "2") {
      temp_rows = temp_data.map((trunk) => {
        return (
          {
            name: (<div className="font-weight-bold">{trunk.name}</div>),
            extip: trunk.extip,
            intip: trunk.intip,
            port: trunk.extport,
            number: (<TrunkNumber trunk={trunk} setCommit={setCommit} />),
            allips: (<TrunkIPs trunk={trunk} dfltcpsip={dfltcpsip} setCommit={setCommit} />),
            prefix: (<TrunkPrefix trunk={trunk} setCommit={setCommit} />),
            type: trunk.type,
            channels: trunk.channels,
            ssw: trunk.ssw,
            cps: (trunk.cps ? trunk.cps : <span className="text-muted"> {dfltcpstrunk} </span>),
            disabled: (trunk.disabled === 0 ? <CheckCircle color="success" sx={{ fontSize: '25px' }} /> : <RemoveCircle color="error" sx={{ fontSize: '25px' }} />),
            edit: (<EditTrunk trunk={trunk} dfltcpstrunk={dfltcpstrunk} handle_close_modals={handle_close_modals} setCommit={setCommit} />),
            delete: (<DeleteTrunk trunk={trunk} handle_close_modals={handle_close_modals} setCommit={setCommit} />)
          }
        )});
    } else if (user_permission === "3") {
      temp_rows = temp_data.map((trunk) => {
        return (
          {
            name: (<div className="font-weight-bold">{trunk.name}</div>),
            extip: trunk.extip,
            intip: trunk.intip,
            port: trunk.extport,
            number: (<TrunkNumber trunk={trunk} setCommit={setCommit} />),
            allips: (<TrunkIPs trunk={trunk} dfltcpsip={dfltcpsip} setCommit={setCommit} />),
            prefix: (<TrunkPrefix trunk={trunk} setCommit={setCommit} />),
            type: trunk.type,
            channels: trunk.channels,
            ssw: trunk.ssw,
            cps: (trunk.cps ? trunk.cps : <span className="text-muted"> {dfltcpstrunk} </span>),
            disabled: (trunk.disabled === 0 ? <CheckCircle color="success" sx={{ fontSize: '25px' }} /> : <RemoveCircle color="error" sx={{ fontSize: '25px' }} />),
          }
        )});
    }

    setRows(temp_rows);
  }

  const handle_close_modals = () => {
    get_trunk_list();
  }

  useEffect(() => {
    get_trunk_list();
  }, [page]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handle_search = (values) => {
    setSearchValues(values);
    setSearchLoading(true);
    get_trunk_list(1, values);
  }

  return (
    <DashboardLayout name="لیست ترانک‌ها">
      <MDBox py={3}>
        <Grid container spacing={6}>

          <TrunkSearch handle_search={handle_search} />

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
                      لیست ترانک‌ها
                    </MDTypography>

                    {user_permission === "1" ?
                      <Button variant="outlined" color={AppConfig.color} className="table-button" href="/add-trunk">
                        ترانک جدید
                      </Button>
                      :
                      null
                    }
                  </MDBox>

                  <MDBox pt={3}>
                    <DataTable
                      table={{ columns, rows }}
                      pagination
                      isSorted={false}
                      entriesPerPage={{ defaultValue: AppConfig.pagination_size }}
                      showTotalEntries={false}
                      noEndBorder
                    />
                  </MDBox>
                </Card>
              </>
            }

            {!searchLoading && total > 1 ?
              <div className="pagination-custom">
                <Pagination count={total} color={AppConfig.color} onChange={handlePageChange}
                            style={loading ? { display: 'none' } : null}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(TrunkList);
