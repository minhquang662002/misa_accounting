<template>
  <thead class="table-content__header">
    <tr>
      <th
        class="align--center table__header-checkbox"
        style="position: sticky; top: 0; left: 0"
      >
        <input
          type="checkbox"
          @click="selectAll"
          :value="isSelectedAll"
          :checked="isSelectedAll"
        />
      </th>
      <th
        v-for="header in headerList.filter((item) => item.isShown)"
        :class="header.className"
        :style="{
          minWidth: header.width + 'px',
          position: 'sticky',
          top: 0,
          zIndex: header.sticky ? 3 : 'unset',
          left: header.sticky
            ? calculateWidth(
                headerList,
                headerList
                  .filter((item) => item.isShown && item.sticky)
                  .findIndex((item) => item.model == header.model)
              ) + 'px'
            : '',
        }"
        :key="header.headerName"
        v-showTooltip="header.tooltipText"
      >
        <span>{{ header.headerName }}</span>
        <BaseFilterButton
          :filters="filters"
          @updateFilter="updateFilter($event)"
          :model="header.model"
          @removeFilter="removeFilter($event)"
          v-if="header.className.includes('filter-container')"
        />
      </th>
      <th
        class="align--center table__header-feature"
        style="position: sticky; top: 0; left: 0"
      >
        {{ $t("words.feature") }}
      </th>
    </tr>
  </thead>
</template>
<script>
import { calculateWidth } from "@/helpers/constants";
export default {
  name: "EmployeeTableContentHeader",
  props: ["isSelectedAll", "deselectAll", "filters", "headerList"],
  emits: ["updateFilter", "removeFilter", "selectAll", "deselectAll"],
  setup(props, { emit }) {
    const selectAll = () => {
      if (props.isSelectedAll) {
        emit("deselectAll");
      } else {
        emit("selectAll");
      }
    };

    const updateFilter = (e) => {
      emit("updateFilter", e);
    };

    const removeFilter = (e) => {
      emit("removeFilter", e);
    };

    return { selectAll, updateFilter, removeFilter, calculateWidth };
  },
};
</script>
