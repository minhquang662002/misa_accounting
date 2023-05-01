<template>
  <div class="dialog-container" :class="type" @click.prevent="closeDialog">
    <div class="dialog-overlay"></div>
    <div class="dialog">
      <div class="dialog-description">
        <div class="dialog-icon"></div>
        {{ text }}
      </div>
      <div
        class="dialog-footer"
        :style="
          align === 'center'
            ? 'justify-content: center'
            : align === 'between'
            ? 'justify-content: space-between'
            : 'justify-content: flex-end'
        "
      >
        <slot></slot>
        <div
          style="display: flex; gap: 10px; flex-grow: 1"
          :style="
            innerAlign === 'between'
              ? 'justify-content: space-between'
              : innerAlign === 'center'
              ? 'justify-content: center'
              : 'justify-content: flex-end'
          "
        >
          <div v-if="cancelText" @click="cancelAction">
            <BaseButton type="secondary" :text="cancelText"> </BaseButton>
          </div>
          <div v-if="continueText" @click="continueAction">
            <BaseButton type="primary" :text="continueText"> </BaseButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "BaseDialog",
  props: ["text", "cancelText", "continueText", "type", "align", "innerAlign"],
  emits: ["continueAction", "cancelAction"],
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
