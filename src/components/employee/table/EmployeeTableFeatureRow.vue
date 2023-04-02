<template>
  <div class="table__feature-row">
    <div v-if="!rowsSelected.length" style="width: 200">
      <BaseDropDownList placeholder="Thực hiện hàng loạt" :list="['Gộp']" />
    </div>
    <div v-if="rowsSelected.length" class="table__feature-delete-container">
      <p class="total-selected">
        Đã chọn <b>{{ rowsSelected.length }}</b>
      </p>
      <p class="drop-all" @click="dropAllCheckBoxes">Bỏ chọn</p>
      <p class="select-all" @click="selectAllCheckboxes">Chọn tất cả</p>
      <div @click="deleteSelectedRows">
        <BaseButton type="secondary" text="Xóa" />
      </div>
    </div>
    <div class="table__feature-container">
      <BaseTextField placeholder="Tìm kiếm" />
      <div @click="refreshTable" class="table__refresh-icon"></div>
      <div class="table__excel-icon"></div>
      <div class="table__setting-icon"></div>
      <BaseButton text="Tiện ích" type="secondary" />
      <div @click="showEmployeeForm">
        <BaseButton text="Thêm" type="primary" />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "EmployeeTableFeatureRow",
  props: ["rowsSelected"],
  setup(_, { emit }) {
    //#region method declarations
    const refreshTable = () => {
      emit("refreshTable");
    };

    const showEmployeeForm = () => {
      emit("showEmployeeForm", { mode: 1, data: {} });
    };

    const dropAllCheckBoxes = () => {
      emit("dropAllCheckBoxes");
    };

    const selectAllCheckboxes = () => {
      emit("selectAllCheckboxes");
    };

    const deleteSelectedRows = () => {
      emit("deleteSelectedRows");
    };

    //#region

    return {
      refreshTable,
      showEmployeeForm,
      dropAllCheckBoxes,
      selectAllCheckboxes,
      deleteSelectedRows,
    };
  },
};
</script>
