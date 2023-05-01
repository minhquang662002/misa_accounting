<template>
  <div class="popup-header user-dialog__header">
    <div class="user-dialog__header--left">
      <h3 class="popup-header__title">
        {{
          mode == ACCOUNTING_ENUM.MODE.UPDATE
            ? $t("form.updateFormTitle")
            : $t("form.createFormTitle")
        }}
      </h3>
      <input type="checkbox" tabindex="1" />
      <label>{{ $t("words.isEmployee") }}</label>
      <input type="checkbox" tabindex="2" />
      <label>{{ $t("words.isCustomer") }}</label>
    </div>
    <div class="user-dialog__header--right">
      <div
        class="info-icon tooltip-container"
        v-showTooltip="`${$t('words.help')} (F1)`"
      ></div>
      <div
        class="close-icon tooltip-container"
        v-showTooltip="`${$t('words.close')} (ESC)`"
        v-actionOnKeyPress="{ fn: closeForm, isCtrl: false, key: 27 }"
        @click="closeForm"
      ></div>
    </div>
  </div>
</template>
<script>
import { ACCOUNTING_ENUM } from "@/helpers/resources";
export default {
  name: "EmployeeFormHeader",
  props: ["mode"],
  setup(_, { emit }) {
    const closeForm = () => {
      emit("closeForm");
    };
    return { ACCOUNTING_ENUM, closeForm };
  },
};
</script>
