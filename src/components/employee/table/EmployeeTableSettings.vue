<template>
  <div class="table__settings">
    <div class="table__settings--header">
      <p>{{ $t("words.modifyDisplaySettings") }}</p>
      <div class=""></div>
    </div>
    <div class="table__settings--body">
      <div class="table__settings-feature--row">
        <div class="table__settings-input-wrapper">
          <input
            class="table__settings-input"
            :placeholder="$t('words.inputSearchTerm')"
          />
          <div class="table__settings-input-icon"></div>
        </div>
        <p @click="isDetailShown = true" class="table__settings-modify-btn">
          {{ $t("words.changeHeaderNameAndWidth") }}
        </p>
      </div>
      <div class="table__settings-table-container">
        <table>
          <thead>
            <tr>
              <th class="table__settings-checbox-header">
                <input
                  type="checkbox"
                  :checked="headerList.every((item) => item.isShown)"
                />
              </th>
              <th class="align--left">{{ $t("words.headerName") }}</th>
              <th v-if="isDetailShown" class="align--left">
                {{ $t("words.headerNameOnInterface") }}
              </th>
              <th v-if="isDetailShown" class="align--left">
                {{ $t("words.width") }}
              </th>
              <th v-if="isDetailShown" class="align--center">
                {{ $t("words.fixColumn") }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="header in TABLE_HEADERS" :key="header.model">
              <td class="align--center">
                <input
                  type="checkbox"
                  :checked="
                    headerList.some(
                      (item) =>
                        item.model == header.model && item.isShown == true
                    )
                  "
                  @change="
                    changeDisplayHeader(
                      header.model,
                      'isShown',
                      !headerList[
                        headerList.findIndex(
                          (item) => header.model == item.model
                        )
                      ].isShown
                    )
                  "
                />
              </td>
              <td class="align--left">
                {{ $t(`headers.${header.model}`) }}
              </td>
              <td
                v-if="isDetailShown"
                class="align--left"
                @click="makeEditable($event)"
              >
                <span>{{
                  $t(
                    `headers.${
                      headerList[
                        headerList.findIndex(
                          (item) => item.model == header.model
                        )
                      ].model
                    }`
                  )
                }}</span>
                <div class="textarea-container">
                  <textarea
                    v-model="
                      headerList[
                        headerList.findIndex(
                          (item) => item.model == header.model
                        )
                      ].headerName
                    "
                  ></textarea>
                </div>
              </td>
              <td
                v-if="isDetailShown"
                class="align--left"
                @click="makeEditable($event)"
              >
                <span>{{
                  headerList[
                    headerList.findIndex((item) => item.model == header.model)
                  ].width
                }}</span>
                <div class="textarea-container">
                  <textarea
                    v-model="
                      headerList[
                        headerList.findIndex(
                          (item) => item.model == header.model
                        )
                      ].width
                    "
                  ></textarea>
                </div>
              </td>
              <td class="align--center" v-if="isDetailShown">
                <input
                  type="checkbox"
                  :checked="
                    headerList.some(
                      (item) => item.model == header.model && item.sticky
                    )
                  "
                  @change="
                    changeDisplayHeader(
                      header.model,
                      'sticky',
                      !headerList[
                        headerList.findIndex(
                          (item) => header.model == item.model
                        )
                      ].sticky
                    )
                  "
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="table__settings-divider"></div>
    <div class="table__settings--footer">
      <div @click="closeSettings">
        <BaseButton type="secondary" :text="$t('words.cancel')" />
      </div>
      <div class="table__settings-btn-group--right">
        <div @click="setDefaultSettings" class="setting-default-btn">
          <BaseButton type="secondary" :text="$t('words.getDefaultTemplate')" />
        </div>
        <div @click="updateDisplaySetting">
          <BaseButton type="primary" :text="$t('words.store')" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { ref } from "vue";
import { TABLE_HEADERS } from "@/helpers/constants";

export default {
  name: "EmployeeTableSettings",
  emits: ["updateDisplaySetting", "closeSettings"],
  setup(_, { emit }) {
    const headerList = ref(
      localStorage.getItem("displaySettings")
        ? JSON.parse(localStorage.getItem("displaySettings"))
        : TABLE_HEADERS
    );
    const isDetailShown = ref(false);
    const changeDisplayHeader = (model, prop, value) => {
      headerList.value[
        headerList.value.findIndex((item) => item.model == model)
      ][prop] = value;
    };
    const updateDisplaySetting = () => {
      const nonStickyHeader = headerList.value.filter((item) => !item.sticky);
      const stickyHeader = headerList.value.filter((item) => item.sticky);
      const newHeaderList = [
        ...TABLE_HEADERS.reduce((arr, cur) => {
          if (stickyHeader.some((sticky) => cur.model == sticky.model)) {
            arr.push(stickyHeader.filter((item) => item.model == cur.model)[0]);
          }
          return arr;
        }, []),
        ...TABLE_HEADERS.reduce((arr, cur) => {
          if (nonStickyHeader.some((non) => non.model == cur.model)) {
            arr.push(
              nonStickyHeader.filter((item) => item.model == cur.model)[0]
            );
          }
          return arr;
        }, []),
      ];

      localStorage.setItem("displaySettings", JSON.stringify(newHeaderList));
      emit("updateDisplaySetting", newHeaderList);
    };
    const closeSettings = () => {
      emit("closeSettings");
    };
    const setDefaultSettings = () => {
      headerList.value = TABLE_HEADERS;
      localStorage.setItem("displaySettings", JSON.stringify(headerList.value));
    };

    const makeEditable = (e) => {
      if (![...e.currentTarget.classList].includes("editable")) {
        if (
          e.target !== e.currentTarget &&
          e.currentTarget.contains(e.target)
        ) {
          e.currentTarget.classList.add("editable");
        } else if (e.target === e.currentTarget) {
          e.target.classList.add("editable");
        }
      }
    };

    return {
      headerList,
      TABLE_HEADERS,
      isDetailShown,
      makeEditable,
      changeDisplayHeader,
      updateDisplaySetting,
      closeSettings,
      setDefaultSettings,
    };
  },
};
</script>
