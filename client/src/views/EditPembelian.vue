<template>
  <div class="max-w-6xl mx-auto">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          Edit Pembelian #{{ pembelianId }}
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

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8">
      <div class="text-gray-500">Memuat data pembelian...</div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-8">
      <div class="text-red-500">{{ error }}</div>
    </div>

    <!-- Main Content -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left Column - Product Search & Cart -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Product Search -->
        <div class="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Cari Produk
          </h2>
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Cari produk..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              @input="searchProducts"
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

          <!-- Product Grid -->
          <div
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4"
          >
            <div
              v-for="product in filteredProducts"
              :key="product.id"
              @click="addToCart(product)"
              class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow bg-gray-50 dark:bg-gray-700"
            >
              <h3 class="font-medium text-gray-900 dark:text-white">
                {{ product.nama }}
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                {{ product.ProdukKategori?.nama }}
              </p>
              <p class="text-sm font-semibold text-blue-600 dark:text-blue-400">
                {{ formatCurrency(product.harga_beli) }}
              </p>
              <p class="text-xs text-gray-500">Stok: {{ product.stok }}</p>
            </div>
          </div>
        </div>

        <!-- Shopping Cart -->
        <div class="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Keranjang Pembelian
          </h2>

          <div
            v-if="cartItems.length === 0"
            class="text-center py-8 text-gray-500 dark:text-gray-400"
          >
            Belum ada produk di keranjang
          </div>

          <div v-else class="space-y-4">
            <div
              v-for="item in cartItems"
              :key="item.id"
              class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div class="flex-1">
                <h4 class="font-medium text-gray-900 dark:text-white">
                  {{ item.nama }}
                </h4>
                <div class="flex items-center space-x-2 mt-2">
                  <label class="text-sm text-gray-600 dark:text-gray-400"
                    >Harga Beli:</label
                  >
                  <input
                    v-model="item.harga_beli"
                    type="number"
                    step="0.01"
                    class="w-32 px-2 py-1 text-sm border border-gray-300 rounded dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                    @change="updateSubtotal(item)"
                  />
                </div>
              </div>

              <div class="flex items-center space-x-2">
                <button
                  @click="decrementQuantity(item)"
                  class="p-1 text-gray-500 hover:text-gray-700"
                >
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                </button>

                <span
                  class="px-3 py-1 bg-white dark:bg-gray-600 rounded text-center min-w-[3rem]"
                >
                  {{ item.jumlah }}
                </span>

                <button
                  @click="incrementQuantity(item)"
                  class="p-1 text-gray-500 hover:text-gray-700"
                >
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                </button>

                <button
                  @click="removeFromCart(item)"
                  class="p-1 text-red-500 hover:text-red-700 ml-2"
                >
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                </button>
              </div>

              <div class="text-right ml-4">
                <p class="font-semibold text-gray-900 dark:text-white">
                  {{ formatCurrency(item.subtotal) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column - Supplier & Checkout -->
      <div class="space-y-6">
        <!-- Supplier Selection -->
        <div class="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Supplier
          </h3>
          <select
            v-model="selectedSupplier"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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

          <div
            v-if="selectedSupplierData"
            class="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
          >
            <p class="font-medium text-gray-900 dark:text-white">
              {{ selectedSupplierData.nama }}
            </p>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ selectedSupplierData.no_hp }}
            </p>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ selectedSupplierData.alamat }}
            </p>
          </div>
        </div>

        <!-- Checkout Summary -->
        <div class="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Ringkasan Transaksi
          </h3>

          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-gray-600 dark:text-gray-400">Total Item:</span>
              <span class="font-medium text-gray-900 dark:text-white">{{
                totalItems
              }}</span>
            </div>

            <div class="flex justify-between">
              <span class="text-gray-600 dark:text-gray-400">Subtotal:</span>
              <span class="font-medium text-gray-900 dark:text-white">{{
                formatCurrency(totalAmount)
              }}</span>
            </div>

            <hr class="border-gray-200 dark:border-gray-700" />

            <div class="flex justify-between text-lg font-bold">
              <span class="text-gray-900 dark:text-white">Total:</span>
              <span class="text-blue-600 dark:text-blue-400">{{
                formatCurrency(totalAmount)
              }}</span>
            </div>
          </div>

          <button
            @click="updatePurchase"
            :disabled="
              cartItems.length === 0 || !selectedSupplier || isProcessing
            "
            class="w-full mt-6 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {{ isProcessing ? "Memproses..." : "Update Pembelian" }}
          </button>
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <div
      v-if="showSuccessModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
    >
      <div
        class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800"
      >
        <div class="mt-3 text-center">
          <div
            class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4"
          >
            <svg
              class="w-6 h-6 text-blue-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clip-rule="evenodd"
              ></path>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">
            Pembelian Berhasil Diupdate!
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Transaksi pembelian telah berhasil diperbarui.
          </p>
          <div class="mt-4 flex gap-2">
            <button
              @click="goBack"
              class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
            >
              Kembali ke Daftar
            </button>
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

