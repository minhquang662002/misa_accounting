<template>
  <div class="main-content__header">
    <p class="main-content__title">Nhân viên</p>
  </div>
  <EmployeeForm
    v-if="isFormOpen"
    :isFormOpen="isFormOpen"
    :formDetail="formDetail"
    @closeForm="closeForm"
    @refreshTable="refreshTable"
  />
  <EmployeeTable
    :page="page"
    :rowsPerPage="rowsPerPage"
    :employeeList="displayedRows"
    :records="`${employeeList.values.length}`"
    @prevPage="page -= 1"
    @nextPage="page += 1"
    @refreshTable="refreshTable"
    @deleteEmployee="deleteEmployee($event)"
    @showEmployeeForm="showEmployeeForm($event)"
    @changeRowsPerPage="changeRowsPerPage($event)"
    @deleteSelectedRows="deleteSelectedRows($event)"
  />
</template>
<script>
//#region import component
import EmployeeTable from "../components/employee/table/EmployeeTable.vue";
import EmployeeForm from "@/components/employee/form/EmployeeForm.vue";
import { ref, onMounted, watch } from "vue";
import store from "@/store";
import {
  getAllEmployees,
  deleteEmployee as deleteEmployeeById,
} from "@/helpers/api";
import { ACCOUNTING_TEXT } from "@/helpers/resources";
import { showToast } from "@/helpers/constants";

//#endregion

export default {
  name: "EmployeeView",
  components: { EmployeeTable, EmployeeForm },

  setup() {
    //#region state declarations

    const isFormOpen = ref(false);
    const formDetail = ref(null);
    const employeeList = ref([]);
    const page = ref(1);
    const rowsPerPage = ref(10);
    const displayedRows = ref([]);
    //#endregion

    /**
     * fetching data when component mounted
     * author: Lê Minh Quang
     * date: 22/03/2023
     */

    onMounted(async () => {
      store.commit("showLoading");

      try {
        const res = await getAllEmployees();
        employeeList.value.values = res;
        displayedRows.value.values = employeeList.value.values.slice(
          (page.value - 1) * rowsPerPage.value,
          page.value * rowsPerPage.value
        );
      } catch (error) {
        showToast(
          "error",
          error.response.data?.userMsg || ACCOUNTING_TEXT.VI.systemError
        );
      }
      store.commit("hideLoading");
    });

    //#region methods declaration

    const changeRowsPerPage = (e) => {
      rowsPerPage.value = e;
    };

    /**
     *
     * feature: update data when paginate
     * author: Le Minh Quang
     * date: 29/03/2023
     */

    watch(rowsPerPage, () => {
      displayedRows.value.values = employeeList.value.values.slice(
        (page.value - 1) * rowsPerPage.value,
        page.value * rowsPerPage.value
      );
    });

    watch(page, () => {
      displayedRows.value.values = employeeList.value.values.slice(
        (page.value - 1) * rowsPerPage.value,
        page.value * rowsPerPage.value
      );
    });

    /**
     *
     * @param {*} e
     * feature: show employee form
     * author: Le Minh Quang
     * date: 29/03/2023
     */

    const showEmployeeForm = (e) => {
      isFormOpen.value = true;
      formDetail.value = e;
    };

    /**
     * feature: clear form information
     * author: Le Minh Quang
     * date: 29/03/2023
     */

    const clearInformation = () => {
      formDetail.value = null;
    };

    /**
     * feature: close form and reset state
     * author: Le Minh Quang
     * date: 29/03/2023
     */

    const closeForm = () => {
      formDetail.value = null;
      isFormOpen.value = false;
    };

    /**
     * feature: implement refresh table method, reload data table when click refresh icon
     * author: Lê Minh Quang
     * date: 22/03/2023
     */

    const refreshTable = async () => {
      store.commit("showLoading");
      try {
        const res = await getAllEmployees();
        employeeList.value.values = res;
        displayedRows.value.values = employeeList.value.values.slice(
          (page.value - 1) * rowsPerPage.value,
          page.value * rowsPerPage.value
        );
      } catch (error) {
        showToast(
          "error",
          error.response.data?.userMsg || ACCOUNTING_TEXT.VI.systemError
        );
      }
      store.commit("hideLoading");
    };

    /**feature: delete employee with id
     * @param {*} employeeId
     * author: Le Minh Quang
     * date: 24/03/2023
     */

    const deleteEmployee = async (employeeId) => {
      store.commit("showLoading");
      try {
        await deleteEmployeeById(employeeId);
        showToast("success", ACCOUNTING_TEXT.VI.successToast.deleteEmployee);
        employeeList.value.values = employeeList.value.values.filter(
          (item) => item.EmployeeId !== employeeId
        );
        displayedRows.value.values = employeeList.value.values.slice(
          (page.value - 1) * rowsPerPage.value,
          page.value * rowsPerPage.value
        );
      } catch (error) {
        showToast(
          "error",
          error.response.data?.userMsg ||
            ACCOUNTING_TEXT.VI.errorToast.deleteEmployee
        );
      }
      store.commit("hideLoading");
    };

    /**
     * feature: delete selected rows
     * author: Le Minh Quang
     * date: 28/03/2023
     */

    const deleteSelectedRows = async (selectedRows) => {
      store.commit("showLoading");
      try {
        selectedRows.forEach(async (item) => {
          await deleteEmployeeById(item);
          employeeList.value.values = employeeList.value.values.filter(
            (item) => item.EmployeeId !== item
          );
          displayedRows.value.values = employeeList.value.values.slice(
            (page.value - 1) * rowsPerPage.value,
            page.value * rowsPerPage.value
          );
        });
        showToast("success", ACCOUNTING_TEXT.VI.successToast.deleteEmployee);
      } catch (error) {
        showToast(
          "error",
          error.response.data?.userMsg ||
            ACCOUNTING_TEXT.VI.errorToast.deleteEmployee
        );
      }
      store.commit("hideLoading");
    };

    //#endregion

    return {
      page,
      rowsPerPage,
      isFormOpen,
      employeeList,
      formDetail,
      displayedRows,
      changeRowsPerPage,
      showEmployeeForm,
      closeForm,
      clearInformation,
      refreshTable,
      deleteEmployee,
      deleteSelectedRows,
    };
  },

  //#endregion
};
</script>
