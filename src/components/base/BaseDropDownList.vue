<template>
  <div
    class="dropdownlist"
    :required="required"
    :error="isValid ? null : true"
    :class="
      mode === ACCOUNTING_ENUM.DROPDOWN.PAGINATION ? 'dropdown_paginate' : ''
    "
  >
    <label v-if="label" class="textfield__label">{{ label }}</label>
    <div class="textfield__input-wrapper" @click="focusInput($event)">
      <input
        class="textfield__input"
        ref="inpFocus"
        :value="`${selectedValue}${
          mode === ACCOUNTING_ENUM.DROPDOWN.PAGINATION
            ? ` ${$t('words.recordPerPage')}`
            : ''
        }`"
        :placeholder="placeholder"
        :readonly="readonly || null"
        :tabindex="tabindex"
        @blur="validateOnBlur"
        @input="showMenuOnInput($event)"
        @keydown="showMenuOnKeyPress($event)"
        v-focusOutDropDown="() => (isMenuDisplayed = false)"
      />
    </div>
    <div
      v-if="isMenuDisplayed"
      class="dropdown-menu-wrapper"
      v-click-outside="() => (isMenuDisplayed = false)"
      v-handleDropdownMenu="{
        fn: handleDropdownMenu,
        selectedValue,
        list,
        name,
        selectOption,
        hoverItem,
      }"
    >
      <div class="dropdown-menu">
        <div
          v-for="item in list"
          class="dropdown-items"
          :key="item[name]"
          :value="item[name]"
          :class="{
            'dropdown-items--selected': item[name] === selectedValue,
            'dropdown-items--hovering': hoverItem?.[name] === item[name],
          }"
          @click="() => selectOption(item)"
        >
          {{ item[name] }}
          {{
            ACCOUNTING_ENUM.DROPDOWN.PAGINATION == mode
              ? ` ${$t("words.recordPerPage")}`
              : ""
          }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { ref, watch, onMounted } from "vue";
import { baseUrl } from "@/helpers/constants";
import axios from "axios";
import { ACCOUNTING_ENUM } from "@/helpers/resources";

export default {
  name: "BaseDropDownList",
  props: [
    "label",
    "placeholder",
    "tabindex",
    "name",
    "value",
    "isSubmitted",
    "required",
    "queryString",
    "idString",
    "defaultList",
    "mode",
    "readonly",
  ],
  emits: ["changeRowsPerPage", "fieldChange"],

  setup(props, { emit }) {
    //#region state declaration
    let selectedValue = ref(props.value ? props.value : "");
    let isMenuDisplayed = ref(false);
    let list = ref([]);
    const isValid = ref(true);
    const hoverItem = ref(null);
    const inpFocus = ref();
    //#endregion

    watch(
      () => props.value,
      (newvl) => (selectedValue.value = newvl || "")
    );

    watch(
      () => selectedValue.value,
      (newVal) => {
        if (newVal) {
          hoverItem.value = list.value.filter((item) =>
            item[props.name].toLowerCase().includes(newVal)
          )[0];
        }
      }
    );

    //#region method declarations
    /**
     * feature: validate required field when blur out of input
     * @param {*} e
     * author: Le Minh Quang
     * date: 29/03/2023
     */

    const focusInput = async () => {
      inpFocus.value.focus();
      isValid.value = true;
      isMenuDisplayed.value = true;
    };

    const validateOnBlur = (e) => {
      if (props.mode !== ACCOUNTING_ENUM.DROPDOWN.PAGINATION) {
        if (
          e.target.parentNode.parentNode.getAttribute("required") === "true" &&
          !selectedValue.value.trim()
        ) {
          isValid.value = false;
        }
      }
    };
    /**
     * feature: handle value when click drop down option
     * @param {*} value
     * author: Le Minh Quang
     * date: 29/03/2023
     */
    const selectOption = (value) => {
      if (props.mode === ACCOUNTING_ENUM.DROPDOWN.FORM) {
        selectedValue.value = value[props.name];
        isMenuDisplayed.value = false;
        isValid.value = true;
        emit("fieldChange", {
          [props.name]: selectedValue,
          [props.idString]: value[props.idString],
        });
      } else if (props.mode === ACCOUNTING_ENUM.DROPDOWN.PAGINATION) {
        isMenuDisplayed.value = false;
        selectedValue.value = value[props.name];
        emit("changeRowsPerPage", selectedValue.value);
      } else if (props.mode === ACCOUNTING_ENUM.DROPDOWN.DEFAULT) {
        isMenuDisplayed.value = false;
        selectedValue.value = value.text;
        emit("fieldChange", value);
      }
    };

    /**
     * feature: get data of dropdown
     * author: Le Minh Quang
     * date: 29/03/2023
     */
    const getListData = async () => {
      if (props.queryString) {
        const res = await axios.get(`${baseUrl}/${props.queryString}`);
        list.value = res.data;
      } else {
        list.value = props.defaultList;
      }
    };

    /**
     * feature: show dropdown on input
     * author: Le Minh Quang
     * date: 29/03/2023
     */
    const showMenuOnInput = (e) => {
      isMenuDisplayed.value = true;
      selectedValue.value = e.target.value;
    };

    const showMenuOnKeyPress = async (e) => {
      if (e.key == "ArrowDown") {
        isMenuDisplayed.value = true;
      }
    };

    const handleDropdownMenu = (newVal) => {
      hoverItem.value = newVal;
    };

    onMounted(async () => {
      await getListData();
    });

    //#endregion

    return {
      showMenuOnInput,
      showMenuOnKeyPress,
      handleDropdownMenu,
      selectedValue,
      isMenuDisplayed,
      isValid,
      inpFocus,
      selectOption,
      validateOnBlur,
      hoverItem,
      getListData,
      focusInput,
      list,
      ACCOUNTING_ENUM,
    };
  },

  watch: {
    isSubmitted() {
      if (this.$props.required && !this.selectedValue) {
        this.isValid = false;
      }
    },
  },
};
</script>
