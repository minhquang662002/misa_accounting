<template>
  <div class="dropdownlist" :required="required" :error="isValid ? null : true">
    <label v-if="label" class="textfield__label">{{ label }}</label>
    <div
      class="textfield__input-wrapper"
      @click="focusInput($event)"
      v-click-outside="() => (isMenuDisplayed = false)"
    >
      <input
        class="textfield__input"
        ref="inpFocus"
        v-model="selectedValue"
        :placeholder="placeholder"
        :tabindex="tabindex"
        @blur="validateOnBlur"
        @focus="getListData"
      />
    </div>
    <div v-if="isMenuDisplayed" class="dropdown-menu-wrapper">
      <div class="dropdown-menu">
        <div
          v-for="item in list.values"
          class="dropdown-items"
          :key="item[name]"
          :value="item[name]"
          @click="() => selectOption(item)"
        >
          {{ item[name] }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { ref } from "vue";
import { baseUrl } from "@/helpers/constants";
import axios from "axios";
import { ACCOUNTING_ENUM } from "@/helpers/resources";

export default {
  name: "BaseDropDownList",
  props: [
    "label",
    "placeholder",
    "errorMsg",
    "tabindex",
    "name",
    "value",
    "isSubmitted",
    "required",
    "queryString",
    "idString",
    "defautList",
    "mode",
  ],
  emits: ["changeRowsPerPage", "fieldChange"],

  setup(props, { emit }) {
    //#region state declaration
    let selectedValue = ref(props.value ? props.value : "");
    let isMenuDisplayed = ref(false);
    let list = ref([]);
    const isValid = ref(true);
    //#endregion

    //#region method declarations
    /**
     * feature: validate required field when blur out of input
     * @param {*} e
     * author: Le Minh Quang
     * date: 29/03/2023
     */
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
      if (props.mode !== ACCOUNTING_ENUM.DROPDOWN.PAGINATION) {
        selectedValue.value = value[props.name];
        isMenuDisplayed.value = false;
        isValid.value = true;
        emit("fieldChange", {
          [props.name]: selectedValue,
          [props.idString]: value[props.idString],
        });
      } else {
        isMenuDisplayed.value = false;
        selectedValue.value = value[props.name];
        emit("changeRowsPerPage", selectedValue.value);
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
        list.value.values = res.data;
      } else {
        list.value.values = props.defautList;
      }
    };

    //#endregion

    return {
      selectedValue,
      isMenuDisplayed,
      isValid,
      selectOption,
      validateOnBlur,
      getListData,
      list,
    };
  },

  methods: {
    focusInput() {
      this.isMenuDisplayed = !this.isMenuDisplayed;
      this.$refs.inpFocus.focus();
      this.isValid = true;
    },
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
