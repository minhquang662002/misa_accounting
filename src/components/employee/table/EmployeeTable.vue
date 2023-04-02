<template>
  <EmployeeTableFeatureRow
    @refreshTable="refreshTable"
    @showEmployeeForm="showEmployeeForm($event)"
    @selectAllCheckboxes="selectAllCheckboxes"
    @dropAllCheckBoxes="dropAllCheckBoxes"
    @deleteSelectedRows="deleteSelectedRows"
    :rowsSelected="rowsSelected"
  />

  <div class="table-content-wrapper">
    <table class="table-content">
      <EmployeeTableContentHeader
        @selectAll="selectAllCheckboxes"
        @deselectAll="dropAllCheckBoxes"
        :isSelectedAll="rowsSelected.length === employeeList.values.length"
      />
      <EmployeeTableContentBody
        :employeeList="employeeList"
        :rowsSelected="rowsSelected"
        @showEmployeeForm="showEmployeeForm($event)"
        @deleteEmployee="deleteEmployee($event)"
        @selectRow="selectRow($event)"
      />
    </table>
    <div class="table-content__footer">
      <p>
        Total:
        <b id="record__number">{{ records }}</b> records
      </p>
      <div class="table-content-pagination-container">
        <p>Record/Page</p>
        <div style="display: flex; gap: 30px">
          <div style="display: flex; gap: 16px; align-items: center">
            <!-- <BaseDropDownList /> -->
            <BaseDropDownList
              :value="rowsPerPage"
              @changeRowsPerPage="changeRowsPerPage($event)"
              required="true"
              name="rowsPerPage"
              :mode="ACCOUNTING_ENUM.DROPDOWN.PAGINATION"
              :defautList="[
                { rowsPerPage: 10 },
                { rowsPerPage: 50 },
                { rowsPerPage: 100 },
              ]"
            />

            <p>
              <b>{{ rowsPerPage * (page - 1) + 1 }}-{{ rowsPerPage * page }}</b>
              records
            </p>
          </div>
          <div style="display: flex; align-items: center">
            <img
              @click="prevPage"
              src="../../../assets/icon/btn-prev-page.svg"
              alt=""
            />
            <img
              @click="nextPage"
              src="../../../assets/icon/btn-next-page.svg"
              alt=""
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import EmployeeTableFeatureRow from "./EmployeeTableFeatureRow.vue";
import EmployeeTableContentHeader from "./EmployeeTableContentHeader.vue";
import EmployeeTableContentBody from "./EmployeeTableContentBody.vue";
import { ACCOUNTING_ENUM } from "@/helpers/resources";

import { ref } from "vue";
export default {
  name: "EmployeeTable",
  props: ["isFormOpen", "employeeList", "records", "page", "rowsPerPage"],
  components: {
    EmployeeTableFeatureRow,
    EmployeeTableContentHeader,
    EmployeeTableContentBody,
  },
  emits: [
    "showEmployeeForm",
    "deleteEmployee",
    "refreshTable",
    "changeRowsPerPage",
    "prevPage",
    "nextPage",
  ],
  setup(props, { emit }) {
    const rowsSelected = ref([]);

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
      rowsSelected.value.splice(0);
      const all = props.employeeList.values.map((item) => item.EmployeeId);
      rowsSelected.value.push(...all);
    };

    const deleteSelectedRows = () => {
      emit("deleteSelectedRows", rowsSelected.value);
    };

    //#endregion

    return {
      ACCOUNTING_ENUM,
      rowsSelected,
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
    };
  },
};
</script>
