<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="m-2 bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
        Laporan Bulanan
      </h1>
      <p class="text-gray-600 dark:text-gray-400 mt-2">
        Generate laporan penjualan dan pembelian dalam format Excel
      </p>
    </div>

    <!-- Report Generation Cards -->
    <div class="m-2 grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Sales Report Card -->
      <div class="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
        <div class="flex items-center mb-4">
          <div
            class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4"
          >
            <svg
              class="w-6 h-6 text-green-600"
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
          <div>
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
              Laporan Penjualan
            </h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Export data penjualan bulanan
            </p>
          </div>
        </div>

        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Bulan
              </label>
              <select
                v-model="salesReportMonth"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option
                  v-for="month in months"
                  :key="month.value"
                  :value="month.value"
                >
                  {{ month.label }}
                </option>
              </select>
            </div>
            <div>
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Tahun
              </label>
              <select
                v-model="salesReportYear"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option v-for="year in years" :key="year" :value="year">
                  {{ year }}
                </option>
              </select>
            </div>
          </div>

          <div class="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
            <h3 class="font-medium text-green-900 dark:text-green-100 mb-2">
              Laporan akan berisi:
            </h3>
            <ul class="text-sm text-green-700 dark:text-green-300 space-y-1">
              <li>• Ringkasan penjualan bulanan</li>
              <li>• Detail transaksi penjualan</li>
              <li>• Analisis produk terlaris</li>
              <li>• Grafik penjualan harian</li>
            </ul>
          </div>

          <button
            @click="generateSalesReport"
            :disabled="generatingSalesReport"
            class="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
          >
            <svg
              v-if="generatingSalesReport"
              class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <svg
              v-else
              class="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                clip-rule="evenodd"
              ></path>
            </svg>
            {{
              generatingSalesReport
                ? "Generating..."
                : "Download Laporan Penjualan"
            }}
          </button>
        </div>
      </div>

      <!-- Purchase Report Card -->
      <div class="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
        <div class="flex items-center mb-4">
          <div
            class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4"
          >
            <svg
              class="w-6 h-6 text-blue-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"
              ></path>
            </svg>
          </div>
          <div>
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
              Laporan Pembelian
            </h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Export data pembelian bulanan
            </p>
          </div>
        </div>

        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Bulan
              </label>
              <select
                v-model="purchaseReportMonth"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option
                  v-for="month in months"
                  :key="month.value"
                  :value="month.value"
                >
                  {{ month.label }}
                </option>
              </select>
            </div>
            <div>
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Tahun
              </label>
              <select
                v-model="purchaseReportYear"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option v-for="year in years" :key="year" :value="year">
                  {{ year }}
                </option>
              </select>
            </div>
          </div>

          <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <h3 class="font-medium text-blue-900 dark:text-blue-100 mb-2">
              Laporan akan berisi:
            </h3>
            <ul class="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <li>• Ringkasan pembelian bulanan</li>
              <li>• Detail transaksi pembelian</li>
              <li>• Analisis supplier terbesar</li>
              <li>• Grafik pembelian harian</li>
            </ul>
          </div>

          <button
            @click="generatePurchaseReport"
            :disabled="generatingPurchaseReport"
            class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
          >
            <svg
              v-if="generatingPurchaseReport"
              class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <svg
              v-else
              class="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                clip-rule="evenodd"
              ></path>
            </svg>
            {{
              generatingPurchaseReport
                ? "Generating..."
                : "Download Laporan Pembelian"
            }}
          </button>
        </div>
      </div>
    </div>

    <!-- Combined Report Card -->
    <div class="m-2 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
      <div class="flex items-center mb-4">
        <div
          class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4"
        >
          <svg
            class="w-6 h-6 text-purple-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </div>
        <div>
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
            Laporan Gabungan
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Export laporan penjualan dan pembelian dalam satu file
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Bulan
          </label>
          <select
            v-model="combinedReportMonth"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option
              v-for="month in months"
              :key="month.value"
              :value="month.value"
            >
              {{ month.label }}
            </option>
          </select>
        </div>
        <div>
          <label
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Tahun
          </label>
          <select
            v-model="combinedReportYear"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option v-for="year in years" :key="year" :value="year">
              {{ year }}
            </option>
          </select>
        </div>
        <div class="flex items-end">
          <button
            @click="generateCombinedReport"
            :disabled="generatingCombinedReport"
            class="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center"
          >
            <svg
              v-if="generatingCombinedReport"
              class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <svg
              v-else
              class="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                clip-rule="evenodd"
              ></path>
            </svg>
            {{
              generatingCombinedReport
                ? "Generating..."
                : "Download Laporan Gabungan"
            }}
          </button>
        </div>
      </div>

      <div class="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
        <h3 class="font-medium text-purple-900 dark:text-purple-100 mb-2">
          Laporan gabungan berisi:
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <ul class="text-purple-700 dark:text-purple-300 space-y-1">
            <li>• Ringkasan keuangan bulanan</li>
            <li>• Analisis profit & loss</li>
            <li>• Perbandingan penjualan vs pembelian</li>
          </ul>
          <ul class="text-purple-700 dark:text-purple-300 space-y-1">
            <li>• Dashboard kinerja bisnis</li>
            <li>• Tren penjualan dan pembelian</li>
            <li>• Rekomendasi strategi bisnis</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Recent Reports -->
    <div class="m-2 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Riwayat Generate Laporan
      </h3>
      <div v-if="recentReports.length === 0" class="text-center py-8">
        <div class="text-gray-500 dark:text-gray-400">
          Belum ada laporan yang di-generate
        </div>
      </div>
      <div v-else class="space-y-3">
        <div
          v-for="report in recentReports"
          :key="report.id"
          class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
        >
          <div class="flex items-center space-x-3">
            <div
              class="w-10 h-10 rounded-full flex items-center justify-center"
              :class="getReportTypeStyle(report.type).bg"
            >
              <svg
                class="w-5 h-5"
                :class="getReportTypeStyle(report.type).text"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </div>
            <div>
              <p class="font-medium text-gray-900 dark:text-white">
                {{ report.name }}
              </p>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {{ formatDateTime(report.timestamp) }}
              </p>
            </div>
          </div>
          <span
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
            :class="getReportTypeStyle(report.type).badge"
          >
            {{ report.type }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const router = useRouter();
const url = import.meta.env.VITE_API_URL;

// Data
const salesReportMonth = ref(new Date().getMonth() + 1);
const salesReportYear = ref(new Date().getFullYear());
const purchaseReportMonth = ref(new Date().getMonth() + 1);
const purchaseReportYear = ref(new Date().getFullYear());
const combinedReportMonth = ref(new Date().getMonth() + 1);
const combinedReportYear = ref(new Date().getFullYear());

const generatingSalesReport = ref(false);
const generatingPurchaseReport = ref(false);
const generatingCombinedReport = ref(false);

const recentReports = ref([]);

// Computed
const months = computed(() => [
  { value: 1, label: "Januari" },
  { value: 2, label: "Februari" },
  { value: 3, label: "Maret" },
  { value: 4, label: "April" },
  { value: 5, label: "Mei" },
  { value: 6, label: "Juni" },
  { value: 7, label: "Juli" },
  { value: 8, label: "Agustus" },
  { value: 9, label: "September" },
  { value: 10, label: "Oktober" },
  { value: 11, label: "November" },
  { value: 12, label: "Desember" },
]);

const years = computed(() => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = currentYear; i >= currentYear - 5; i--) {
    years.push(i);
  }
  return years;
});

