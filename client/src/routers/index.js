//import dependencies
import { createRouter, createWebHistory } from "vue-router";

//import layouts
import SidebarDrawer from "@/layouts/SidebarDrawer.vue";

//import views
import Login from "@/views/Login.vue";
import Produk from "@/views/Produk.vue";
import ProdukKategori from "@/views/ProdukKategori.vue";
import Dashboard from "@/views/Dashboard.vue";
import Penjualan from "@/views/Penjualan.vue";
import PenjualanDetail from "@/views/PenjualanDetail.vue";
import TambahPenjualan from "@/views/TambahPenjualan.vue";
import EditPenjualan from "@/views/EditPenjualan.vue";
import Pembelian from "@/views/Pembelian.vue";
import PembelianDetail from "@/views/PembelianDetail.vue";
import TambahPembelian from "@/views/TambahPembelian.vue";
import EditPembelian from "@/views/EditPembelian.vue";
import Supplier from "@/views/Supplier.vue";
import User from "@/views/User.vue";
import Reports from "@/views/Reports.vue";

//define routes
const routes = [
  {
    path: "/",
    children: [
      {
        path: "",
        name: "login",
        component: Login,
      },
    ],
  },
  {
    path: "/",
    component: SidebarDrawer,
    children: [
      {
        path: "dashboard",
        name: "dashboard",
        component: Dashboard,
      },
      {
        path: "produk",
        name: "produk",
        component: Produk,
      },
      {
        path: "produk-kategori",
        name: "produk-kategori",
        component: ProdukKategori,
      },
      {
        path: "penjualan",
        name: "penjualan",
        component: Penjualan,
      },
      {
        path: "penjualan/:id",
        name: "penjualan-detail",
        component: PenjualanDetail,
      },
      {
        path: "tambah-penjualan",
        name: "tambah-penjualan",
        component: TambahPenjualan,
      },
      {
        path: "edit-penjualan/:id",
        name: "edit-penjualan",
        component: EditPenjualan,
      },
      {
        path: "pembelian",
        name: "pembelian",
        component: Pembelian,
      },
      {
        path: "pembelian/:id",
        name: "pembelian-detail",
        component: PembelianDetail,
      },
      {
        path: "tambah-pembelian",
        name: "tambah-pembelian",
        component: TambahPembelian,
      },
      {
        path: "edit-pembelian/:id",
        name: "edit-pembelian",
        component: EditPembelian,
      },
      {
        path: "supplier",
        name: "supplier",
        component: Supplier,
      },
      {
        path: "user",
        name: "user",
        component: User,
      },
      {
        path: "reports",
        name: "reports",
        component: Reports,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: "smooth",
      };
    } else if (savedPosition) {
      return savedPosition;
    } else {
      return { left: 0, top: 0 };
    }
  },
});

export default router;
