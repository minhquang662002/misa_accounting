<template>
  <div class="import-modal">
    <div class="import-modal__header">
      <div class="import-modal__header--top">
        <p class="import-modal__header__title">Nhập nhân viên từ Excel</p>
        <div></div>
      </div>
      <div class="import-modal__stepper">
        <div class="step">1</div>
        <div class="step-line"></div>
      </div>
    </div>
    <div class="import-modal__body">
      <div class="import-modal__body--left">
        <div>
          <div></div>
          <p class="file-input-title">
            <b>Chọn tệp Excel</b> <span>Dung lượng tối đa 20MB</span>
          </p>
        </div>
        <div class="input-file-box">
          <p class="input-file-box--hint">
            Kéo/ thả tệp vào đây hoặc bấm vào đây
          </p>
          <label for="upload" class="input-file-box__placeholder"></label>
          <input
            id="upload"
            type="file"
            style="display: none"
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          />
        </div>

        <div class="import-modal__body__input-info">
          <div>
            <label>Sheet chứa dữ liệu</label>
            <input />
          </div>
          <div>
            <label>Dòng tiêu đề là dòng số</label>
            <input />
          </div>
        </div>
        <div>
          <p>Phương thức nhập</p>
          <input type="radio" name="import-method" /> <label>Thêm mới</label>
          <br />
          <input type="radio" name="import-method" /> <label>Cập nhật</label>
        </div>
      </div>
      <div>
        <p>header</p>
        <ul>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </div>
    </div>
    <div class="import-modal__footer">
      <BaseButton type="secondary" text="Hủy" />
      <BaseButton type="primary" text="Tiếp tục" />
    </div>
  </div>
</template>
<script>
import { ref } from "vue";
export default {
  name: "EmployeeImportModal",
  setup() {
    const step = ref(1);
    return { step };
  },
};
</script>
