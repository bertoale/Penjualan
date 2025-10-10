<template>
  <div class="max-w-6xl mx-auto">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          Tambah Pembelian Barang
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          {{ formatDate(new Date()) }}
        </p>
      </div>
      <button
        @click="goBack"
        class="text-blue-600 hover:text-blue-800 dark:text-blue-400"
      >
        ← Kembali ke Daftar Pembelian
      </button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left Column - Product Selection -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Product Search -->
        <div class="m-2 m-2 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
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

        <!-- Product List -->
        <div class="m-2 m-2 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Daftar Produk
          </h2>
          <div
            class="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto"
          >
            <div
              v-for="produk in filteredProducts"
              :key="produk.id"
              class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
              @click="addToCart(produk)"
            >
              <h3 class="font-medium text-gray-900 dark:text-white">
                {{ produk.nama }}
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {{ produk.ProdukKategori?.nama || "Tanpa Kategori" }}
              </p>
              <p class="text-sm text-blue-600 dark:text-blue-400 mt-1">
                Stok: {{ produk.stok }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column - Purchase Summary -->
      <div class="space-y-6">
        <!-- Supplier Selection -->
        <div class="m-2 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Pilih Supplier
          </h2>
          <select
            v-model="selectedSupplier"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
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

        <!-- Purchase Date -->
        <div class="m-2 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Tanggal Pembelian
          </h2>
          <input
            v-model="purchaseDate"
            type="date"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>

        <!-- Cart -->
        <div class="m-2 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Keranjang Pembelian
          </h2>

          <div v-if="cartItems.length === 0" class="text-center py-8">
            <p class="text-gray-500 dark:text-gray-400">
              Belum ada produk dipilih
            </p>
          </div>

          <div v-else class="space-y-4">
            <div
              v-for="item in cartItems"
              :key="item.id"
              class="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
            >
              <div class="flex justify-between items-start mb-2">
                <h3 class="font-medium text-gray-900 dark:text-white">
                  {{ item.nama }}
                </h3>
                <button
                  @click="removeFromCart(item.id)"
                  class="text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>

              <div class="space-y-2">
                <div>
                  <label class="block text-xs text-gray-500 dark:text-gray-400">
                    Harga Beli
                  </label>
                  <input
                    v-model.number="item.harga_beli"
                    @input="updateSubtotal(item)"
                    type="number"
                    min="0"
                    step="0.01"
                    class="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label class="block text-xs text-gray-500 dark:text-gray-400">
                    Jumlah
                  </label>
                  <input
                    v-model.number="item.jumlah"
                    @input="updateSubtotal(item)"
                    type="number"
                    min="1"
                    class="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="1"
                  />
                </div>

                <div class="text-right">
                  <span
                    class="text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Subtotal: {{ formatCurrency(item.subtotal || 0) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Total & Submit -->
        <div class="m-2 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
          <div class="mb-4">
            <div
              class="flex justify-between items-center text-lg font-semibold"
            >
              <span class="text-gray-900 dark:text-white">Total:</span>
              <span class="text-blue-600 dark:text-blue-400">
                {{ formatCurrency(totalAmount) }}
              </span>
            </div>
          </div>

          <button
            @click="submitPurchase"
            :disabled="!canSubmit"
            class="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
          >
            Proses Pembelian
          </button>
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
const searchQuery = ref("");
const products = ref([]);
const suppliers = ref([]);
const cartItems = ref([]);
const selectedSupplier = ref("");
const purchaseDate = ref(new Date().toISOString().split("T")[0]);

// Computed
const filteredProducts = computed(() => {
  if (!searchQuery.value) return products.value;
  return products.value.filter((produk) => {
    const kategoriNama = produk.ProdukKategori?.nama || "";
    return (
      produk.nama.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      kategoriNama.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  });
});

const totalAmount = computed(() => {
  return cartItems.value.reduce(
    (total, item) => total + (item.subtotal || 0),
    0
  );
});

const canSubmit = computed(() => {
  return (
    cartItems.value.length > 0 &&
    selectedSupplier.value &&
    purchaseDate.value &&
    cartItems.value.every((item) => item.harga_beli > 0 && item.jumlah > 0)
  );
});

// Methods
const formatDate = (date) => {
  return new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Makassar",
    dateStyle: "full",
  }).format(date);
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(amount);
};

const searchProducts = () => {
  // Search is handled by computed property
};

const addToCart = (produk) => {
  const existingItem = cartItems.value.find((item) => item.id === produk.id);

  if (existingItem) {
    existingItem.jumlah += 1;
    updateSubtotal(existingItem);
  } else {
    cartItems.value.push({
      id: produk.id,
      nama: produk.nama,
      kategori: produk.ProdukKategori?.nama || "Tanpa Kategori",
      harga_beli: 0,
      jumlah: 1,
      subtotal: 0,
    });
  }
};

const removeFromCart = (produkId) => {
  cartItems.value = cartItems.value.filter((item) => item.id !== produkId);
};

const updateSubtotal = (item) => {
  item.subtotal = (item.harga_beli || 0) * (item.jumlah || 0);
};

const goBack = () => {
  router.push("/pembelian");
};

const submitPurchase = async () => {
  try {
    const token = localStorage.getItem("token");

    const purchaseData = {
      tanggal: purchaseDate.value,
      supplier_id: selectedSupplier.value,
      items: cartItems.value.map((item) => ({
        produk_id: item.id,
        qty: item.jumlah,
        harga_satuan: item.harga_beli,
      })),
      total_harga: totalAmount.value,
    };

    await axios.post(`${url}/pembelian`, purchaseData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    alert("Pembelian berhasil disimpan!");
    router.push("/pembelian");
  } catch (error) {
    console.error("Error submitting purchase:", error);
    if (error.response && error.response.data && error.response.data.message) {
      alert(`Gagal menyimpan pembelian: ${error.response.data.message}`);
    } else {
      alert("Gagal menyimpan pembelian. Silakan coba lagi.");
    }
  }
};

const fetchProducts = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${url}/produk`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    products.value = response.data.produk || [];
  } catch (error) {
    console.error("Error fetching products:", error);
  }
};

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

onMounted(() => {
  fetchProducts();
  fetchSuppliers();
});
</script>
