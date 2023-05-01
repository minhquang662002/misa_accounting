<template>
  <BaseDialog
    v-if="isDialogShown"
    align="center"
    innerAlign="center"
    :text="errorText"
    :type="dialogType"
    continueText="OK"
    @continueAction="
      () => {
        isDialogShown = false;
        errorText = '';
      }
    "
  />

  <BaseDialog
    v-if="isCloseDialogShown"
    type="info"
    align="between"
    :text="$t('warningDialog.changeText')"
    :cancelText="$t('words.no')"
    :continueText="$t('words.yes')"
    @cancelAction="
      () => {
        isCloseDialogShown = false;
        $emit('closeForm');
      }
    "
    @continueAction="
      () => {
        isCloseDialogShown = false;
        mode === ACCOUNTING_ENUM.MODE.UPDATE
          ? updateEmployeeAndClose()
          : createNewEmployeeAndClose();
      }
    "
  >
    <div @click="isCloseDialogShown = false">
      <BaseButton :text="$t('words.cancel')" type="secondary" />
    </div>
  </BaseDialog>

  <div class="popup-overlay">
    <div class="popup user-dialog" v-trapFocus>
      <div class="popup-top">
        <EmployeeFormHeader @closeForm="closeForm" :mode="mode" />
        <EmployeeFormBody
          :formInfo="formInfo"
          :isSubmitted="isSubmitted"
          @updateInfoState="updateInfoState($event)"
        />
      </div>
      <EmployeeFormFooter
        :mode="mode"
        @closeForm="closeForm"
        @createNewEmployeeAndContinue="createNewEmployeeAndContinue"
        @createNewEmployeeAndClose="createNewEmployeeAndClose"
        @updateEmployeeAndContinue="updateEmployeeAndContinue"
        @updateEmployeeAndClose="updateEmployeeAndClose"
      />
    </div>
  </div>
</template>
<script>
import EmployeeFormHeader from "./EmployeeFormHeader.vue";
import EmployeeFormBody from "./EmployeeFormBody.vue";
import EmployeeFormFooter from "./EmployeeFormFooter.vue";
import { getGeneratedCode } from "@/helpers/api";
import store from "@/store";
import { ref } from "vue";
import { createNewEmployee } from "@/helpers/api";
import { updateEmployee } from "@/helpers/api";
import { ACCOUNTING_ENUM } from "@/helpers/resources";
import { showToast } from "@/helpers/constants";
import { useI18n } from "vue-i18n";

