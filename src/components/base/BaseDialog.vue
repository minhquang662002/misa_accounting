<template>
  <div class="dialog-container" :class="type" @click.prevent="closeDialog">
    <div class="dialog-overlay"></div>
    <div class="dialog">
      <!-- <div class="dialog-header">
        <div class="dialog-header__title">{{ title }}</div>
        <div class="dialog-header__icon--close"></div>
      </div> -->
      <div class="dialog-description">
        <div class="dialog-icon"></div>
        {{ text }}
      </div>
      <div class="dialog-footer">
        <slot></slot>
        <div style="display: flex; gap: 10px; justify-self: flex-end">
          <button
            v-if="cancelText"
            class="button button--secondary"
            @click="cancelAction"
          >
            {{ cancelText }}
          </button>
          <button v-if="continueText" class="button" @click="continueAction">
            {{ continueText }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "BaseDialog",
  props: ["title", "text", "cancelText", "continueText", "type"],
  setup(_, { emit }) {
    //#region method declarations
    /**
     * feature: emit to parent when click on continue button
     * author: Le Minh Quang
     * date: 29/03/2023
     */
    const continueAction = () => {
      emit("continueAction");
    };
    /**
     * feature: emit to parent when click on cancel button
     * author: Le Minh Quang
     * date: 29/03/2023
     */
    const cancelAction = () => {
      emit("cancelAction", false);
    };
    //#endregion
    return { continueAction, cancelAction };
  },
};
</script>
