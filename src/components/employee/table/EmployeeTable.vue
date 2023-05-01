<template>
  <EmployeeTableFeatureRow
    @refreshTable="refreshTable"
    @showEmployeeForm="showEmployeeForm($event)"
    @selectAllCheckboxes="selectAllCheckboxes"
    @dropAllCheckBoxes="dropAllCheckBoxes"
    @deleteSelectedRows="deleteSelectedRows"
    :rowsSelected="rowsSelected"
    :keyword="keyword"
    @updateSearch="updateSearch($event)"
    :filters="filters"
    @removeFilter="removeFilter($event)"
    @removeAllFilter="removeAllFilter"
    @updateDisplaySetting="updateDisplaySetting($event)"
  />

  <div class="table-content-wrapper">
    <table class="table-content">
      <EmployeeTableContentHeader
        @selectAll="selectAllCheckboxes"
        @deselectAll="dropAllCheckBoxes"
        :isSelectedAll="rowsSelected.length >= page * rowsPerPage"
        :filters="filters"
        :headerList="headerList"
        @updateFilter="updateFilter($event)"
        @removeFilter="($event) => removeFilter($event)"
      />
      <EmployeeTableContentBody
        :employeeList="employeeList"
        :rowsSelected="rowsSelected"
        :headerList="headerList"
        @showEmployeeForm="showEmployeeForm($event)"
        @deleteEmployee="deleteEmployee($event)"
        @selectRow="selectRow($event)"
      />
    </table>
    <div v-if="records > 0" class="table-content__footer">
      <p>
        {{ $t("words.total") }}:
        <b id="record__number">{{ records?.toLocaleString("it-IT") }}</b>
        {{ $t("words.record") }}
      </p>
      <BasePagination
        :rowsPerPage="rowsPerPage"
        :page="page"
        :total="records"
        @setPage="setPage($event)"
        @changeRowsPerPage="changeRowsPerPage($event)"
      />
    </div>
  </div>
</template>
<script>
import EmployeeTableFeatureRow from "./EmployeeTableFeatureRow.vue";
import EmployeeTableContentHeader from "./EmployeeTableContentHeader.vue";
import EmployeeTableContentBody from "./EmployeeTableContentBody.vue";
import BasePagination from "@/components/base/BasePagination.vue";
import { ACCOUNTING_ENUM } from "@/helpers/resources";
import { ref } from "vue";
import { TABLE_HEADERS } from "@/helpers/constants";
export default {
  name: "EmployeeTable",
  props: [
    "isFormOpen",
    "employeeList",
    "records",
    "page",
    "rowsPerPage",
    "keyword",
    "filters",
  ],
  components: {
    EmployeeTableFeatureRow,
    EmployeeTableContentHeader,
    EmployeeTableContentBody,
    BasePagination,
  },
  emits: [
    "showEmployeeForm",
    "deleteEmployee",
    "refreshTable",
    "changeRowsPerPage",
    "prevPage",
    "nextPage",
    "deleteSelectedRows",
    "setPage",
    "updateSearch",
    "updateFilter",
    "removeFilter",
    "removeAllFilter",
  ],
  setup(props, { emit }) {
    const rowsSelected = ref([]);
    const headerList = ref(
      localStorage.getItem("displaySettings")
        ? JSON.parse(localStorage.getItem("displaySettings"))
        : TABLE_HEADERS
    );
    //#region methods declaration

    const prevPage = () => {
      if (props.page > 1) {
        emit("prevPage");
      }
    };

    const nextPage = () => {
      if (props.rowsPerPage * props.page < props.records) {
        emit("nextPage");
      }
    };

    const changeRowsPerPage = (e) => {
      emit("changeRowsPerPage", e);
    };

    const setPage = (e) => {
      emit("setPage", e);
    };

    /**
     * feature: select table row
     * author: Le Minh Quang
     * date: 28/03/2023
     */

    const selectRow = (e) => {
      if (!rowsSelected.value.some((item) => item === e)) {
        rowsSelected.value.push(e);
      } else {
        const index = rowsSelected.value.findIndex((item) => item === e);
        rowsSelected.value.splice(index, 1);
      }
    };

    /**
     * feature: emit refresh table
     * author: Le Minh Quang
     * date: 28/03/2023
     */

    const refreshTable = () => {
      emit("refreshTable");
    };

    /**
     * feature: emit show employee form
     * author: Le Minh Quang
     * date: 28/03/2023
     */

    const showEmployeeForm = (e) => {
      emit("showEmployeeForm", e);
    };

    /**
     * feature: emit delete employee
     * author: Le Minh Quang
     * date: 28/03/2023
     */

    const deleteEmployee = (e) => {
      emit("deleteEmployee", e);
    };

    /**
     * feature: drop all checkboxes
     * author: Le Minh Quang
     * date: 28/03/2023
     */

    const dropAllCheckBoxes = () => {
      rowsSelected.value.splice(0);
    };

    /**
     * feature: select all checkboxes
     * author: Le Minh Quang
     * date: 28/03/2023
     */

    const selectAllCheckboxes = () => {
      const all = props.employeeList.map((item) => item.employeeID);
      rowsSelected.value.push(...all);
    };

    const deleteSelectedRows = () => {
      emit("deleteSelectedRows", rowsSelected.value);
      rowsSelected.value = [];
    };

    const updateSearch = (e) => {
      emit("updateSearch", e);
    };

    const updateFilter = (e) => {
      emit("updateFilter", e);
    };

    const removeFilter = (e) => {
      emit("removeFilter", e);
    };

    const removeAllFilter = () => {
      emit("removeAllFilter");
    };

    const updateDisplaySetting = (e) => {
      headerList.value = e;
    };

    //#endregion

    return {
      ACCOUNTING_ENUM,
      rowsSelected,
      headerList,
      prevPage,
      nextPage,
      showEmployeeForm,
      refreshTable,
      deleteEmployee,
      selectRow,
      changeRowsPerPage,
      dropAllCheckBoxes,
      selectAllCheckboxes,
      deleteSelectedRows,
      setPage,
      updateSearch,
      updateFilter,
      removeFilter,
      removeAllFilter,
      updateDisplaySetting,
    };
  },
};
</script>
