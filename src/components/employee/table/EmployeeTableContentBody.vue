<template>
  <BaseDialog
    v-if="isDialogShown"
    title="Cảnh báo"
    :text="`Bạn có chắc là muốn xóa nhân viên <${menuPos?.data?.EmployeeCode}> không?`"
    cancelText="Không"
    continueText="Có"
    type="warning"
    @cancelAction="cancelDeleteAction"
    @continueAction="deleteEmployee(menuPos?.data?.EmployeeId)"
  />
  <div
    v-click-outside="() => (isMenuShown = false)"
    v-if="isMenuShown"
    class="table-feature-list-container"
    :style="{
      left: menuPos.x - 90 + 'px',
      top: (menuPos.isLast ? menuPos.y - 90 : menuPos.y + 8) + 'px',
    }"
  >
    <div class="table-feature-list">
      <div>Nhân bản</div>
      <div
        @click="
          () => {
            isDialogShown = true;
            isMenuShown = false;
          }
        "
      >
        Xóa
      </div>
      <div>Ngừng sử dụng</div>
    </div>
  </div>
  <tbody class="table-content__body">
    <tr
      v-for="data in employeeList.values"
      :key="data.EmployeeId"
      @dblclick="showEmployeeForm({ data, mode: 2 })"
      :class="
        rowsSelected.some((item) => item === data.EmployeeId)
          ? 'row--checked'
          : ''
      "
    >
      <td class="table__checkbox-cell align--center">
        <input
          v-model="test"
          :value="data.EmployeeId"
          type="checkbox"
          @click="() => selectRow(data.EmployeeId)"
        />
      </td>
      <td class="table__id-cell tooltip-container align--left">
        {{ data.EmployeeCode }}<BaseToolTip :text="data.EmployeeCode" />
      </td>
      <td class="table__name-cell tooltip-container align--left">
        {{ data.FullName }}<BaseToolTip :text="data.FullName" />
      </td>
      <td class="table__sex-cell align--left">
        {{
          data.Gender == 0
            ? "Nữ"
            : data.Gender == 1
            ? "Nam"
            : data.Gender == 2
            ? "Khác"
            : "Không xác định"
        }}
      </td>
      <td class="table__dob-cell align--center">
        {{
          data.DateOfBirth &&
          `${new Date(data.DateOfBirth).toLocaleDateString("en-GB")}`
        }}
      </td>
      <td class="table__cmnd-cell tooltip-container align--left">
        {{ data.IdentityNumber }}
        <BaseToolTip :text="data.IdentityNumber" />
      </td>
      <td class="table__identity-place-cell align--left">
        {{ data.IdentityPlace }}
        <BaseToolTip :text="data.IdentityNumber" />
      </td>
      <td class="table__title-cell align--left">
        {{ data.PositionName }}
      </td>

      <td class="table__unit-cell align--left">
        {{ data.DepartmentName }}
      </td>
      <td class="table__feature-cell align--center">
        <EmployeeTableFeatureCellButton
          @showMenu="isMenuShown = $event"
          @updateMenu="menuPos = $event"
          @showEmployeeForm="showDetailEmployeeForm({ data, mode: 2 })"
          :data="data"
          :isMenuShown="isMenuShown"
        />
      </td>
    </tr>
  </tbody>
</template>
<script>
import EmployeeTableFeatureCellButton from "./EmployeeTableFeatureCellButton.vue";
import { ref, watch } from "vue";
export default {
  name: "EmployeeTableContentBody",
  props: ["employeeList", "rowsSelected"],
  components: { EmployeeTableFeatureCellButton },
  emits: ["showEmployeeForm", "deleteEmployee", "selectRow"],
  setup(props, { emit }) {
    const isDialogShown = ref(false);
    const menuPos = ref(null);
    const isMenuShown = ref(false);
    const checkboxRef = ref(null);
    const test = ref([]);
    //#region method declarations

    const selectRow = (data) => {
      emit("selectRow", data);
    };

    const showEmployeeForm = (data) => {
      emit("showEmployeeForm", data);
    };
    const cancelDeleteAction = () => {
      console.log("rn");
      menuPos.value = null;
      isDialogShown.value = false;
    };

    const deleteEmployee = (employeeId) => {
      emit("deleteEmployee", employeeId);
      isDialogShown.value = false;
      menuPos.value = null;
    };
    //#endregion
    watch(props.rowsSelected, () => {
      test.value = props.rowsSelected;
    });

    return {
      isDialogShown,
      menuPos,
      isMenuShown,
      showEmployeeForm,
      cancelDeleteAction,
      deleteEmployee,
      selectRow,
      checkboxRef,
      test,
    };
  },
};
</script>
