<template>
  <div class="popup-header user-dialog__header">
    <div class="user-dialog__header--left">
      <h3 class="popup-header__title">
        {{ mode == ACCOUNTING_ENUM.MODE.UPDATE ? "Sửa" : "Thêm" }} thông tin
        nhân viên
      </h3>
      <input type="checkbox" tabindex="1" />
      <label>Là khách hàng</label>
      <input type="checkbox" tabindex="2" />
      <label>Là nhà cung cấp</label>
    </div>
    <div class="user-dialog__header--right">
      <div class="info-icon"></div>
      <div class="close-icon" @click="closeForm"></div>
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
      emit("closeForm", true);
    };
    return { ACCOUNTING_ENUM, closeForm };
  },
};
</script>
