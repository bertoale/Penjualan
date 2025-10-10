<template>
  <div>
    <!-- Header -->
    <div class="flex justify-between items-center mb-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          Detail Penjualan #{{ penjualanDetail?.id }}
        </h1>
        <p class="text-white dark:text-gray-400">
          {{ formatDate(penjualanDetail?.createdAt) }}
        </p>
      </div>
      <button
        @click="goBack"
        class="text-blue-600 hover:text-blue-800 dark:text-blue-400"
      >
        ← Kembali ke Daftar Penjualan
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8">
      <div class="text-gray-500">Memuat detail penjualan...</div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-8">
      <div class="text-red-500">{{ error }}</div>
    </div>

    <!-- Main Content -->
    <div v-else-if="penjualanDetail" class="space-y-6">
      <!-- Info Card -->
      <div class="m-2 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Informasi Penjualan
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              ID Transaksi
            </label>
            <p class="text-lg font-mono text-gray-900 dark:text-white">
              #{{ penjualanDetail.id }}
            </p>
          </div>
          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Tanggal & Waktu
            </label>
            <p class="text-lg text-gray-900 dark:text-white">
              {{ formatDate(penjualanDetail.createdAt) }}
            </p>
          </div>
          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Pelanggan
            </label>
            <p class="text-lg text-gray-900 dark:text-white">
              {{ penjualanDetail.Pelanggan?.nama || "Umum" }}
            </p>
            <p
              v-if="penjualanDetail.Pelanggan?.no_hp"
              class="text-sm text-gray-600 dark:text-gray-400"
            >
              {{ penjualanDetail.Pelanggan.no_hp }}
            </p>
          </div>
          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Total Pembayaran
            </label>
            <p class="text-2xl font-bold text-green-600 dark:text-green-400">
              {{ formatCurrency(penjualanDetail.total_harga) }}
            </p>
          </div>
        </div>
      </div>

      <!-- Items Table -->
      <div
        class="m-2 bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden"
      >
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            Item yang Dibeli
          </h2>
        </div>
        <div class="overflow-x-auto">
          <table
            class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
          >
            <thead
              class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
            >
              <tr>
                <th scope="col" class="px-6 py-3">Produk</th>
                <th scope="col" class="px-6 py-3 text-center">Qty</th>
                <th scope="col" class="px-6 py-3 text-right">Harga Satuan</th>
                <th scope="col" class="px-6 py-3 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, index) in penjualanDetail.PenjualanDetails"
                :key="index"
                class="odd:m-2 bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
              >
                <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">
                  {{ item.Produk?.nama }}
                </td>
                <td class="px-6 py-4 text-center">
                  {{ item.qty }}
                </td>
                <td class="px-6 py-4 text-right">
                  {{ formatCurrency(item.harga_satuan) }}
                </td>
                <td class="px-6 py-4 text-right font-semibold">
                  {{ formatCurrency(item.qty * item.harga_satuan) }}
                </td>
              </tr>
            </tbody>
            <tfoot class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <td
                  colspan="3"
                  class="px-6 py-4 text-right font-bold text-gray-900 dark:text-white"
                >
                  Total:
                </td>
                <td
                  class="px-6 py-4 text-right font-bold text-xl text-green-600 dark:text-green-400"
                >
                  {{ formatCurrency(penjualanDetail.total_harga) }}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <!-- Summary Card -->
      <div
        class="m-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6"
      >
        <h3 class="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
          Ringkasan
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {{ penjualanDetail.PenjualanDetails?.length || 0 }}
            </p>
            <p class="text-sm text-blue-700 dark:text-blue-300">Item Berbeda</p>
          </div>
          <div>
            <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {{ getTotalQty() }}
            </p>
            <p class="text-sm text-blue-700 dark:text-blue-300">
              Total Quantity
            </p>
          </div>
          <div>
            <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {{ formatCurrency(penjualanDetail.total_harga) }}
            </p>
            <p class="text-sm text-blue-700 dark:text-blue-300">
              Total Pembayaran
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";

const route = useRoute();
const router = useRouter();
const url = import.meta.env.VITE_API_URL;

const penjualanDetail = ref(null);
const loading = ref(true);
const error = ref(null);

const formatDate = (dateString) => {
  if (!dateString) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Makassar",
    dateStyle: "full",
    timeStyle: "short",
  }).format(new Date(dateString));
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(amount);
};

const getTotalQty = () => {
  if (!penjualanDetail.value?.PenjualanDetails) return 0;
  return penjualanDetail.value.PenjualanDetails.reduce(
    (total, item) => total + item.qty,
    0
  );
};

const goBack = () => {
  router.push("/penjualan");
};

const getPenjualanDetail = async () => {
  try {
    loading.value = true;
    error.value = null;

    const token = localStorage.getItem("token");
    const response = await axios.get(`${url}/penjualan/${route.params.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Penjualan Detail Response:", response.data);
    penjualanDetail.value = response.data.penjualan;
  } catch (err) {
    console.error("Error fetching penjualan detail:", err);
    error.value =
      err.response?.data?.message || "Gagal memuat detail penjualan";
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  getPenjualanDetail();
});
</script>
