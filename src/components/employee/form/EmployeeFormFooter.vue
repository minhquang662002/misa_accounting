<template>
  <div class="user-dialog__footer popup-footer">
    <div @click="closeForm">
      <BaseButton text="Hủy" type="secondary" tabindex="19" />
    </div>

    <div class="popup-footer__btn-group">
      <div
        @click="
          mode === ACCOUNTING_ENUM.MODE.UPDATE
            ? updateEmployeeAndClose()
            : createNewEmployeeAndClose()
        "
      >
        <BaseButton text="Cất" type="secondary" tabindex="20" />
      </div>
      <div
        @click="
          mode === ACCOUNTING_ENUM.MODE.UPDATE
            ? updateEmployeeAndContinue()
            : createNewEmployeeAndContinue()
        "
      >
        <BaseButton text="Cất và thêm" type="primary" tabindex="21" />
      </div>
    </div>
  </div>
</template>
<script>
import { ACCOUNTING_ENUM } from "@/helpers/resources";
export default {
  name: "EmployeeFormFooter",
  props: ["mode"],
  setup(_, { emit }) {
    const closeForm = () => {
      emit("closeForm");
    };

    const createNewEmployeeAndContinue = () => {
      emit("createNewEmployeeAndContinue");
    };

    const updateEmployeeAndContinue = () => {
      emit("updateEmployeeAndContinue");
    };

    const createNewEmployeeAndClose = () => {
      emit("createNewEmployeeAndClose");
    };

    const updateEmployeeAndClose = () => {
      emit("updateEmployeeAndClose");
    };

    return {
      ACCOUNTING_ENUM,
      closeForm,
      createNewEmployeeAndContinue,
      updateEmployeeAndClose,
      createNewEmployeeAndClose,
      updateEmployeeAndContinue,
    };
  },
};
</script>
