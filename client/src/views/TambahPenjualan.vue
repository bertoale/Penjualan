<template>
  <div class="max-w-6xl mx-auto">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          Kasir - Tambah Penjualan
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          {{ formatDate(new Date()) }}
        </p>
      </div>
      <button
        @click="goBack"
        class="text-blue-600 hover:text-blue-800 dark:text-blue-400"
      >
        ← Kembali ke Daftar Penjualan
      </button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left Column - Product Selection -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Product Search -->
        <div class="m-2 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Cari Produk
          </h2>
          <div class="relative">
            <input
              v-model="searchQuery"
              @input="searchProducts"
              type="text"
              placeholder="Cari produk..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <svg
              class="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        <!-- Product Grid -->
        <div class="m-2 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Daftar Produk
          </h2>

          <!-- Loading State -->
          <div v-if="loadingProducts" class="text-center py-8">
            <div class="text-gray-500">Memuat produk...</div>
          </div>

          <!-- Product Grid -->
          <div
            v-else
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            <div
              v-for="produk in filteredProducts"
              :key="produk.id"
              @click="addToCart(produk)"
              class="border border-gray-200 dark:border-gray-600 rounded-lg p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              :class="produk.stok <= 0 ? 'opacity-50 cursor-not-allowed' : ''"
            >
              <div
                class="text-sm font-medium text-gray-900 dark:text-white mb-1"
              >
                {{ produk.nama }}
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-400 mb-2">
                {{ produk.ProdukKategori?.nama || "Tanpa Kategori" }}
              </div>
              <div
                class="text-lg font-bold text-green-600 dark:text-green-400 mb-1"
              >
                {{ formatCurrency(produk.harga_jual) }}
              </div>
              <div
                class="text-xs"
                :class="produk.stok <= 5 ? 'text-red-500' : 'text-gray-500'"
              >
                Stok: {{ produk.stok }}
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div
            v-if="!loadingProducts && filteredProducts.length === 0"
            class="text-center py-8"
          >
            <div class="text-gray-500">
              {{
                searchQuery
                  ? "Tidak ada produk yang ditemukan"
                  : "Belum ada produk"
              }}
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column - Cart & Checkout -->
      <div class="space-y-6">
        <!-- Customer Selection -->

        <!-- Shopping Cart -->
        <div
          class="m-2 bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden"
        >
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
              Keranjang Belanja
            </h2>
          </div>

          <div class="max-h-96 overflow-y-auto">
            <!-- Cart Items -->
            <div v-if="cartItems.length > 0">
              <div
                v-for="item in cartItems"
                :key="item.id"
                class="px-6 py-4 border-b border-gray-100 dark:border-gray-700"
              >
                <div class="flex justify-between items-start">
                  <div class="flex-1">
                    <h3 class="font-medium text-gray-900 dark:text-white">
                      {{ item.nama }}
                    </h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                      {{ formatCurrency(item.harga_jual) }} / item
                    </p>
                  </div>
                  <button
                    @click="removeFromCart(item.id)"
                    class="text-red-500 hover:text-red-700 ml-2"
                  >
                    <svg
                      class="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
                <div class="flex items-center justify-between mt-2">
                  <div class="flex items-center space-x-2">
                    <button
                      @click="decreaseQty(item.id)"
                      class="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 flex items-center justify-center"
                    >
                      -
                    </button>
                    <span class="w-12 text-center font-medium">{{
                      item.qty
                    }}</span>
                    <button
                      @click="increaseQty(item.id)"
                      class="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 flex items-center justify-center"
                      :disabled="item.qty >= item.stok"
                    >
                      +
                    </button>
                  </div>
                  <div class="text-right">
                    <p class="font-bold text-gray-900 dark:text-white">
                      {{ formatCurrency(item.harga_jual * item.qty) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty Cart -->
            <div v-else class="px-6 py-8 text-center">
              <div class="text-gray-500 dark:text-gray-400">
                Keranjang masih kosong
              </div>
            </div>
          </div>

          <!-- Cart Summary -->
          <div
            v-if="cartItems.length > 0"
            class="px-6 py-4 bg-gray-50 dark:bg-gray-700"
          >
            <div class="space-y-2">
              <div class="flex justify-between text-sm">
                <span>Total Item:</span>
                <span>{{ getTotalItems() }} item</span>
              </div>
              <div class="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span class="text-green-600 dark:text-green-400">
                  {{ formatCurrency(getTotalPrice()) }}
                </span>
              </div>
            </div>

            <!-- Checkout Button -->
            <button
              @click="checkout"
              :disabled="processing || cartItems.length === 0"
              class="w-full mt-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              {{ processing ? "Memproses..." : "Checkout" }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <div
      v-if="showSuccessModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div
        class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4"
      >
        <div class="text-center">
          <div class="text-green-500 text-6xl mb-4">✓</div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Transaksi Berhasil!
          </h3>
          <p class="text-gray-600 dark:text-gray-400 mb-4">
            Penjualan #{{ successData?.id }} telah berhasil disimpan
          </p>
          <p class="text-2xl font-bold text-green-600 dark:text-green-400 mb-6">
            {{ formatCurrency(successData?.total_harga) }}
          </p>
          <div class="space-y-2">
            <button
              @click="printReceipt"
              class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg"
            >
              Print Struk
            </button>
            <button
              @click="newTransaction"
              class="w-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-900 dark:text-white font-medium py-2 px-4 rounded-lg"
            >
              Transaksi Baru
            </button>
            <button
              @click="viewDetail"
              class="w-full text-blue-600 hover:text-blue-800 dark:text-blue-400 font-medium py-2"
            >
              Lihat Detail
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const router = useRouter();
const url = import.meta.env.VITE_API_URL;

// Data
const dataProduk = ref([]);
const dataPelanggan = ref([]);
const cartItems = ref([]);
const searchQuery = ref("");
const selectedPelanggan = ref(null);
const loadingProducts = ref(true);
const processing = ref(false);
const showSuccessModal = ref(false);
const successData = ref(null);

// Computed
const filteredProducts = computed(() => {
  if (!searchQuery.value) return dataProduk.value;

  return dataProduk.value.filter(
    (produk) =>
      produk.nama.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      produk.ProdukKategori?.nama
        ?.toLowerCase()
        .includes(searchQuery.value.toLowerCase())
  );
});

// Methods
const formatDate = (date) => {
  return new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Makassar",
    dateStyle: "full",
    timeStyle: "short",
  }).format(date);
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(amount);
};

