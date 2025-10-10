<template>
  <div>
    <div class="flex justify-end mr-1">
      <button
        @click="openAddModal"
        type="button"
        class="m-4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
      >
        Tambah Supplier
      </button>
    </div>

    <div class="m-4 relative overflow-x-auto shadow-lg sm:rounded-lg">
      <table
        class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
      >
        <thead
          class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
        >
          <tr>
            <th scope="col" class="px-6 py-3">Nama Supplier</th>
            <th scope="col" class="px-6 py-3">Alamat</th>
            <th scope="col" class="px-6 py-3">HP/Telepon</th>
            <th scope="col" class="px-6 py-3">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(supplier, index) in dataSupplier"
            :key="supplier.id || index"
            class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200"
          >
            <th
              scope="row"
              class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
            >
              {{ supplier.nama }}
            </th>
            <td class="px-6 py-4">
              {{ supplier.alamat }}
            </td>
            <td class="px-6 py-4">
              {{ supplier.no_hp }}
            </td>
            <td class="px-6 py-4 flex gap-3">
              <!-- Tombol Edit -->
              <button
                @click="openEditModal(supplier)"
                class="text-blue-600 hover:text-blue-800 dark:text-blue-500"
                title="Edit"
              >
                <!-- Heroicons Pencil Square -->
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.862 4.487zm0 0L19.5 7.125"
                  />
                </svg>
              </button>

              <!-- Tombol Delete -->
              <button
                @click="openDeleteModal(supplier)"
                class="text-red-600 hover:text-red-800 dark:text-red-500"
                title="Hapus"
              >
                <!-- Heroicons Trash -->
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M6 7h12M9 7V4h6v3m-7 4v7m4-7v7m4-7v7M4 7h16v13a2 2 0 01-2 2H6a2 2 0 01-2-2V7z"
                  />
                </svg>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <supplierModal
      :show="showModal"
      :isEdit="isEdit"
      :initialData="selectedSupplier"
      @close="showModal = false"
      @save="handleSave"
    />
    <ConfirmDeleteModal
      :show="showDeleteModal"
      :message="`Yakin ingin menghapus supplier ${selectedSupplier?.nama}?`"
      @confirm="deleteSupplier"
      @cancel="showDeleteModal = false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import supplierModal from "../components/modal/SupplierModal.vue";
import ConfirmDeleteModal from "../components/modal/DeleteModal.vue";

const url = import.meta.env.VITE_API_URL;
const deleteId = ref(null);
const showModal = ref(false);
const showDeleteModal = ref(false);
const isEdit = ref(false);
const selectedSupplier = ref(null);
const dataSupplier = ref([]);

const openAddModal = () => {
  isEdit.value = false;
  selectedSupplier.value = null;
  showModal.value = true;
};

const openEditModal = (supplier) => {
  isEdit.value = true;
  selectedSupplier.value = supplier;
  showModal.value = true;
};

const openDeleteModal = (supplier) => {
  deleteId.value = supplier.id;
  selectedSupplier.value = supplier;
  showDeleteModal.value = true;
};

const deleteSupplier = async () => {
  try {
    await axios.delete(`${url}/supplier/${deleteId.value}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    console.log("Supplier berhasil dihapus:", deleteId.value);

    // update list supplier tanpa reload
    dataSupplier.value = dataSupplier.value.filter(
      (p) => p.id !== deleteId.value
    );

    showDeleteModal.value = false; // tutup modal
  } catch (error) {
    console.error("Gagal hapus supplier:", error);
  }
};

const handleSave = async (data) => {
  if (isEdit.value) {
    await axios.put(`${url}/supplier/${data.id}`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    console.log("Update supplier:", data);
  } else {
    await axios.post(`${url}/supplier/`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    console.log("Tambah supplier:", data);
  }
  getAllSupplier();
};

const getAllSupplier = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${url}/supplier`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("API Response:", response.data);
    dataSupplier.value = response.data.supplier || [];
  } catch (error) {
    console.error("Error fetching supplier:", error);
  }
};

onMounted(() => {
  getAllSupplier();
});
</script>