// Methods
const formatDateTime = (timestamp) => {
  return new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Makassar",
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(timestamp));
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(amount || 0);
};

const getReportTypeStyle = (type) => {
  const styles = {
    Penjualan: {
      bg: "bg-green-100",
      text: "text-green-600",
      badge: "bg-green-100 text-green-800",
    },
    Pembelian: {
      bg: "bg-blue-100",
      text: "text-blue-600",
      badge: "bg-blue-100 text-blue-800",
    },
    Gabungan: {
      bg: "bg-purple-100",
      text: "text-purple-600",
      badge: "bg-purple-100 text-purple-800",
    },
  };
  return styles[type] || styles["Gabungan"];
};

const generateSalesReport = async () => {
  generatingSalesReport.value = true;
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(`${url}/reports/sales`, {
      params: {
        month: salesReportMonth.value,
        year: salesReportYear.value,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: "blob", // Important for downloading files
    });

    // Create download link
    const monthName = months.value.find(
      (m) => m.value === salesReportMonth.value
    )?.label;
    const fileName = `Laporan_Penjualan_${monthName}_${salesReportYear.value}.xlsx`;

    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(link.href);

    // Add to recent reports
    addToRecentReports("Penjualan", fileName);
  } catch (error) {
    console.error("Error generating sales report:", error);
    alert("Error generating sales report. Please try again.");
  } finally {
    generatingSalesReport.value = false;
  }
};

const generatePurchaseReport = async () => {
  generatingPurchaseReport.value = true;
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(`${url}/reports/purchases`, {
      params: {
        month: purchaseReportMonth.value,
        year: purchaseReportYear.value,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: "blob", // Important for downloading files
    });

    // Create download link
    const monthName = months.value.find(
      (m) => m.value === purchaseReportMonth.value
    )?.label;
    const fileName = `Laporan_Pembelian_${monthName}_${purchaseReportYear.value}.xlsx`;

    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(link.href);

    // Add to recent reports
    addToRecentReports("Pembelian", fileName);
  } catch (error) {
    console.error("Error generating purchase report:", error);
    alert("Error generating purchase report. Please try again.");
  } finally {
    generatingPurchaseReport.value = false;
  }
};

const generateCombinedReport = async () => {
  generatingCombinedReport.value = true;
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(`${url}/reports/combined`, {
      params: {
        month: combinedReportMonth.value,
        year: combinedReportYear.value,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: "blob", // Important for downloading files
    });

    // Create download link
    const monthName = months.value.find(
      (m) => m.value === combinedReportMonth.value
    )?.label;
    const fileName = `Laporan_Gabungan_${monthName}_${combinedReportYear.value}.xlsx`;

    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(link.href);

    // Add to recent reports
    addToRecentReports("Gabungan", fileName);
  } catch (error) {
    console.error("Error generating combined report:", error);
    alert("Error generating combined report. Please try again.");
  } finally {
    generatingCombinedReport.value = false;
  }
};

const addToRecentReports = (type, fileName) => {
  const newReport = {
    id: Date.now(),
    type,
    name: fileName,
    timestamp: new Date(),
  };

  recentReports.value.unshift(newReport);

  // Keep only last 10 reports
  if (recentReports.value.length > 10) {
    recentReports.value = recentReports.value.slice(0, 10);
  }

  // Save to localStorage
  localStorage.setItem("recentReports", JSON.stringify(recentReports.value));
};

const loadRecentReports = () => {
  const saved = localStorage.getItem("recentReports");
  if (saved) {
    recentReports.value = JSON.parse(saved);
  }
};

onMounted(() => {
  loadRecentReports();
});
</script>
