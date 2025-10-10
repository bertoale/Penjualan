<template>
  <transition name="fade">
    <div
      v-if="visible"
      :class="[
        'fixed top-6 right-6 z-50 min-w-[250px] max-w-xs p-4 rounded-lg shadow-lg flex items-center',
        typeClass,
      ]"
      role="alert"
    >
      <svg
        v-if="type === 'success'"
        class="w-5 h-5 mr-3 text-green-600"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fill-rule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clip-rule="evenodd"
        />
      </svg>
      <svg
        v-else-if="type === 'error'"
        class="w-5 h-5 mr-3 text-red-600"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fill-rule="evenodd"
          d="M18 10A8 8 0 11 2 10a8 8 0 0116 0zm-7-4a1 1 0 10-2 0v4a1 1 0 002 0V6zm-1 8a1 1 0 100-2 1 1 0 000 2z"
          clip-rule="evenodd"
        />
      </svg>
      <svg
        v-else-if="type === 'info'"
        class="w-5 h-5 mr-3 text-blue-600"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"
        />
      </svg>
      <svg
        v-else-if="type === 'warning'"
        class="w-5 h-5 mr-3 text-yellow-600"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fill-rule="evenodd"
          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
          clip-rule="evenodd"
        />
      </svg>
      <div>
        <span class="font-semibold block mb-1">{{ title }}</span>
        <span>{{ message }}</span>
      </div>
      <button @click="close" class="ml-4 text-gray-400 hover:text-gray-700">
        &times;
      </button>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed, watch, defineProps, defineExpose } from "vue";
const props = defineProps({
  type: { type: String, default: "info" },
  message: { type: String, default: "" },
  title: { type: String, default: "" },
  duration: { type: Number, default: 3000 },
  show: { type: Boolean, default: false },
});
const visible = ref(props.show);
watch(
  () => props.show,
  (val) => {
    visible.value = val;
    if (val && props.duration > 0) {
      setTimeout(() => (visible.value = false), props.duration);
    }
  }
);
const typeClass = computed(() => {
  switch (props.type) {
    case "success":
      return "bg-green-50 border border-green-200 text-green-800";
    case "error":
      return "bg-red-50 border border-red-200 text-red-800";
    case "info":
      return "bg-blue-50 border border-blue-200 text-blue-800";
    case "warning":
      return "bg-yellow-50 border border-yellow-200 text-yellow-800";
    default:
      return "bg-gray-50 border border-gray-200 text-gray-800";
  }
});
function close() {
  visible.value = false;
}
defineExpose({ close });
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
