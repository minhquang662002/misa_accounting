<template>
  <span id="edit-text" @click="showEmployeeForm">{{ $t("words.modify") }}</span>
  <span @click="showMenu" class="triangle-dropdown"></span>
</template>
<script>
export default {
  name: "EmployeeTableFeatureCellButton",
  props: ["data", "isMenuShown"],
  emits: ["showEmployeeForm", "showMenu", "updateMenu"],
  setup(props, { emit }) {
    const showEmployeeForm = () => {
      emit("showEmployeeForm");
    };
    const showMenu = (e) => {
      e.stopPropagation();

      if (props.isMenuShown) {
        emit("showMenu", false);
      } else {
        emit("showMenu", true);
        emit("updateMenu", {
          x: e.x,
          y: e.y,
          data: props.data,
          isLast: !e.target.parentNode.parentNode.nextElementSibling,
        });
      }
    };

    return { showMenu, showEmployeeForm };
  },
};
</script>
