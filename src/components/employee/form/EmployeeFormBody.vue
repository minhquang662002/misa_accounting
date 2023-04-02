<template>
  <div class="user-dialog__body">
    <!--Row 1-->
    <div class="user-dialog__row" style="gap: 20px">
      <div class="user-dialog__column">
        <div class="user-dialog__row">
          <BaseTextField
            label="Mã"
            placeholder="Mã"
            required="true"
            :value="formInfo?.EmployeeCode"
            name="EmployeeCode"
            tabindex="3"
            :isSubmitted="isSubmitted"
            @fieldChange="updateInfoState($event)"
          />
          <BaseTextField
            label="Tên"
            placeholder="Họ và tên"
            required="true"
            :value="formInfo?.FullName"
            name="FullName"
            tabindex="4"
            :isSubmitted="isSubmitted"
            @fieldChange="updateInfoState($event)"
          />
        </div>
        <div class="user-dialog__row">
          <BaseDropDownList
            label="Đơn vị"
            placeholder="Đơn vị"
            tabindex="5"
            name="DepartmentName"
            queryString="Departments"
            idString="DepartmentId"
            :value="formInfo?.DepartmentName"
            :isSubmitted="isSubmitted"
            @fieldChange="updateInfoState($event)"
            required="true"
          />
        </div>
        <div class="user-dialog__row">
          <BaseDropDownList
            label="Chức danh"
            placeholder="Chức danh"
            tabindex="6"
            name="PositionName"
            queryString="Positions"
            idString="PositionId"
            :value="formInfo?.PositionName"
            @fieldChange="updateInfoState($event)"
          />
        </div>
      </div>
      <div class="user-dialog__column">
        <div class="user-dialog__row">
          <BaseTextField
            label="Ngày sinh"
            placeholder="Ngày sinh"
            type="date"
            name="DateOfBirth"
            :value="
              formInfo?.DateOfBirth ? formInfo?.DateOfBirth.split('T')[0] : null
            "
            @fieldChange="updateInfoState($event)"
            tabindex="7"
          />
          <BaseTextField
            label="Giới tính"
            type="radio"
            name="Gender"
            :radioList="[
              { value: 0, text: 'Nữ' },
              { value: 1, text: 'Nam' },
              { value: 2, text: 'Khác' },
            ]"
            :value="formInfo?.Gender"
            @fieldChange="updateInfoState($event)"
            tabindex="8"
          />
        </div>
        <!--##-->
        <div class="user-dialog__row">
          <BaseTextField
            label="Số CMND"
            placeholder="Số CMND"
            :value="formInfo?.IdentityNumber"
            name="IdentityNumber"
            tooltipText="Số chứng minh nhân dân"
            tabindex="9"
            @fieldChange="updateInfoState($event)"
          />

          <BaseTextField
            label="Ngày cấp"
            placeholder="Ngày cấp"
            type="date"
            tabindex="10"
            @fieldChange="updateInfoState($event)"
          />
        </div>
        <div class="user-dialog__row">
          <BaseTextField
            placeholder="Nơi cấp"
            label="Nơi cấp"
            tabindex="11"
            name="IdentityPlace"
            :value="formInfo?.IdentityPlace"
            @fieldChange="updateInfoState($event)"
          />
        </div>
      </div>
    </div>
    <!--##-->
    <div class="user-dialog__row">
      <BaseTextField
        label="Địa chỉ"
        placeholder="Địa chỉ"
        :value="formInfo?.Address"
        name="Address"
        @fieldChange="updateInfoState($event)"
        tabindex="12"
      />
    </div>
    <!--##-->
    <div class="user-dialog__row">
      <BaseTextField
        label="ĐT di động"
        placeholder="Điện thoại di động"
        style="width: 200px"
        :value="formInfo?.PhoneNumber"
        name="PhoneNumber"
        tooltipText="Điện thoại di động"
        @fieldChange="updateInfoState($event)"
        tabindex="13"
      />
      <BaseTextField
        label="ĐT cố định"
        placeholder="Điện thoại cố định"
        style="width: 200px"
        :value="formInfo?.PhoneNumber"
        name="PhoneNumber"
        tooltipText="Điện thoại cố định"
        tabindex="14"
      />
      <BaseTextField
        label="Email"
        placeholder="Email"
        style="width: 200px"
        :value="formInfo?.Email"
        @fieldChange="updateInfoState($event)"
        tabindex="15"
      />
    </div>
    <!--##-->
    <div class="user-dialog__row">
      <BaseTextField
        label="Tài khoản ngân hàng"
        placeholder="Tài khoản ngân hàng"
        style="width: 200px"
        tabindex="16"
      />
      <BaseTextField
        label="Tên ngân hàng"
        placeholder="Tên ngân hàng"
        style="width: 200px"
        tabindex="17"
      />
      <BaseTextField
        label="Chi nhánh"
        placeholder="Chi nhánh"
        style="width: 200px"
        tabindex="18"
      />
    </div>
  </div>
</template>
<script>
export default {
  name: "EmployeeFormBody",
  props: ["formInfo", "isSubmitted"],
  emits: ["updateInfoState"],
  setup(_, { emit }) {
    const updateInfoState = (e) => {
      emit("updateInfoState", e);
    };

    return { updateInfoState };
  },
};
</script>
