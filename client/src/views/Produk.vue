<template>
  <div>
    <!-- Search and Filter Section -->
    <div class="m-4 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
      <div class="flex flex-col md:flex-row gap-4 items-end">
        <!-- Search by name -->
        <div class="flex-1">
          <label
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Cari Produk
          </label>
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Masukkan nama produk..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              @input="performSearch"
            />
            <div
              class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
            >
              <svg
                class="w-5 h-5 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </div>
          </div>
        </div>

        <!-- Filter by category -->
        <div class="w-full md:w-64">
          <label
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Filter Kategori
          </label>
          <select
            v-model="selectedCategory"
            @change="performSearch"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="">Semua Kategori</option>
            <option
              v-for="kategori in dataKategori"
              :key="kategori.id"
              :value="kategori.id"
            >
              {{ kategori.nama }}
            </option>
          </select>
        </div>

        <!-- Filter by stock status -->
        <div class="w-full md:w-48">
          <label
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Filter Stok
          </label>
          <select
            v-model="stockFilter"
            @change="performSearch"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="">Semua Stok</option>
            <option value="low">Stok Rendah (≤10)</option>
            <option value="available">Stok Tersedia (>10)</option>
            <option value="empty">Stok Habis (0)</option>
          </select>
        </div>

        <!-- Clear filters button -->
        <button
          @click="clearFilters"
          class="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </button>
      </div>

      <!-- Search results info -->
      <div
        v-if="searchQuery || selectedCategory || stockFilter"
        class="mt-4 text-sm text-gray-600 dark:text-gray-400"
      >
        Menampilkan {{ filteredProduk.length }} dari
        {{ dataProduk.length }} produk
      </div>
    </div>

    <div class="flex justify-end mr-1">
      <button
        @click="openAddModal"
        type="button"
        class="m-4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
      >
        Tambah Produk
      </button>
    </div>

    <div class="m-4 relative overflow-x-auto shadow-lg sm:rounded-lg">
      <!-- No results message -->
      <div
        v-if="filteredProduk.length === 0 && !loading"
        class="text-center py-8 bg-white dark:bg-gray-800"
      >
        <svg
          class="w-12 h-12 text-gray-400 mx-auto mb-4"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clip-rule="evenodd"
          ></path>
        </svg>
        <p class="text-gray-500 dark:text-gray-400">
          {{
            searchQuery
              ? "Tidak ada produk yang ditemukan dengan kata kunci tersebut"
              : "Tidak ada produk yang sesuai dengan filter"
          }}
        </p>
      </div>

      <table
        v-else
        class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
      >
        <thead
          class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
        >
          <tr>
            <th scope="col" class="px-6 py-3">Nama Product</th>
            <th scope="col" class="px-6 py-3">Kategori</th>
            <th scope="col" class="px-6 py-3">Harga Beli</th>
            <th scope="col" class="px-6 py-3">Harga Jual</th>
            <th scope="col" class="px-6 py-3">Stok</th>
            <th scope="col" class="px-6 py-3">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(produk, index) in filteredProduk"
            :key="produk.id || index"
            class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200"
          >
            <th
              scope="row"
              class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
            >
              {{ produk.nama }}
            </th>
            <td class="px-6 py-4">
              <span
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                :class="
                  produk.ProdukKategori
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                "
              >
                {{ produk.ProdukKategori?.nama || "Tanpa Kategori" }}
              </span>
            </td>
            <td class="px-6 py-4">
              {{ formatCurrency(produk.harga_beli) }}
            </td>
            <td class="px-6 py-4">
              {{ formatCurrency(produk.harga_jual) }}
            </td>
            <td class="px-6 py-4">
              <span
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                :class="getStockBadgeClass(produk.stok)"
              >
                {{ produk.stok }}
              </span>
            </td>
            <td class="px-6 py-4 flex gap-3">
              <!-- Tombol Edit -->
              <button
                @click="openEditModal(produk)"
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
                @click="openDeleteModal(produk)"
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
    <produkModal
      :show="showModal"
      :isEdit="isEdit"
      :initialData="selectedProduk"
      @close="showModal = false"
      @save="handleSave"
    />
    <ConfirmDeleteModal
      :show="showDeleteModal"
      :message="`Yakin ingin menghapus produk ${selectedProduk?.nama}?`"
      @confirm="deleteProduk"
      @cancel="showDeleteModal = false"
    />
    <ToastAlert
      :type="toast.type"
      :title="toast.title"
      :message="toast.message"
      :show="toast.show"
      :duration="toast.duration"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import produkModal from "../components/modal/ProdukModal.vue";
