<template>
  <thead class="table-content__header">
    <tr>
      <th class="align-center" id="table__header-checkbox">
        <input
          type="checkbox"
          @click="selectAll"
          :value="isSelectedAll"
          :checked="isSelectedAll"
        />
      </th>
      <th class="align--left" id="table__header-id">Mã nhân viên</th>
      <th class="align--left" id="table__header-name">Tên nhân viên</th>
      <th class="align--left" id="table__header-sex">Giới tính</th>
      <th class="align--center" id="table__header-dob">Ngày sinh</th>
      <th class="align--left tooltip-container" id="table__header-cmnd">
        Số CMND<BaseToolTip text="Số chứng minh nhân dân" />
      </th>
      <th class="align--left" id="table__header-identityPlace">Nơi cấp</th>
      <th class="align--left" id="table__header-title">Chức danh</th>
      <th class="align--left" id="table__header-unit">Tên đơn vị</th>
      <th class="align--center" id="table__header-feature">Chức năng</th>
    </tr>
  </thead>
</template>
<script>
export default {
  name: "EmployeeTableContentHeader",
  props: ["isSelectedAll", "deselectAll"],
  setup(props, { emit }) {
    const selectAll = () => {
      if (props.isSelectedAll) {
        emit("deselectAll");
      } else {
        emit("selectAll");
      }
    };
    return { selectAll };
  },
};
</script>