const goBack = () => {
  router.push("/penjualan");
};

const searchProducts = () => {
  // Search is handled by computed property
};

const addToCart = (produk) => {
  if (produk.stok <= 0) return;

  const existingItem = cartItems.value.find((item) => item.id === produk.id);

  if (existingItem) {
    if (existingItem.qty < produk.stok) {
      existingItem.qty++;
    }
  } else {
    cartItems.value.push({
      ...produk,
      qty: 1,
    });
  }
};

const removeFromCart = (produkId) => {
  const index = cartItems.value.findIndex((item) => item.id === produkId);
  if (index > -1) {
    cartItems.value.splice(index, 1);
  }
};

const increaseQty = (produkId) => {
  const item = cartItems.value.find((item) => item.id === produkId);
  if (item && item.qty < item.stok) {
    item.qty++;
  }
};

const decreaseQty = (produkId) => {
  const item = cartItems.value.find((item) => item.id === produkId);
  if (item) {
    if (item.qty > 1) {
      item.qty--;
    } else {
      removeFromCart(produkId);
    }
  }
};

const getTotalItems = () => {
  return cartItems.value.reduce((total, item) => total + item.qty, 0);
};

const getTotalPrice = () => {
  return cartItems.value.reduce(
    (total, item) => total + item.harga_jual * item.qty,
    0
  );
};

const checkout = async () => {
  if (cartItems.value.length === 0) return;

  try {
    processing.value = true;

    const items = cartItems.value.map((item) => ({
      produk_id: item.id,
      qty: item.qty,
    }));

    const payload = {
      pelanggan_id: selectedPelanggan.value,
      items: items,
    };

    console.log("Checkout payload:", payload);

    const token = localStorage.getItem("token");
    const response = await axios.post(`${url}/penjualan`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log("Checkout response:", response.data);
    successData.value = response.data.penjualan;
    showSuccessModal.value = true;

    // Reset cart
    cartItems.value = [];
    selectedPelanggan.value = null;

    // Refresh product data to update stock
    await getAllProduk();
  } catch (error) {
    console.error("Checkout error:", error);
    alert(error.response?.data?.message || "Gagal melakukan checkout");
  } finally {
    processing.value = false;
  }
};

const printReceipt = () => {
  // Implement print functionality
  window.print();
};

const newTransaction = () => {
  showSuccessModal.value = false;
  successData.value = null;
};

const viewDetail = () => {
  if (successData.value) {
    router.push(`/penjualan/${successData.value.id}`);
  }
};

const getAllProduk = async () => {
  try {
    loadingProducts.value = true;
    const token = localStorage.getItem("token");
    const response = await axios.get(`${url}/produk?limit=100`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Produk Response:", response.data);
    dataProduk.value = response.data.produk || [];
  } catch (error) {
    console.error("Error fetching products:", error);
  } finally {
    loadingProducts.value = false;
  }
};

const getAllPelanggan = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${url}/pelanggan?limit=100`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Pelanggan Response:", response.data);
    dataPelanggan.value = response.data.pelanggan || [];
  } catch (error) {
    console.error("Error fetching customers:", error);
  }
};

onMounted(() => {
  getAllProduk();
  getAllPelanggan();
});
</script>

<style scoped>
@media print {
  body * {
    visibility: hidden;
  }
  .print-section,
  .print-section * {
    visibility: visible;
  }
  .print-section {
    position: absolute;
    left: 0;
    top: 0;
  }
}
</style>