const pembelianId = ref(route.params.id);
const loading = ref(true);
const error = ref(null);
const isProcessing = ref(false);
const showSuccessModal = ref(false);

const searchQuery = ref("");
const products = ref([]);
const suppliers = ref([]);
const cartItems = ref([]);
const selectedSupplier = ref("");
const purchaseDate = ref(new Date().toISOString().split("T")[0]);

const filteredProducts = computed(() => {
  if (!searchQuery.value) return products.value.slice(0, 12);
  return products.value
    .filter((product) =>
      product.nama.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
    .slice(0, 12);
});

const selectedSupplierData = computed(() => {
  return suppliers.value.find((s) => s.id === parseInt(selectedSupplier.value));
});

const totalItems = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + item.jumlah, 0);
});

const totalAmount = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + item.subtotal, 0);
});

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(amount);
};

const formatDate = (date) => {
  return new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Makassar",
    dateStyle: "full",
  }).format(date);
};

const fetchProducts = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${url}/produk`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    products.value = response.data.produk || [];
  } catch (err) {
    console.error("Error fetching products:", err);
  }
};

const fetchSuppliers = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${url}/supplier`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    suppliers.value = response.data.supplier || [];
  } catch (err) {
    console.error("Error fetching suppliers:", err);
  }
};

const fetchPurchaseData = async () => {
  try {
    loading.value = true;
    const token = localStorage.getItem("token");
    const response = await axios.get(`${url}/pembelian/${pembelianId.value}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const purchaseData = response.data.pembelian;

    // Set supplier
    selectedSupplier.value = purchaseData.SupplierId;

    // Convert purchase details to cart items
    cartItems.value = purchaseData.PembelianDetails.map((detail) => ({
      id: detail.Produk.id,
      nama: detail.Produk.nama,
      harga_beli: parseFloat(detail.harga_satuan),
      jumlah: detail.qty,
      subtotal: parseFloat(detail.harga_satuan) * detail.qty,
      ProdukKategori: detail.Produk.ProdukKategori,
    }));

    purchaseDate.value = new Date(purchaseData.tanggal)
      .toISOString()
      .split("T")[0];
  } catch (err) {
    console.error("Error fetching purchase data:", err);
    error.value = "Gagal memuat data pembelian";
  } finally {
    loading.value = false;
  }
};

const addToCart = (product) => {
  const existingItem = cartItems.value.find((item) => item.id === product.id);

  if (existingItem) {
    existingItem.jumlah++;
    updateSubtotal(existingItem);
  } else {
    cartItems.value.push({
      id: product.id,
      nama: product.nama,
      harga_beli: product.harga_beli,
      jumlah: 1,
      subtotal: product.harga_beli,
      ProdukKategori: product.ProdukKategori,
    });
  }
};

const incrementQuantity = (item) => {
  item.jumlah++;
  updateSubtotal(item);
};

const decrementQuantity = (item) => {
  if (item.jumlah > 1) {
    item.jumlah--;
    updateSubtotal(item);
  }
};

const updateSubtotal = (item) => {
  item.subtotal = item.harga_beli * item.jumlah;
};

const removeFromCart = (item) => {
  const index = cartItems.value.findIndex(
    (cartItem) => cartItem.id === item.id
  );
  if (index > -1) {
    cartItems.value.splice(index, 1);
  }
};

const updatePurchase = async () => {
  if (cartItems.value.length === 0) {
    alert("Keranjang belanja kosong!");
    return;
  }

  if (!selectedSupplier.value) {
    alert("Pilih supplier terlebih dahulu!");
    return;
  }

  try {
    isProcessing.value = true;
    const token = localStorage.getItem("token");

    const purchaseData = {
      tanggal: purchaseDate.value,
      supplier_id: selectedSupplier.value,
      items: cartItems.value.map((item) => ({
        produk_id: item.id,
        qty: item.jumlah,
        harga_satuan: item.harga_beli,
        subtotal: item.subtotal,
      })),
      total_harga: totalAmount.value,
    };

    await axios.put(`${url}/pembelian/${pembelianId.value}`, purchaseData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    showSuccessModal.value = true;
  } catch (err) {
    console.error("Error updating purchase:", err);
    alert(
      "Gagal mengupdate pembelian: " +
        (err.response?.data?.message || err.message)
    );
  } finally {
    isProcessing.value = false;
  }
};

const searchProducts = () => {
  // The filtering is handled by computed property
};

const goBack = () => {
  router.push("/pembelian");
};

onMounted(() => {
  fetchProducts();
  fetchSuppliers();
  fetchPurchaseData();
});
</script>
