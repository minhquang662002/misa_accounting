import store from "@/store";
import { ACCOUNTING_TEXT } from "./resources";

export const baseUrl =
  process.env.NODE_ENV !== "production"
    ? "https://localhost:7069/api/v1"
    : "idontknow";

export const showToast = (type, text) => {
  store.commit("pushToast", {
    type,
    text,
  });
};

export const TABLE_HEADERS = [
  {
    headerName: "Mã nhân viên",
    className: ["align--left", "filter-container"],
    width: 180,
    isShown: true,
    sticky: false,
    model: "employeeCode",
  },
  {
    headerName: "Tên nhân viên",
    className: ["align--left", "filter-container"],
    width: 430,
    isShown: true,
    sticky: false,
    model: "fullName",
  },
  {
    headerName: "Giới tính",
    className: ["align--left", "filter-container"],
    width: 120,
    isShown: true,
    sticky: false,
    model: "genderName",
  },
  {
    headerName: "Ngày sinh",
    className: ["align--center", "filter-container"],
    width: 140,
    isShown: true,
    sticky: false,
    model: "dateOfBirth",
  },
  {
    headerName: "Số CMND",
    className: ["align--left", "tooltip-container", "filter-container"],
    width: 200,
    isShown: true,
    tooltipText: "Số chứng minh nhân dân",
    sticky: false,
    model: "identityNumber",
  },
  {
    headerName: "Ngày cấp",
    className: ["align--center", "filter-container"],
    width: 150,
    isShown: true,
    sticky: false,
    model: "identityDate",
  },
  {
    headerName: "Nơi cấp",
    className: ["align--left", "filter-container"],
    width: 150,
    isShown: true,
    sticky: false,
    model: "identityPlace",
  },
  {
    headerName: "Chức danh",
    className: ["align--left"],
    width: 240,
    isShown: true,
    sticky: false,
    model: "positionName",
  },
  {
    headerName: "Mã đơn vị",
    className: ["align--left"],
    width: 150,
    isShown: true,
    sticky: false,
    model: "departmentCode",
  },
  {
    headerName: "Tên đơn vị",
    className: ["align--left"],
    width: 200,
    isShown: true,
    sticky: false,
    model: "departmentName",
  },
  {
    headerName: "Địa chỉ",
    className: ["align--left"],
    width: 200,
    isShown: true,
    sticky: false,
    model: "address",
  },
  {
    headerName: "ĐT di động",
    className: ["align--left"],
    width: 150,
    isShown: true,
    sticky: false,
    model: "phoneNumber",
  },
  {
    headerName: "ĐT cố định",
    className: ["align--left"],
    width: 150,
    isShown: true,
    sticky: false,
    model: "landline",
  },
  {
    headerName: "Email",
    className: ["align--left"],
    width: 200,
    isShown: true,
    sticky: false,
    model: "email",
  },
];

export const filterConditions = [
  { text: "isNull", operator: "##" },
  { text: "notNull", operator: "!#" },
  { text: "equal", operator: "==" },
  { text: "notEqual", operator: "!=" },
  { text: "contain", operator: "**" },
  { text: "notContain", operator: "!*" },
  { text: "startWith", operator: "$%" },
  { text: "endWith", operator: "%$" },
];

export const convertOperator = (operator, value) => {
  if (operator == "##") {
    return ACCOUNTING_TEXT.vi.operator.isNull;
  } else if (operator == "!#") {
    return ACCOUNTING_TEXT.vi.operator.notNull;
  } else if (operator == "==") {
    return `${ACCOUNTING_TEXT.vi.operator.equal} "${value}"`;
  } else if (operator == "!=") {
    return `${ACCOUNTING_TEXT.vi.operator.notEqual} "${value}"`;
  } else if (operator == "**") {
    return `${ACCOUNTING_TEXT.vi.operator.contain} "${value}"`;
  } else if (operator == "!*") {
    return `${ACCOUNTING_TEXT.vi.operator.notContain} "${value}"`;
  } else if (operator == "$%") {
    return `${ACCOUNTING_TEXT.vi.operator.startWith} "${value}"`;
  } else if (operator == "%$") {
    return `${ACCOUNTING_TEXT.vi.operator.endWith} "${value}"`;
  }
};

export const calculateWidth = (list, index) => {
  return list
    .filter((item) => item.isShown && item.sticky)
    .slice(0, index)
    .reduce((total, cur) => total + cur.width, 54.8);
};

export const testDownload = (uri, name) => {
  var link = document.createElement("a");
  link.download = name;
  link.href = uri;
  link.click();
};
