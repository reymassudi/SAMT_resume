import UserList from "routes/user-list";
import AddUser from "./routes/add-user";
import { Group, AssignmentInd, AddRoad, Analytics, Cable, Fitbit, DeviceHub, CheckBox as CheckBoxIcon, MiscellaneousServices, Home } from "@mui/icons-material";
import AddTrunk from "./routes/add-trunk";
import TrunkList from "./routes/trunk-list";
import Commit from "./routes/commit";
import AddSubscriber from "./routes/add-subscriber";
import SubscriberList from "./routes/subscriber-list";
import AddSBC from "./routes/add-sbc";
import SBCList from "./routes/sbc-list";
import CarrierList from "./routes/crr-list";
import AddCarrier from "./routes/add-crr";
import FirewallList from "./routes/firewall-list";
import AddFirewall from "./routes/add-firewall";
import AddSwitch from "./routes/add-switch";
import SwitchList from "./routes/switch-list";
import DefaultParams from "./routes/default-params";
import Dashboard from "./routes/dashboard";

const routes = [
  {
    color: "error",
    type: "collapse",
    perms: ["1", "2", "3"],
    name: "داشبورد",
    key: "dashboard",
    icon: <Home sx={{ fontSize: 20 }} />,
    route: "/",
    component: <Dashboard />,
  },
  {
    color: "error",
    type: "collapse",
    perms: ["1", "2", "3"],
    name: "لیست کاربران",
    key: "user-list",
    icon: <Group sx={{ fontSize: 20 }} />,
    route: "/user-list",
    component: <UserList />,
  },
  {
    type: "route",
    perms: ["1", "2"],
    name: "ایجاد کاربر جدید",
    key: "add-user",
    route: "/add-user",
    component: <AddUser />,
  },
  {
    color: "error",
    type: "collapse",
    perms: ["1", "2", "3"],
    name: "لیست ترانک‌ها",
    key: "trunk-list",
    icon: <Cable sx={{ fontSize: 20 }} />,
    route: "/trunk-list",
    component: <TrunkList />,
  },
  {
    type: "route",
    perms: ["1", "2"],
    name: "ایجاد ترانک جدید",
    key: "add-trunk",
    route: "/add-trunk",
    component: <AddTrunk />,
  },
  {
    color: "error",
    type: "collapse",
    perms: ["1", "2", "3"],
    name: "لیست مشترکین",
    key: "subscriber-list",
    icon: <AssignmentInd sx={{ fontSize: 20 }} />,
    route: "/subscriber-list",
    component: <SubscriberList />,
  },
  {
    type: "route",
    perms: ["1", "2"],
    name: "ایجاد مشترک جدید",
    key: "add-subscriber",
    route: "/add-subscriber",
    component: <AddSubscriber />,
  },
  {
    color: "error",
    type: "collapse",
    perms: ["1", "2", "3"],
    name: "لیست سوییچ‌ها",
    key: "switch-list",
    icon: <DeviceHub sx={{ fontSize: 20 }} />,
    route: "/switch-list",
    component: <SwitchList />,
  },
  {
    type: "route",
    perms: ["1", "2"],
    name: "ایجاد سوییچ جدید",
    key: "add-switch",
    route: "/add-switch",
    component: <AddSwitch />,
  },
  {
    color: "error",
    type: "collapse",
    perms: ["1", "2", "3"],
    name: "لیست کنترلگرهای مرزی",
    key: "sbc-list",
    icon: <AddRoad sx={{ fontSize: 20 }} />,
    route: "/sbc-list",
    component: <SBCList />,
  },
  {
    type: "route",
    perms: ["1", "2"],
    name: "ایجاد کنترلگر مرزی جدید",
    key: "add-sbc",
    route: "/add-sbc",
    component: <AddSBC />,
  },
  {
    color: "error",
    type: "collapse",
    name: "لیست کریرها",
    perms: ["1", "2", "3"],
    key: "carrier-list",
    icon: <Fitbit sx={{ fontSize: 20 }} />,
    route: "/carrier-list",
    component: <CarrierList />,
  },
  {
    type: "route",
    perms: ["1", "2"],
    name: "ایجاد کریر جدید",
    key: "add-carrier",
    route: "/add-carrier",
    component: <AddCarrier />,
  },
  {
    type: "title",
    name: "لود بالانسر",
    perms: ["1", "2", "3"],
    key: ["firewall-list"],
    icon: <Analytics sx={{ fontSize: 22 }} />,
    collapse: [
      {
        color: "error",
        type: "collapse",
        perms: ["1", "2", "3"],
        name: "لیست فایروال‌ها",
        key: "firewall-list",
        icon: <Analytics sx={{ fontSize: 20 }} />,
        route: "/firewall-list",
        component: <FirewallList />,
      },
    ],
  },
  {
    type: "route",
    perms: ["1", "2"],
    name: "ایجاد فایروال جدید",
    key: "add-firewall",
    route: "/add-firewall",
    component: <AddFirewall />,
  },
  {
    color: "error",
    type: "collapse",
    perms: ["1", "2"],
    name: "تنظیم پارامترهای سیستم",
    key: "set-parameters",
    icon: <MiscellaneousServices />,
    route: "/set-parameters",
    component: <DefaultParams />,
  },
  {
    color: "error",
    type: "collapse",
    perms: ["1", "2"],
    name: "اجرای تغییرات",
    key: "commit",
    icon: <CheckBoxIcon />,
    route: "/commit",
    component: <Commit />,
  },
];

export default routes;