export default {
  name: "EmployeeForm",
  props: ["isFormOpen", "formDetail", "type"],
  emits: ["closeForm", "addNewEmployee", "refreshTable"],
  components: { EmployeeFormHeader, EmployeeFormBody, EmployeeFormFooter },

  setup(props, { emit }) {
    //#region state declaration
    const { t } = useI18n();
    const formInfo = ref(props?.formDetail?.data || {});
    const mode = ref(props?.formDetail?.mode || ACCOUNTING_ENUM.MODE.ADD);
    const isDialogShown = ref(false);
    const isCloseDialogShown = ref(false);
    const errorText = ref("");
    const dialogType = ref("");
    const isSubmitted = ref(false);
    let isChanged = false;

    // onMounted(async () => {
    //   if (mode.value === ACCOUNTING_ENUM.MODE.ADD) {
    //     const newEmployeeCode = await getGeneratedCode();
    //     formInfo.value = { employeeCode: newEmployeeCode };
    //   }
    // });

    //#endregion

    //#region method declarations

    const closeForm = () => {
      if (isChanged) {
        if (
          formInfo.value !== props?.formDetail?.data &&
          Object.values(formInfo.value).some((vl) => vl !== null && vl !== "")
        ) {
          isCloseDialogShown.value = true;
        } else {
          emit("closeForm");
        }
      } else {
        emit("closeForm");
      }
    };

    /**
     * feature: validate fields on submit
     * author: Le Minh Quang
     * date: 27/03/2023
     */

    const validateOnSubmit = () => {
      isSubmitted.value = !isSubmitted.value;
      if (!formInfo.value.employeeCode?.trim()) {
        errorText.value = t("requiredEmployeeCodeError");
      } else if (!formInfo.value.fullName?.trim()) {
        errorText.value = t("requiredFullNameError");
      } else if (!formInfo.value.departmentID?.trim()) {
        errorText.value = t("requiredDepartmentError");
      }

      if (
        !formInfo.value.employeeCode?.trim() ||
        !formInfo.value.fullName?.trim() ||
        !formInfo.value.departmentID?.trim()
      ) {
        dialogType.value = "error";
        isDialogShown.value = true;
        return false;
      }

      return true;
    };

    /**
     * feature: create new employee and continue form to create another one
     * author: Le Minh Quang
     * date: 27/03/2023
     */

    const createNewEmployeeAndContinue = async () => {
      if (validateOnSubmit()) {
        store.commit("showLoading");
        try {
          await createNewEmployee(formInfo.value);
          showToast("success", t("successToast.addEmployee"));
          emit("refreshTable");
          const newEmployeeCode = await getGeneratedCode();
          formInfo.value = { employeeCode: newEmployeeCode };
          mode.value = ACCOUNTING_ENUM.MODE.ADD;
        } catch (error) {
          isDialogShown.value = true;
          errorText.value = error.response.data.userMsg;
          dialogType.value =
            error.response.status === 400 ? "warning" : "error";
        }
        store.commit("hideLoading");
      }
    };

    /**
     * feature: create new employee and close form
     * author: Le Minh Quang
     * date: 27/03/2023
     */

    const createNewEmployeeAndClose = async () => {
      if (validateOnSubmit()) {
        store.commit("showLoading");
        try {
          await createNewEmployee(formInfo.value);
          showToast("success", t("successToast.addEmployee"));
          emit("refreshTable");
          emit("closeForm");
        } catch (error) {
          if (error.response.status === 400) {
            isDialogShown.value = true;
            errorText.value = error.response.data.userMsg;
            dialogType.value = "warning";
          } else {
            isDialogShown.value = true;
            errorText.value = error.response.data.userMsg;
            dialogType.value =
              error.response.status === 400 ? "warning" : "error";
          }
        }
        store.commit("hideLoading");
      }
    };

    /**
     * feature: update employee and continue form to create new one
     * author: Le Minh Quang
     * date: 27/03/2023
     */

    const updateEmployeeAndContinue = async () => {
      store.commit("showLoading");
      try {
        await updateEmployee(formInfo.value.employeeID, formInfo.value);
        const newEmployeeCode = await getGeneratedCode();
        mode.value = ACCOUNTING_ENUM.MODE.ADD;
        showToast("success", t("successToast.updateEmployee"));
        emit("refreshTable");
        formInfo.value = { employeeCode: newEmployeeCode };
      } catch (error) {
        if (error.response.status === 400) {
          isDialogShown.value = true;
          errorText.value = error.response.data.userMsg;
          dialogType.value = "warning";
        } else {
          isDialogShown.value = true;
          errorText.value = error.response.data.userMsg;
          dialogType.value =
            error.response.status === 400 ? "warning" : "error";
        }
      }
      store.commit("hideLoading");
    };

    /**
     * feature: update employee and close form
     * author: Le Minh Quang
     * date: 27/03/2023
     */

    const updateEmployeeAndClose = async () => {
      store.commit("showLoading");
      try {
        await updateEmployee(formInfo.value.employeeID, formInfo.value);
        showToast("success", t("successToast.updateEmployee"));
        emit("refreshTable");
        emit("closeForm");
      } catch (error) {
        isDialogShown.value = true;
        errorText.value = error.response.data.userMsg;
        dialogType.value = error.response.status === 400 ? "warning" : "error";
      }
      store.commit("hideLoading");
    };

    /**
     *
     * @param {*} data
     * feature: update form info state
     * author: Le Minh Quang
     * date: 27/03/2023
     */

    const updateInfoState = (data) => {
      isChanged = true;
      formInfo.value = { ...formInfo.value, ...data };
    };

    //#endregion

    //#region providing states and methods

    return {
      formInfo,
      mode,
      isDialogShown,
      isCloseDialogShown,
      errorText,
      isSubmitted,
      ACCOUNTING_ENUM,
      dialogType,
      closeForm,
      validateOnSubmit,
      createNewEmployeeAndContinue,
      createNewEmployeeAndClose,
      updateEmployeeAndContinue,
      updateEmployeeAndClose,
      updateInfoState,
    };

    //#endregion
  },
};
</script>
