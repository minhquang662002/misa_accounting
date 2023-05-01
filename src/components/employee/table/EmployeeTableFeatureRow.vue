<template>
  <Teleport to="#import-modal">
    <EmployeeImportModal v-if="isImportModalShown" />
  </Teleport>
  <BaseDialog
    v-if="isDialogShown"
    :text="$t('deleteManyEmployeeWarning')"
    :cancelText="$t('words.no')"
    :continueText="$t('words.yes')"
    type="warning"
    @cancelAction="isDialogShown = false"
    @continueAction="deleteSelectedRows"
  />
  <div class="table__feature-row">
    <div v-if="rowsSelected.length > 1" class="table__feature-delete-container">
      <p class="total-selected">
        {{ $t("words.selected") }} <b>{{ rowsSelected.length }}</b>
      </p>
      <p class="drop-all" @click="dropAllCheckBoxes">
        {{ $t("words.deselect") }}
      </p>
      <p class="select-all" @click="selectAllCheckboxes">
        {{ $t("words.selectAll") }}
      </p>
      <div @click="isDialogShown = true">
        <BaseButton type="secondary" :text="$t('words.delete')" />
      </div>
    </div>
    <div
      v-if="!rowsSelected.length && Object.keys(filters).length > 0"
      class="table__feature-filter-container"
    >
      <div
        class="selected__filter-container"
        v-for="filter in Object.keys(filters)"
        :key="filter"
      >
        <p class="filter__quote">
          {{ $t(`headers.${filter}`) }}
          {{
            convertOperator(
              filters[filter].slice(-2),
              filters[filter].substring(0, filters[filter].length - 2)
            )
          }}
        </p>
        <div class="remove-filter-btn" @click="removeFilter(filter)"></div>
      </div>
      <div class="remove-all-filter-btn" @click="removeAllFilter">
        {{ $t("words.removeFilters") }}
      </div>
    </div>
    <div class="table__feature-container">
      <BaseTextField
        :placeholder="$t('words.searchByCodeAndName')"
        :value="keyword"
        name="search"
        @fieldChange="updateSearch($event)"
      />
      <div
        @click="refreshTable"
        class="table__refresh-icon tooltip-container"
        v-showTooltip="$t('words.refetchData')"
      ></div>
      <div
        class="table__excel-icon tooltip-container"
        @click="exportExcel"
        v-showTooltip="$t('words.exportExcel')"
      ></div>
      <div
        class="table__setting-icon tooltip-container"
        v-showTooltip="$t('words.modifyDisplaySettings')"
        @click="showSettings"
      ></div>
      <div @click="showEmployeeForm">
        <BaseButton :text="$t('words.add')" type="primary" />
      </div>
      <div @click="showImportModal">
        <BaseButton text="add excel" type="primary" />
      </div>
    </div>
  </div>
  <EmployeeTableSettings
    v-if="isSettingsShown"
    @updateDisplaySetting="updateDisplaySetting($event)"
    @closeSettings="closeSettings"
  />
</template>
<script>
import { ref } from "vue";
import { TABLE_HEADERS, convertOperator } from "@/helpers/constants";
import { exportToExcel } from "@/helpers/api";
import EmployeeTableSettings from "./EmployeeTableSettings.vue";
import EmployeeImportModal from "../modals/EmployeeImportModal.vue";
export default {
  name: "EmployeeTableFeatureRow",
  props: ["rowsSelected", "keyword", "filters"],
  emits: [
    "refreshTable",
    "showEmployeeForm",
    "dropAllCheckBoxes",
    "selectAllCheckboxes",
    "deleteSelectedRows",
    "updateSearch",
    "removeFilter",
    "removeAllFilter",
    "updateDisplaySetting",
  ],
  setup(props, { emit }) {
    const isDialogShown = ref(false);
    const isSettingsShown = ref(false);
    const isImportModalShown = ref(false);
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
      isDialogShown.value = false;
    };
    const updateSearch = (e) => {
      emit("updateSearch", e.search);
    };
    const removeAllFilter = () => {
      emit("removeAllFilter");
    };
    const removeFilter = (e) => {
      emit("removeFilter", e);
    };
    const showSettings = () => {
      isSettingsShown.value = true;
    };
    const updateDisplaySetting = (e) => {
      emit("updateDisplaySetting", e);
      isSettingsShown.value = false;
    };
    const closeSettings = () => {
      isSettingsShown.value = false;
    };

    const exportExcel = async () => {
      await exportToExcel(props.keyword, {
        headers:
          JSON.parse(localStorage.getItem("displaySettings"))
            .filter((item) => item.isShown)
            .map((item) => ({
              headerName: item.headerName,
              model: item.model,
              align: item.className[0].split("--")[1],
              width: item.width,
            })) || TABLE_HEADERS,
        filterList: props.filters,
      });
    };

    const showImportModal = () => {
      isImportModalShown.value = true;
    };

    //#region
    return {
      isDialogShown,
      isSettingsShown,
      isImportModalShown,
      showImportModal,
      updateSearch,
      refreshTable,
      showEmployeeForm,
      dropAllCheckBoxes,
      selectAllCheckboxes,
      deleteSelectedRows,
      convertOperator,
      removeAllFilter,
      removeFilter,
      showSettings,
      updateDisplaySetting,
      closeSettings,
      exportExcel,
    };
  },
  components: { EmployeeTableSettings, EmployeeImportModal },
};
</script>
