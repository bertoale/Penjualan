<template>
  <div class="space-y-6">
    <div class="space-y-6">
      <!-- Header -->
      <div class="m-2 bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
              Dashboard Penjualan & Pembelian
            </h1>
            <p class="text-gray-600 dark:text-gray-400 mt-2">
              Pantau kinerja bisnis Anda secara real-time
            </p>
          </div>
          <div class="text-right">
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Terakhir diperbarui
            </p>
            <p class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ formatDate(new Date()) }}
            </p>
          </div>
        </div>
      </div>

      <!-- Reports Section -->
      <div class="m-2 bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div class="flex justify-between items-center mb-4">
          <div>
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
              📊 Laporan Bulanan
            </h2>
            <p class="text-gray-600 dark:text-gray-400">
              Generate laporan penjualan dan pembelian dalam format Excel
              (.xlsx)
            </p>
          </div>
          <button
            @click="$router.push('/reports')"
            class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center"
          >
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                clip-rule="evenodd"
              ></path>
            </svg>
            Generate Laporan
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            class="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800"
          >
            <div class="flex items-center mb-2">
              <div
                class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3"
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
              <h3 class="font-medium text-green-900 dark:text-green-100">
                Laporan Penjualan
              </h3>
            </div>
            <p class="text-sm text-green-700 dark:text-green-300">
              Ringkasan transaksi penjualan, analisis produk terlaris, dan
              grafik harian
            </p>
          </div>

          <div
            class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800"
          >
            <div class="flex items-center mb-2">
              <div
                class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3"
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
              <h3 class="font-medium text-blue-900 dark:text-blue-100">
                Laporan Pembelian
              </h3>
            </div>
            <p class="text-sm text-blue-700 dark:text-blue-300">
              Ringkasan transaksi pembelian, analisis supplier, dan grafik
              harian
            </p>
          </div>

          <div
            class="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800"
          >
            <div class="flex items-center mb-2">
              <div
                class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3"
              >
                <svg
                  class="w-4 h-4 text-purple-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </div>
              <h3 class="font-medium text-purple-900 dark:text-purple-100">
                Laporan Gabungan
              </h3>
            </div>
            <p class="text-sm text-purple-700 dark:text-purple-300">
              Ringkasan keuangan, analisis profit, dan perbandingan penjualan vs
              pembelian
            </p>
          </div>
        </div>
      </div>

      <!-- Recent Transactions and Performance -->
      <div class="gap-6">
        <!-- Produk Stok Rendah -->
        <div class="m-2 bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              Stok Rendah
            </h3>
            <button
              @click="$router.push('/produk')"
              class="text-red-600 hover:text-red-800 text-sm"
            >
              Kelola Stok →
            </button>
          </div>
          <div class="space-y-3">
            <div
              v-for="produk in lowStockProducts"
              :key="produk.id"
              class="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors cursor-pointer"
              @click="$router.push('/produk')"
            >
              <div class="flex items-center space-x-3">
                <div
                  class="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                </div>
                <div>
                  <p class="font-medium text-gray-900 dark:text-white">
                    {{ produk.nama }}
                  </p>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    {{ produk.ProdukKategori?.nama || "Tanpa kategori" }}
                  </p>
                </div>
              </div>
              <div class="text-right">
                <p class="font-semibold text-red-600">
                  Stok: {{ produk.stok }}
                </p>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ formatCurrency(produk.harga_jual) }}
                </p>
              </div>
            </div>
            <div
              v-if="lowStockProducts.length === 0"
              class="text-center py-8 text-gray-500 dark:text-gray-400"
            >
              Semua produk stok aman
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="m-2 bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Aksi Cepat
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
          <button
            @click="$router.push('/tambah-penjualan')"
            class="flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clip-rule="evenodd"
              ></path>
            </svg>
            Tambah Penjualan
          </button>

          <button
            @click="$router.push('/tambah-pembelian')"
            class="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clip-rule="evenodd"
              ></path>
            </svg>
            Tambah Pembelian
          </button>

          <button
            @click="$router.push('/produk')"
            class="flex items-center justify-center px-4 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path
                d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
              ></path>
            </svg>
            Kelola Produk
          </button>

          <button
            @click="$router.push('/supplier')"
            class="flex items-center justify-center px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path
                d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"
              ></path>
            </svg>
            Kelola Supplier
          </button>

          <button
            @click="$router.push('/reports')"
            class="flex items-center justify-center px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                clip-rule="evenodd"
              ></path>
            </svg>
            Generate Laporan
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const router = useRouter();
const url = import.meta.env.VITE_API_URL;

const loading = ref(true);
const stats = ref({
  totalPenjualan: 0,
  totalTransaksiPenjualan: 0,
  totalPembelian: 0,
  totalTransaksiPembelian: 0,
  totalProduk: 0,
  stokRendah: 0,
  estimasiProfit: 0,
});

const recentTransactions = ref([]);
const lowStockProducts = ref([]);

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(amount || 0);
};

const formatDate = (dateString) => {
  return new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Makassar",
    dateStyle: "full",
    timeStyle: "short",
  }).format(new Date(dateString));
};

const formatDateShort = (dateString) => {
  return new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Makassar",
    dateStyle: "medium",
  }).format(new Date(dateString));
};

const goToTransactionDetail = (transaksi) => {
  if (transaksi.type === "penjualan") {
    router.push(`/penjualan/${transaksi.id}`);
  } else {
    router.push(`/pembelian/${transaksi.id}`);
  }
};

const fetchDashboardData = async () => {
  try {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    // Fetch all data in parallel
    const [penjualanRes, pembelianRes, produkRes] = await Promise.all([
      axios.get(`${url}/penjualan`, { headers }),
      axios.get(`${url}/pembelian`, { headers }),
      axios.get(`${url}/produk`, { headers }),
    ]);

    const penjualanData = penjualanRes.data.penjualan || [];
    const pembelianData = pembelianRes.data.pembelian || [];
    const produkData = produkRes.data.produk || [];

    // Calculate stats
    stats.value = {
      totalPenjualan: penjualanData.reduce(
        (sum, p) => sum + (p.total_harga || 0),
        0
      ),
      totalTransaksiPenjualan: penjualanData.length,
      totalPembelian: pembelianData.reduce(
        (sum, p) => sum + (p.total_harga || 0),
        0
      ),
      totalTransaksiPembelian: pembelianData.length,
      totalProduk: produkData.length,
      stokRendah: produkData.filter((p) => p.stok <= 10).length,
      estimasiProfit:
        penjualanData.reduce((sum, p) => sum + (p.total_harga || 0), 0) -
        pembelianData.reduce((sum, p) => sum + (p.total_harga || 0), 0),
    };

    // Recent transactions (last 8)
    const allTransactions = [
      ...penjualanData.map((p) => ({
        ...p,
        type: "penjualan",
        total: p.total_harga,
      })),
      ...pembelianData.map((p) => ({
        ...p,
        type: "pembelian",
        total: p.total_harga,
      })),
    ];

    recentTransactions.value = allTransactions
      .sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal))
      .slice(0, 8);

    // Low stock products (stok <= 10)
    lowStockProducts.value = produkData
      .filter((p) => p.stok <= 10)
      .sort((a, b) => a.stok - b.stok)
      .slice(0, 8);
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchDashboardData();
});
</script>