import ConfirmDeleteModal from "../components/modal/DeleteModal.vue";
import ToastAlert from "../components/alert/ToastAlert.vue";

const url = import.meta.env.VITE_API_URL;
const deleteId = ref(null);
const showModal = ref(false);
const showDeleteModal = ref(false);
const isEdit = ref(false);
const selectedProduk = ref(null);
const dataProduk = ref([]);
const dataKategori = ref([]);
const searchQuery = ref("");
const selectedCategory = ref("");
const stockFilter = ref("");
const loading = ref(false);

const toast = ref({
  show: false,
  type: "success",
  title: "",
  message: "",
  duration: 3000,
});

function showToast({
  type = "success",
  title = "",
  message = "",
  duration = 3000,
}) {
  toast.value = { show: true, type, title, message, duration };
  setTimeout(() => {
    toast.value.show = false;
  }, duration);
}

const openAddModal = () => {
  isEdit.value = false;
  selectedProduk.value = null;
  showModal.value = true;
};

const openEditModal = (produk) => {
  isEdit.value = true;
  selectedProduk.value = produk;
  showModal.value = true;
};

const openDeleteModal = (produk) => {
  deleteId.value = produk.id;
  selectedProduk.value = produk;
  showDeleteModal.value = true;
};

const deleteProduk = async () => {
  try {
    await axios.delete(`${url}/produk/${deleteId.value}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    dataProduk.value = dataProduk.value.filter((p) => p.id !== deleteId.value);
    showDeleteModal.value = false;
    showToast({
      type: "success",
      title: "Berhasil",
      message: "Produk berhasil dihapus",
    });
  } catch (error) {
    showToast({
      type: "error",
      title: "Gagal",
      message: "Gagal menghapus produk",
    });
  }
};

const handleSave = async ({ resolve, ...data }) => {
  try {
    if (isEdit.value) {
      await axios.put(`${url}/produk/${data.id}`, data, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      showToast({
        type: "success",
        title: "Berhasil",
        message: "Produk berhasil diupdate",
      });
    } else {
      await axios.post(`${url}/produk/`, data, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      showToast({
        type: "success",
        title: "Berhasil",
        message: "Produk berhasil ditambahkan",
      });
    }
    getAllProduk();
    resolve(true); // ✅ kasih tahu modal sukses
  } catch (error) {
    showToast({
      type: "error",
      title: "Gagal",
      message: error.response?.data?.message || "Gagal menyimpan produk",
    });
    resolve(false); // ❌ kasih tahu modal gagal
  }
};

const getAllProduk = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${url}/produk`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("API Response:", response.data);
    dataProduk.value = response.data.produk || [];
  } catch (error) {
    console.error("Error fetching produk:", error);
  }
};

const getAllKategori = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${url}/produk-kategori`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("API Response:", response.data);
    dataKategori.value = response.data.kategori || [];
  } catch (error) {
    console.error("Error fetching kategori:", error);
  }
};

const performSearch = () => {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
  }, 500);
};

const clearFilters = () => {
  searchQuery.value = "";
  selectedCategory.value = "";
  stockFilter.value = "";
  performSearch();
};

const filteredProduk = computed(() => {
  return dataProduk.value.filter((produk) => {
    const matchesSearchQuery = produk.nama
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase());
    const matchesCategory =
      !selectedCategory.value ||
      produk.ProdukKategoriId === parseInt(selectedCategory.value);
    const matchesStockFilter =
      !stockFilter.value ||
      (stockFilter.value === "low" && produk.stok <= 10) ||
      (stockFilter.value === "available" && produk.stok > 10) ||
      (stockFilter.value === "empty" && produk.stok === 0);

    return matchesSearchQuery && matchesCategory && matchesStockFilter;
  });
});

const formatCurrency = (value) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(value);
};

const getStockBadgeClass = (stok) => {
  if (stok === 0) {
    return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
  } else if (stok <= 10) {
    return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
  } else {
    return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
  }
};

onMounted(() => {
  getAllProduk();
  getAllKategori();
});
</script>
