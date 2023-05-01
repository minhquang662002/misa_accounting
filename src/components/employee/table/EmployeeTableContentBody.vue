<template>
  <BaseDialog
    v-if="isDialogShown"
    :text="$t('deleteWarningText', { id: menuPos?.data?.employeeCode })"
    :cancelText="$t('words.no')"
    :continueText="$t('words.yes')"
    type="warning"
    @cancelAction="cancelDeleteAction"
    @continueAction="deleteEmployee(menuPos?.data?.employeeID)"
    innerAlign="between"
  />
  <div
    v-click-outside:triangle-dropdown="
      () => {
        isMenuShown = false;
      }
    "
    v-if="isMenuShown"
    class="table-feature-list-container"
    :style="{
      left: menuPos.x - 90 + 'px',
      top: (menuPos.isLast ? menuPos.y - 90 : menuPos.y + 8) + 'px',
    }"
  >
    <div class="table-feature-list">
      <div
        @click="
          () => {
            showEmployeeForm({
              data: menuPos?.data,
              mode: ACCOUNTING_ENUM.MODE.DUPLICATE,
            });
            isMenuShown = false;
          }
        "
      >
        {{ $t("words.duplicate") }}
      </div>
      <div
        @click="
          () => {
            isDialogShown = true;
            isMenuShown = false;
          }
        "
      >
        {{ $t("words.delete") }}
      </div>
      <div>{{ $t("words.stopUsing") }}</div>
    </div>
  </div>
  <tbody class="table-content__body">
    <tr
      v-for="data in employeeList"
      :key="data.employeeID"
      :class="
        rowsSelected.some((item) => item === data.employeeID)
          ? 'row--checked'
          : ''
      "
    >
      <td class="table__checkbox-cell align--center">
        <input
          v-model="test"
          :value="data.employeeID"
          type="checkbox"
          @click="() => selectRow(data.employeeID)"
        />
      </td>
      <td
        @dblclick="
          showEmployeeForm({ data, mode: ACCOUNTING_ENUM.MODE.UPDATE })
        "
        v-for="header in headerList.filter((item) => item.isShown)"
        :class="header.className"
        :key="header.className"
        :style="{
          position: header.sticky ? 'sticky' : 'unset',
          zIndex: header.sticky ? 2 : 'unset',
          left:
            calculateWidth(
              headerList,
              headerList
                .filter((item) => item.isShown && item.sticky)
                .findIndex((item) => item.model == header.model)
            ) + 'px',
        }"
        v-showTooltip="data[header.model]"
      >
        {{
          header.model.toLowerCase().includes("date")
            ? data[header.model]
              ? new Date(data[header.model]).toLocaleDateString("en-GB")
              : null
            : data[header.model]
        }}
      </td>
      <td class="align--center table__feature-cell">
        <EmployeeTableFeatureCellButton
          @showMenu="isMenuShown = $event"
          @updateMenu="menuPos = $event"
          @showEmployeeForm="
            showEmployeeForm({ data, mode: ACCOUNTING_ENUM.MODE.UPDATE })
          "
          :data="data"
          :isMenuShown="isMenuShown"
        />
      </td>
    </tr>
  </tbody>
</template>
<script>
import { ACCOUNTING_ENUM } from "@/helpers/resources";
import EmployeeTableFeatureCellButton from "./EmployeeTableFeatureCellButton.vue";
import { calculateWidth } from "@/helpers/constants";
import { ref, watch } from "vue";
export default {
  name: "EmployeeTableContentBody",
  props: ["employeeList", "rowsSelected", "headerList"],
  components: { EmployeeTableFeatureCellButton },
  emits: ["showEmployeeForm", "deleteEmployee", "selectRow"],
  setup(props, { emit }) {
    const isDialogShown = ref(false);
    const menuPos = ref(null);
    const isMenuShown = ref(false);
    const test = ref([]);
    //#region method declarations

    const selectRow = (data) => {
      emit("selectRow", data);
    };

    const showEmployeeForm = (data) => {
      console.log(data);
      emit("showEmployeeForm", data);
    };
    const cancelDeleteAction = () => {
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
      calculateWidth,
      ACCOUNTING_ENUM,
      test,
    };
  },
};
</script>
