import axios from "axios";
import { baseUrl } from "./constants";

export const getAllEmployees = async () => {
  const res = await axios.get(`${baseUrl}/Employees`);
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
