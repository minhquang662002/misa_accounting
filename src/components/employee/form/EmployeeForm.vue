<template>
  <BaseDialog
    v-if="isDialogShown"
    title="Lỗi"
    :text="`${errorText} không được
  để trống!`"
    type="error"
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
    title="Cảnh báo"
    type="info"
    :text="ACCOUNTING_TEXT.VI.warningDialog.changeText"
    cancelText="Không"
    continueText="Có"
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
      <BaseButton text="Hủy" type="secondary" />
    </div>
  </BaseDialog>

  <div class="popup-overlay" @click="closeForm(true)">
    <div class="popup user-dialog" @click.stop>
      <div class="popup-top">
        <EmployeeFormHeader @closeForm="closeForm($event)" :mode="mode" />
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
import { ref, onMounted } from "vue";
import { createNewEmployee } from "@/helpers/api";
import { updateEmployee } from "@/helpers/api";
import { ACCOUNTING_TEXT, ACCOUNTING_ENUM } from "@/helpers/resources";
import useFocusTrap from "@/utils/useFocusTrap";

export default {
  name: "EmployeeForm",
  props: ["isFormOpen", "formDetail", "type"],
  emits: ["closeForm", "addNewEmployee", "refreshTable"],
  components: { EmployeeFormHeader, EmployeeFormBody, EmployeeFormFooter },

  setup(props, { emit }) {
    //#region state declaration
    const { trapRef } = useFocusTrap();
    const formInfo = ref(props?.formDetail?.data || {});
    const mode = ref(props?.formDetail?.mode || 1);
    const isDialogShown = ref(false);
    const isCloseDialogShown = ref(false);
    const errorText = ref("");
    const isSubmitted = ref(false);

    onMounted(async () => {
      if (mode.value === ACCOUNTING_ENUM.MODE.ADD) {
        const newEmployeeCode = await getGeneratedCode();
        formInfo.value = { EmployeeCode: newEmployeeCode };
      }
    });

    //#endregion

    //#region method declarations

    const closeForm = (e) => {
      if (e === true) {
        if (formInfo.value !== props?.formDetail?.data) {
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
      if (!formInfo.value.EmployeeCode) {
        errorText.value = "Mã nhân viên";
        isDialogShown.value = true;
        return false;
      } else if (!formInfo.value.FullName) {
        errorText.value = "Tên";
        isDialogShown.value = true;
        return false;
      } else if (!formInfo.value.DepartmentName) {
        errorText.value = "Đơn vị";
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
          emit("refreshTable");
          const newEmployeeCode = await getGeneratedCode();
          formInfo.value = { EmployeeCode: newEmployeeCode };
          mode.value = 1;
        } catch (error) {
          store.commit("pushToast", {
            type: "error",
            text:
              error.response.data?.userMsg ||
              ACCOUNTING_TEXT.VI.errorToast.addEmployee,
          });
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
          emit("refreshTable");
          closeForm();
        } catch (error) {
          store.commit("pushToast", {
            type: "error",
            text:
              error.response.data?.userMsg ||
              ACCOUNTING_TEXT.VI.errorToast.addEmployee,
          });
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
        await updateEmployee(formInfo.value.EmployeeId, formInfo.value);
        const newEmployeeCode = await getGeneratedCode();
        mode.value = 1;
        emit("refreshTable");
        formInfo.value = { EmployeeCode: newEmployeeCode };
      } catch (error) {
        store.commit("pushToast", {
          type: "error",
          text:
            error.response.data?.userMsg ||
            ACCOUNTING_TEXT.VI.errorToast.updateEmployee,
        });
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
        await updateEmployee(formInfo.value.EmployeeId, formInfo.value);
        emit("refreshTable");
        closeForm();
      } catch (error) {
        store.commit("pushToast", {
          type: "error",
          text:
            error.response.data?.userMsg ||
            ACCOUNTING_TEXT.VI.errorToast.updateEmployee,
        });
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
      formInfo.value = { ...formInfo.value, ...data };
    };

    //#endregion

    //#region providing states and methods

    return {
      formInfo,
      mode,
      trapRef,
      isDialogShown,
      isCloseDialogShown,
      errorText,
      isSubmitted,
      ACCOUNTING_ENUM,
      ACCOUNTING_TEXT,
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
