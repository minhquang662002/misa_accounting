<template>
  <div v-if="text" class="tooltip">
    <span>{{ text }}</span>
    <div class="tooltip-bg-fill"></div>
  </div>
</template>
<script>
export default {
  name: "BaseToolTip",
  props: ["text"],
};
</script>
