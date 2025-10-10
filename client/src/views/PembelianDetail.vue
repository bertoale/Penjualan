<template>
  <div>
    <!-- Header -->
    <div class="flex justify-between items-center mb-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          Detail Pembelian #{{ pembelianDetail?.id }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          {{ formatDate(pembelianDetail?.tanggal) }}
        </p>
      </div>
      <button
        @click="goBack"
        class="text-blue-600 hover:text-blue-800 dark:text-blue-400"
      >
        ← Kembali ke Daftar Pembelian
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8">
      <div class="text-gray-500">Memuat detail pembelian...</div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-8">
      <div class="text-red-500">{{ error }}</div>
    </div>

    <!-- Main Content -->
    <div v-else-if="pembelianDetail" class="space-y-6">
      <!-- Info Card -->
      <div class="m-2 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Informasi Pembelian
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              ID Transaksi
            </label>
            <p class="text-lg font-mono text-gray-900 dark:text-white">
              #{{ pembelianDetail.id }}
            </p>
          </div>
          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Tanggal Pembelian
            </label>
            <p class="text-lg text-gray-900 dark:text-white">
              {{ formatDate(pembelianDetail.tanggal) }}
            </p>
          </div>
          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Supplier
            </label>
            <div class="text-lg text-gray-900 dark:text-white">
              <p class="font-semibold">{{ pembelianDetail.Supplier?.nama }}</p>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                {{ pembelianDetail.Supplier?.no_hp }}
              </p>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                {{ pembelianDetail.Supplier?.alamat }}
              </p>
            </div>
          </div>
          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Total Pembelian
            </label>
            <p class="text-2xl font-bold text-green-600 dark:text-green-400">
              {{ pembelianDetail.total_harga }}
            </p>
          </div>
        </div>
      </div>

      <!-- Items Table -->
      <div class="m-2 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Item Pembelian
        </h2>
        <div class="overflow-x-auto">
          <table
            class="w-full text-sm text-left text-gray-500 dark:text-gray-400"
          >
            <thead
              class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
            >
              <tr>
                <th scope="col" class="px-6 py-3">Produk</th>
                <th scope="col" class="px-6 py-3">Kategori</th>
                <th scope="col" class="px-6 py-3">Harga Beli</th>
                <th scope="col" class="px-6 py-3">Jumlah</th>
                <th scope="col" class="px-6 py-3">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="detail in pembelianDetail.PembelianDetails"
                :key="detail.id"
                class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
              >
                <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">
                  {{ detail.Produk?.nama }}
                </td>
                <td class="px-6 py-4">
                  {{
                    detail.Produk?.ProdukKategori?.nama || "Tidak ada kategori"
                  }}
                </td>
                <td class="px-6 py-4">
                  {{ detail.harga_satuan }}
                </td>
                <td class="px-6 py-4">
                  {{ detail.qty }}
                </td>
                <td class="px-6 py-4 font-semibold">
                  {{ detail.qty * detail.harga_satuan }}
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr class="font-semibold text-gray-900 dark:text-white">
                <th scope="row" class="px-6 py-3 text-base" colspan="4">
                  Total
                </th>
                <td class="px-6 py-3 text-base">
                  {{ pembelianDetail.total_harga }}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <!-- Summary Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="m-2 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div
                class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center"
              >
                <svg
                  class="w-4 h-4 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"
                  ></path>
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
                Total Item
              </dt>
              <dd class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ pembelianDetail.PembelianDetails?.length || 0 }}
              </dd>
            </div>
          </div>
        </div>

        <div class="my-2 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div
                class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center"
              >
                <svg
                  class="w-4 h-4 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
                Total Kuantitas
              </dt>
              <dd class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ totalQuantity }}
              </dd>
            </div>
          </div>
        </div>

        <div class="m-2 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div
                class="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center"
              >
                <svg
                  class="w-4 h-4 text-yellow-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"
                  ></path>
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.51-1.31c-.562-.649-1.413-1.076-2.353-1.253V5z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
                Rata-rata Harga
              </dt>
              <dd class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ averagePrice }}
              </dd>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";

const route = useRoute();
const router = useRouter();
const url = import.meta.env.VITE_API_URL;

const pembelianDetail = ref(null);
const loading = ref(true);
const error = ref(null);

const totalQuantity = computed(() => {
  if (!pembelianDetail.value?.PembelianDetails) return 0;
  return pembelianDetail.value.PembelianDetails.reduce(
    (total, detail) => total + (detail.qty || 0),
    0
  );
});

const averagePrice = computed(() => {
  if (!pembelianDetail.value?.PembelianDetails?.length) return 0;
  const total = pembelianDetail.value.PembelianDetails.reduce(
    (sum, detail) => sum + (detail.harga_satuan || 0),
    0
  );
  return total / pembelianDetail.value.PembelianDetails.length;
});

const formatDate = (dateString) => {
  if (!dateString) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Makassar",
    dateStyle: "full",
  }).format(new Date(dateString));
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(amount);
};

const goBack = () => {
  router.push("/pembelian");
};

const fetchPembelianDetail = async () => {
  try {
    loading.value = true;
    const token = localStorage.getItem("token");
    const pembelianId = route.params.id;

    const response = await axios.get(`${url}/pembelian/${pembelianId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    pembelianDetail.value = response.data.pembelian;
  } catch (err) {
    console.error("Error fetching pembelian detail:", err);
    error.value = "Gagal memuat detail pembelian";
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchPembelianDetail();
});
</script>
