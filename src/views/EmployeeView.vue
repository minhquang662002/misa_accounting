<template>
  <div class="main-content__header">
    <p class="main-content__title">{{ $t("words.employee") }}</p>
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
    :employeeList="employeeList.values"
    :records="total"
    :keyword="keyword"
    :filters="filters"
    @prevPage="page -= 1"
    @nextPage="page += 1"
    @refreshTable="refreshTable"
    @deleteEmployee="deleteEmployee($event)"
    @showEmployeeForm="showEmployeeForm($event)"
    @changeRowsPerPage="changeRowsPerPage($event)"
    @deleteSelectedRows="deleteSelectedRows($event)"
    @setPage="setPage($event)"
    @updateSearch="updateSearch($event)"
    @updateFilter="updateFilter($event)"
    @removeAllFilter="removeAllFilter"
    @removeFilter="removeFilter($event)"
  />
</template>
<script>
//#region import component
import EmployeeTable from "../components/employee/table/EmployeeTable.vue";
import EmployeeForm from "@/components/employee/form/EmployeeForm.vue";
import { ref, onMounted, watch } from "vue";
import { getGeneratedCode } from "@/helpers/api";
import store from "@/store";
import {
  deleteEmployee as deleteEmployeeById,
  getFilterEmployees,
} from "@/helpers/api";
import { ACCOUNTING_TEXT, ACCOUNTING_ENUM } from "@/helpers/resources";
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
    const total = ref(0);
    const page = ref(1);
    const rowsPerPage = ref(20);
    const keyword = ref("");
    const filters = ref({});
    const isDialogOpen = ref(false);
    //#endregion

    /**
     * fetching data when component mounted
     * author: Lê Minh Quang
     * date: 22/03/2023
     */

    onMounted(async () => {
      store.commit("showLoading");

      try {
        const res = await getFilterEmployees(
          keyword.value,
          rowsPerPage.value,
          page.value
        );
        employeeList.value.values = res.data;
        total.value = res.totalRecord;
      } catch (error) {
        showToast(
          "error",
          error.response.data?.userMsg || ACCOUNTING_TEXT.VI.systemError
        );
      }
      store.commit("hideLoading");
    });

    //#region methods declaration

    const setPage = (e) => {
      page.value = e;
    };

    const changeRowsPerPage = (e) => {
      rowsPerPage.value = e;
    };

    /**
     *
     * @param {*} e
     * feature: show employee form
     * author: Le Minh Quang
     * date: 29/03/2023
     */

    const showEmployeeForm = async (e) => {
      if (
        e.mode === ACCOUNTING_ENUM.MODE.ADD ||
        e.mode === ACCOUNTING_ENUM.MODE.DUPLICATE
      ) {
        const newEmployeeCode = await getGeneratedCode();
        e = { ...e, data: { ...e.data, employeeCode: newEmployeeCode } };
      }
      formDetail.value = e;
      isFormOpen.value = true;
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
        const res = await getFilterEmployees(
          keyword.value,
          rowsPerPage.value,
          page.value,
          filters.value
        );
        employeeList.value.values = res.data;
        total.value = res.totalRecord;
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

        await refreshTable();
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

    /**
     * feature: delete selected rows
     * author: Le Minh Quang
     * date: 28/03/2023
     */

    const deleteSelectedRows = async (selectedRows) => {
      store.commit("showLoading");
      try {
        for (const row of selectedRows) {
          await deleteEmployeeById(row);
        }

        await refreshTable();
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

    const updateSearch = (e) => {
      keyword.value = e;
    };

    const updateFilter = (e) => {
      filters.value[Object.keys(e)[0]] = e[Object.keys(e)[0]];
    };

    const removeFilter = (e) => {
      delete filters.value[e];
    };

    const removeAllFilter = () => {
      filters.value = {};
    };

    //#endregion

    watch(
      () => filters.value,
      () => {
        refreshTable();
        page.value = 1;
      },
      {
        deep: true,
      }
    );

    watch(
      () => page.value,
      () => {
        refreshTable();
      }
    );

    watch(
      () => rowsPerPage.value,
      () => {
        refreshTable();
        page.value = 1;
      }
    );

    let timeout = null;
    watch(
      () => keyword.value,
      () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          refreshTable();
        }, 500);
        page.value = 1;
      }
    );

    return {
      page,
      rowsPerPage,
      isFormOpen,
      employeeList,
      formDetail,
      isDialogOpen,
      total,
      keyword,
      filters,
      changeRowsPerPage,
      showEmployeeForm,
      closeForm,
      clearInformation,
      refreshTable,
      deleteEmployee,
      deleteSelectedRows,
      setPage,
      updateSearch,
      updateFilter,
      removeFilter,
      removeAllFilter,
    };
  },

  //#endregion
};
</script>
