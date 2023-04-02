<template>
  <div ref="toastRef" class="toast" :class="`toast--${type}`">
    <div id="toast__icon"></div>
    <div class="toast__content">
      <p class="toast__msg">
        <span class="toast__title"
          >{{
            type == "error"
              ? "Lỗi"
              : type == "success"
              ? "Thành công"
              : type == "info"
              ? "Thông tin"
              : "Cảnh báo"
          }}!</span
        >
        {{ text }}
      </p>
      <!-- <div class="toast__action-container">
          <p class="toast__action">Hoàn tác</p>
          <img src="./assets/icon/x.svg" class="toast__action-icon" />
        </div> -->
    </div>
  </div>
</template>
<script>
import store from "@/store";

export default {
  name: "BaseToast",
  props: ["text", "type"],
  mounted() {
    this.$refs.toastRef.classList.add("comein");
    setTimeout(() => {
      store.commit("shiftToast");
    }, 2000);
  },
};
</script>
