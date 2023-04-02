<template>
  <div
    :style="style"
    class="textfield"
    :type="type"
    :required="required ? true : false"
    :error="isValid ? null : true"
  >
    <label
      v-if="label"
      class="textfield__label"
      :class="tooltipText ? 'tooltip-container' : ''"
      >{{ label }}<BaseToolTip :text="tooltipText"
    /></label>
    <div
      class="textfield__input-wrapper"
      :class="type === 'radio' ? 'textfield__input-radio' : ''"
    >
      <input
        v-model="inpValue"
        v-if="type !== 'date' && type !== 'radio'"
        v-on:blur="validateOnBlur"
        v-on:focus="removeValidate"
        class="textfield__input"
        :placeholder="placeholder"
        :tabindex="tabindex"
      />
      <input
        v-model="inpValue"
        v-if="type === 'date'"
        class="textfield__input"
        placeholder="dd/mm/yyyy"
        type="date"
        :tabindex="tabindex"
      />
      <div class="radio-group" v-if="type === 'radio'">
        <div class="radio-items" v-for="item in radioList" :key="item.text">
          <input
            v-model="inpValue"
            :value="item.value"
            type="radio"
            :name="name"
            :tabindex="tabindex"
            :checked="item.value === inpValue"
          />
          <label>{{ item.text }}</label>
        </div>
      </div>
      <div v-if="icon" class="textfield__input-icon-container"></div>
      <div v-if="errorMsg" class="textfield__error-message">{{ errorMsg }}</div>
    </div>
  </div>
</template>
<script>
import { ref } from "vue";
import BaseToolTip from "./BaseToolTip.vue";
import { ACCOUNTING_TEXT } from "@/helpers/resources";
export default {
  name: "BaseTextField",
  props: {
    label: { default: "" },
    placeholder: { default: "" },
    icon: { default: false },
    type: { default: "text" },
    name: { default: "" },
    radioList: { default: [] },
    style: { default: "" },
    required: { default: false },
    value: {},
    tabindex: {},
    tooltipText: {},
    isSubmitted: {},
  },
  setup(props) {
    //#region state declarations
    const inpValue = ref(props.value ? props.value : "");
    const errorMsg = ref("");
    const isValid = ref(true);
    //#endregion
    //#region methods declaration
    const validateOnBlur = (e) => {
      if (
        e.target.parentNode.parentNode.getAttribute("required") === "true" &&
        !inpValue.value.trim()
      ) {
        e.target.parentNode.parentNode.setAttribute("error", true);
        errorMsg.value = ACCOUNTING_TEXT.VI.validateText;
      }
    };
    const removeValidate = (e) => {
      e.target.parentNode.parentNode.removeAttribute("error");
      errorMsg.value = "";
    };
    //#endregion
    return {
      inpValue,
      validateOnBlur,
      removeValidate,
      isValid,
      errorMsg,
    };
  },
  watch: {
    inpValue(newValue) {
      this.$emit("fieldChange", { [this.$props.name]: newValue });
    },
    value(newValue) {
      this.inpValue = newValue;
    },
    isSubmitted(newVal) {
      if (newVal) {
        if (!this.inpValue && this.$props.required) {
          this.isValid = false;
        }
      }
    },
  },

  components: { BaseToolTip },
};
</script>
