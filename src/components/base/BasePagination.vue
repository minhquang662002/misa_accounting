<template>
  <div class="pagination">
    <BaseDropDownList
      :value="rowsPerPage"
      @changeRowsPerPage="changeRowsPerPage($event)"
      required="true"
      name="rowsPerPage"
      :readonly="true"
      :mode="ACCOUNTING_ENUM.DROPDOWN.PAGINATION"
      :defaultList="[
        { rowsPerPage: 20, value: 20 },
        { rowsPerPage: 50, value: 50 },
        { rowsPerPage: 100, value: 100 },
      ]"
    />
    <div class="pagination__page-list-container">
      <div
        class="pagination__prev-button"
        @click="clickPrevPage()"
        :class="{ disabled: page == 1 }"
      >
        {{ $t("words.previous") }}
      </div>
      <div class="pagination__page-list">
        <div
          class="pagination__page-button"
          :class="{ current: showPage == 1 }"
          @click="() => setPage(1)"
        >
          1
        </div>
        <div
          class="pagination__page-ellipsis"
          v-if="showPage > 2 && testLength > 3"
          @click="
            () => {
              if (testLength < 5) {
                showPage -= 3;
              } else {
                showPage -= 3;
              }
            }
          "
        >
          ...
        </div>
        <div style="display: flex" v-if="testLength > 2">
          <div
            class="pagination__page-button"
            :class="{
              current: page == showPage,
            }"
            @click="setPage(showPage)"
            v-if="showPage > 1 && Math.abs(testLength - showPage > 2)"
          >
            {{ showPage }}
          </div>
          <div
            v-if="
              (showPage + 1 != testLength || testLength - showPage < 2) &&
              testLength > 3 &&
              showPage + 1 != 1
            "
            class="pagination__page-button"
            :class="{
              current: testLength - showPage == 2 || showPage + 1 == page,
            }"
            @click="
              setPage(
                testLength - showPage <= 2 ? testLength - 2 : showPage + 1
              )
            "
          >
            {{ testLength - showPage <= 2 ? testLength - 2 : showPage + 1 }}
          </div>
          <div
            class="pagination__page-button"
            :class="{ current: page == testLength - 1 || showPage + 2 == page }"
            @click="
              setPage(
                showPage + 2 >= testLength ? testLength - 1 : showPage + 2
              )
            "
          >
            {{ showPage + 2 >= testLength ? testLength - 1 : showPage + 2 }}
          </div>
        </div>
        <div
          class="pagination__page-ellipsis"
          v-if="testLength - showPage > 2"
          @click="showPage = showPage + 3"
        >
          ...
        </div>
        <div
          class="pagination__page-button"
          v-if="testLength > 1"
          :class="{ current: page == testLength }"
          @click="() => setPage(testLength)"
        >
          {{ testLength }}
        </div>
      </div>
      <!-- 

      <div class="pagination__page-list">
        <div
          class="pagination__page-button-container"
          v-for="pageNumber in pageList"
          :key="pageNumber"
        >
          <div
            class="pagination__page-ellipsis"
            v-if="
              pageNumber == pageList.length && Math.abs(pageNumber - page) > 2
            "
          >
            ...
          </div>
          <div
            @click="setPage(pageNumber)"
            class="pagination__page-button"
            :class="{ current: page === pageNumber }"
            v-if="
              ((page == 2
                ? Math.abs(pageNumber - page) < 2
                : pageNumber - page <= 2 && pageNumber - page >= 0) ||
                pageNumber == pageList.length ||
                pageNumber == 1) &&
              (page === 3 ? (pageNumber - 2 !== 0 ? true : false) : true)
            "
          >
            {{ pageNumber }}
          </div>
          <div
            class="pagination__page-ellipsis"
            v-if="pageNumber == 1 && Math.abs(pageNumber - page) >= 2"
          >
            ...
          </div>
        </div>
      </div>

       -->
      <div
        class="pagination__next-button"
        @click="clickNextPage()"
        :class="{ disabled: page == testLength }"
      >
        {{ $t("words.next") }}
      </div>
    </div>
  </div>
</template>
<script>
import { ref, watch } from "vue";
import { ACCOUNTING_ENUM } from "@/helpers/resources";
export default {
  name: "BasePagination",
  props: ["rowsPerPage", "page", "total"],
  emits: ["setPage", "changeRowsPerPage"],
  setup(props, { emit }) {
    const testLength = ref(Math.ceil(props.total / props.rowsPerPage) || 0);
    const showPage = ref(props.page || 1);

    watch(
      () => props.total,
      (newVal) => {
        testLength.value = Math.ceil(newVal / props.rowsPerPage);
      }
    );

    watch(
      () => props.page,
      (newVal) => {
        showPage.value = newVal;
      }
    );

    watch(
      () => props.rowsPerPage,
      (newVal) => {
        testLength.value = Math.ceil(props.total / newVal);
      }
    );

    const setPage = (page) => {
      showPage.value = page;
      emit("setPage", page);
    };

    const clickPrevPage = () => {
      if (props.page > 1) {
        setPage(props.page - 1);
        showPage.value = props.page - 1;
      }
    };

    const clickNextPage = () => {
      if (props.page + 1 <= testLength.value) {
        setPage(props.page + 1);
        showPage.value = props.page + 1;
      }
    };

    const changeRowsPerPage = (e) => {
      emit("changeRowsPerPage", e);
    };

    return {
      showPage,
      setPage,
      clickPrevPage,
      clickNextPage,
      changeRowsPerPage,
      ACCOUNTING_ENUM,
      testLength,
    };
  },
};
</script>
