<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
  >
    <div
      class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800"
    >
      <div class="mt-3">
        <h3
          class="text-lg font-medium text-gray-900 dark:text-white text-center"
        >
          {{ isEdit ? "Edit Pembelian" : "Tambah Pembelian" }}
        </h3>

        <form @submit.prevent="handleSubmit" class="mt-4 space-y-4">
          <!-- Tanggal -->
          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Tanggal
            </label>
            <input
              v-model="formData.tanggal"
              type="date"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <!-- Supplier -->
          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Supplier
            </label>
            <select
              v-model="formData.SupplierId"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="">Pilih Supplier</option>
              <option
                v-for="supplier in suppliers"
                :key="supplier.id"
                :value="supplier.id"
              >
                {{ supplier.nama }}
              </option>
            </select>
          </div>

          <!-- Buttons -->
          <div class="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              @click="$emit('close')"
              class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none"
            >
              Batal
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
            >
              {{ isEdit ? "Update" : "Simpan" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import axios from "axios";

const props = defineProps({
  show: Boolean,
  isEdit: Boolean,
  initialData: Object,
});

const emit = defineEmits(["close", "save"]);

const url = import.meta.env.VITE_API_URL;
const suppliers = ref([]);
const formData = ref({
  tanggal: "",
  SupplierId: "",
});

const fetchSuppliers = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${url}/supplier`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    suppliers.value = response.data.supplier || [];
  } catch (error) {
    console.error("Error fetching suppliers:", error);
  }
};

const handleSubmit = () => {
  const submitData = {
    ...formData.value,
  };

  if (props.isEdit && props.initialData) {
    submitData.id = props.initialData.id;
  }

  emit("save", submitData);
  emit("close");
};

// Reset form when modal opens/closes
watch(
  () => props.show,
  (newVal) => {
    if (newVal) {
      if (props.isEdit && props.initialData) {
        formData.value = {
          tanggal: props.initialData.tanggal?.split("T")[0] || "",
          SupplierId: props.initialData.SupplierId || "",
        };
      } else {
        formData.value = {
          tanggal: new Date().toISOString().split("T")[0],
          SupplierId: "",
        };
      }
    }
  }
);

onMounted(() => {
  fetchSuppliers();
});
</script>
