<template>
  <div v-if="show">
    <div
      id="crud-modal"
      tabindex="-1"
      aria-hidden="true"
      class="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full bg-black/50"
    >
      <div class="relative p-4 w-full max-w-md max-h-full">
        <!-- Modal content -->
        <div class="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
          <!-- Modal header -->
          <div
            class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200"
          >
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ isEdit ? "Edit Kategori" : "Tambah Kategori" }}
            </h3>
            <button
              type="button"
              @click="close"
              class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
            >
              <svg
                class="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span class="sr-only">Close modal</span>
            </button>
          </div>

          <!-- Modal body -->
          <form @submit.prevent="handleSubmit" class="p-4 md:p-5">
            <div class="grid gap-4 mb-4 grid-cols-2">
              <!-- Nama -->
              <div class="col-span-2">
                <label
                  for="nama"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >Nama Kategori</label
                >
                <input
                  v-model="form.nama"
                  type="text"
                  id="nama"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                  placeholder="Type category name"
                  required
                />
              </div>
            </div>

            <!-- Action -->
            <button
              type="submit"
              class="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              {{ isEdit ? "Update Kategori" : "Tambah Kategori" }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import axios from "axios";

const url = import.meta.env.VITE_API_URL;

const props = defineProps({
  show: Boolean,
  isEdit: Boolean,
  initialData: Object,
});

const emit = defineEmits(["close", "save"]);

const form = ref({
  nama: "",
});

// isi form ketika edit
watch(
  () => props.initialData,
  (val) => {
    if (props.isEdit && val) {
      form.value = {
        id: val.id, // ⬅️ tambahkan ini!
        nama: val.nama,
      };
    } else {
      form.value = {
        id: null, // ⬅️ default kalau tambah
        nama: "",
      };
    }
  },
  { immediate: true }
);

const handleSubmit = async () => {
  try {
    const success = await new Promise((resolve) => {
      emit("save", { ...form.value, resolve });
    });
    if (success) {
      close();
    }
  } catch (e) {
    // kalau parent return reject, modal tetap terbuka
  }
};

const close = () => {
  emit("close");
};
</script>
