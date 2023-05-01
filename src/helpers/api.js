import axios from "axios";
import { baseUrl } from "./constants";

export const getAllEmployees = async () => {
  const res = await axios.get(`${baseUrl}/Employees`);
  return res.data;
};

export const getFilterEmployees = async (
  keyword,
  pageSize = 20,
  pageNumber = 1,
  filterList
) => {
  const res = await axios.post(
    `${baseUrl}/Employees/Filter?keyword=${keyword}&pageSize=${pageSize}&pageNumber=${pageNumber}`,
    { ...filterList }
  );

  return res.data;
};

export const getGeneratedCode = async () => {
  const res = await axios.get(`${baseUrl}/Employees/NewEmployeeCode`);
  return res.data;
};

export const getDepartments = async () => {
  const res = await axios.get(`${baseUrl}/Departments`);
  return res.data;
};

export const getPositions = async () => {
  const res = await axios.get(`${baseUrl}/Positions`);
  return res.data;
};

export const createNewEmployee = async (data) => {
  await axios.post(`${baseUrl}/Employees`, data);
};

export const updateEmployee = async (id, data) => {
  await axios.put(`${baseUrl}/Employees/${id}`, data);
};

export const deleteEmployee = async (id) => {
  await axios.delete(`${baseUrl}/Employees/${id}`);
};

export const exportToExcel = async (queryString, excelParams) => {
  const res = await axios.post(
    `${baseUrl}/Employees/Excel?keyword=${queryString}`,
    excelParams,
    { responseType: "blob" }
  );

  // const contentTypeHeader = res.headers["content-type"];
  const url = window.URL.createObjectURL(
    new Blob([res.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    })
  );

  const link = window.document.createElement("a");
  link.href = url;
  link.download = "Danh_sach_nhan_vien.xlsx";
  document.body.appendChild(link);
  link.click();

  // Remove anchor from body
  document.body.removeChild(link);
};
