import {
  Penjualan,
  PenjualanDetail,
  Pembelian,
  PembelianDetail,
  Produk,
  ProdukKategori,
  Supplier,
  sequelize,
} from "../models/index.js";
import { Op } from "sequelize";
import XLSX from "xlsx";
import path from "path";
import fs from "fs";

// Helper function untuk format currency
const formatCurrency = (amount) => {
  const value = parseFloat(amount) || 0;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

// Helper function untuk format number
const formatNumber = (number) => {
  const value = parseFloat(number) || 0;
  return new Intl.NumberFormat("id-ID").format(value);
};

// Helper function untuk safe number conversion
const safeNumber = (value) => {
  const num = parseFloat(value);
  return isNaN(num) ? 0 : num;
};

// Generate Sales Report
export const generateSalesReport = async (req, res) => {
  try {
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({
        message: "Month dan year harus diisi",
      });
    }

    // Create date range
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    // Fetch sales data
    const salesData = await Penjualan.findAll({
      where: {
        createdAt: {
          [Op.between]: [startDate, endDate],
        },
      },
      include: [
        {
          model: PenjualanDetail,
          include: [
            {
              model: Produk,
              attributes: ["id", "nama", "harga_jual"],
              include: [
                {
                  model: ProdukKategori,
                  attributes: ["nama"],
                },
              ],
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    // Calculate statistics
    const totalSales = salesData.reduce(
      (sum, sale) => sum + safeNumber(sale.total_harga),
      0
    );
    const totalTransactions = salesData.length;
    const averageTransaction =
      totalTransactions > 0 ? totalSales / totalTransactions : 0;

    // Create workbook
    const wb = XLSX.utils.book_new();

    // 1. Summary Sheet
    const summaryData = [
      ["LAPORAN PENJUALAN BULANAN"],
      [""],
      ["Periode:", getMonthName(month) + " " + year],
      ["Tanggal Generate:", new Date().toLocaleDateString("id-ID")],
      [""],
      ["RINGKASAN PENJUALAN"],
      ["Total Penjualan:", formatCurrency(totalSales)],
      ["Total Transaksi:", formatNumber(totalTransactions)],
      ["Rata-rata per Transaksi:", formatCurrency(averageTransaction)],
      [""],
      ["STATISTIK HARIAN"],
      ["Tanggal", "Jumlah Transaksi", "Total Penjualan"],
      ...generateDailySalesStats(salesData),
    ];

    const summaryWs = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, summaryWs, "Ringkasan");

    // 2. Detail Transactions Sheet
    const detailData = [
      ["DETAIL TRANSAKSI PENJUALAN"],
      [""],
      ["ID", "Tanggal", "Waktu", "Total", "Jumlah Item"],
    ];

    salesData.forEach((sale) => {
      const date = new Date(sale.createdAt);
      const itemCount = sale.PenjualanDetails
        ? sale.PenjualanDetails.length
        : 0;

      detailData.push([
        sale.id,
        date.toLocaleDateString("id-ID"),
        date.toLocaleTimeString("id-ID"),
        safeNumber(sale.total_harga),
        itemCount,
      ]);
    });

    const detailWs = XLSX.utils.aoa_to_sheet(detailData);
    XLSX.utils.book_append_sheet(wb, detailWs, "Detail Transaksi");

    // 3. Product Analysis Sheet
    const productAnalysis = generateProductAnalysis(salesData);
    const productData = [
      ["ANALISIS PRODUK TERLARIS"],
      [""],
      ["Produk", "Kategori", "Qty Terjual", "Total Revenue", "Rata-rata Harga"],
    ];

    Object.entries(productAnalysis)
      .sort((a, b) => b[1].qty - a[1].qty)
      .forEach(([productName, data]) => {
        const avgPrice = data.qty > 0 ? data.revenue / data.qty : 0;
        productData.push([
          productName,
          data.category || "Tanpa Kategori",
          data.qty,
          safeNumber(data.revenue),
          safeNumber(avgPrice),
        ]);
      });

    const productWs = XLSX.utils.aoa_to_sheet(productData);
    XLSX.utils.book_append_sheet(wb, productWs, "Analisis Produk");

    // Generate filename
    const monthName = getMonthName(month);
    const filename = `Laporan_Penjualan_${monthName}_${year}.xlsx`;

    // Set response headers
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    // Write to response
    const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
    res.send(buffer);
  } catch (error) {
    console.error("Generate sales report error:", error);
    res.status(500).json({
      message: "Gagal generate laporan penjualan",
      error: error.message,
    });
  }
};

// Generate Purchase Report
export const generatePurchaseReport = async (req, res) => {
  try {
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({
        message: "Month dan year harus diisi",
      });
    }

    // Create date range
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    // Fetch purchase data
    const purchaseData = await Pembelian.findAll({
      where: {
        tanggal: {
          [Op.between]: [startDate, endDate],
        },
      },
      include: [
        {
          model: Supplier,
          attributes: ["nama", "no_hp"],
        },
        {
          model: PembelianDetail,
          include: [
            {
              model: Produk,
              attributes: ["nama"],
              include: [
                {
                  model: ProdukKategori,
                  attributes: ["nama"],
                },
              ],
            },
          ],
        },
      ],
      order: [["tanggal", "DESC"]],
    });

    // Calculate statistics
    const totalPurchases = purchaseData.reduce(
      (sum, purchase) => sum + safeNumber(purchase.total_harga),
      0
    );
    const totalTransactions = purchaseData.length;
    const averageTransaction =
      totalTransactions > 0 ? totalPurchases / totalTransactions : 0;

    // Create workbook
    const wb = XLSX.utils.book_new();

    // 1. Summary Sheet
    const summaryData = [
      ["LAPORAN PEMBELIAN BULANAN"],
      [""],
      ["Periode:", getMonthName(month) + " " + year],
      ["Tanggal Generate:", new Date().toLocaleDateString("id-ID")],
      [""],
      ["RINGKASAN PEMBELIAN"],
      ["Total Pembelian:", formatCurrency(totalPurchases)],
      ["Total Transaksi:", formatNumber(totalTransactions)],
      ["Rata-rata per Transaksi:", formatCurrency(averageTransaction)],
      [""],
      ["STATISTIK HARIAN"],
      ["Tanggal", "Jumlah Transaksi", "Total Pembelian"],
      ...generateDailyPurchaseStats(purchaseData),
    ];

    const summaryWs = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, summaryWs, "Ringkasan");

    // 2. Detail Transactions Sheet
    const detailData = [
      ["DETAIL TRANSAKSI PEMBELIAN"],
      [""],
      ["ID", "Tanggal", "Supplier", "Total", "Jumlah Item"],
    ];

    purchaseData.forEach((purchase) => {
      const itemCount = purchase.PembelianDetails
        ? purchase.PembelianDetails.length
        : 0;

      detailData.push([
        purchase.id,
        new Date(purchase.tanggal).toLocaleDateString("id-ID"),
        purchase.Supplier ? purchase.Supplier.nama : "Tidak diketahui",
        safeNumber(purchase.total_harga),
        itemCount,
      ]);
    });

    const detailWs = XLSX.utils.aoa_to_sheet(detailData);
    XLSX.utils.book_append_sheet(wb, detailWs, "Detail Transaksi");

    // 3. Supplier Analysis Sheet
    const supplierAnalysis = generateSupplierAnalysis(purchaseData);
    const supplierData = [
      ["ANALISIS SUPPLIER"],
      [""],
      [
        "Supplier",
        "Jumlah Transaksi",
        "Total Pembelian",
        "Rata-rata Transaksi",
      ],
    ];

    Object.entries(supplierAnalysis)
      .sort((a, b) => b[1].total - a[1].total)
      .forEach(([supplierName, data]) => {
        const avgTransaction =
          data.transactions > 0 ? data.total / data.transactions : 0;
        supplierData.push([
          supplierName,
          data.transactions,
          safeNumber(data.total),
          safeNumber(avgTransaction),
        ]);
      });

    const supplierWs = XLSX.utils.aoa_to_sheet(supplierData);
    XLSX.utils.book_append_sheet(wb, supplierWs, "Analisis Supplier");

    // Generate filename
    const monthName = getMonthName(month);
    const filename = `Laporan_Pembelian_${monthName}_${year}.xlsx`;

    // Set response headers
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    // Write to response
    const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
    res.send(buffer);
  } catch (error) {
    console.error("Generate purchase report error:", error);
    res.status(500).json({
      message: "Gagal generate laporan pembelian",
      error: error.message,
    });
  }
};

// Generate Combined Report
export const generateCombinedReport = async (req, res) => {
  try {
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({
        message: "Month dan year harus diisi",
      });
    }

    // Create date range
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    // Fetch both sales and purchase data
    const [salesData, purchaseData] = await Promise.all([
      Penjualan.findAll({
        where: {
          createdAt: {
            [Op.between]: [startDate, endDate],
          },
        },
        include: [
          {
            model: PenjualanDetail,
            include: [
              {
                model: Produk,
                attributes: ["nama", "harga_jual"],
              },
            ],
          },
        ],
      }),
      Pembelian.findAll({
        where: {
          tanggal: {
            [Op.between]: [startDate, endDate],
          },
        },
        include: [
          {
            model: PembelianDetail,
            include: [
              {
                model: Produk,
                attributes: ["nama"],
              },
            ],
          },
        ],
      }),
    ]);

    // Calculate financial overview
    const totalSales = salesData.reduce(
      (sum, sale) => sum + safeNumber(sale.total_harga),
      0
    );
    const totalPurchases = purchaseData.reduce(
      (sum, purchase) => sum + safeNumber(purchase.total_harga),
      0
    );
    const grossProfit = totalSales - totalPurchases;
    const profitMargin = totalSales > 0 ? (grossProfit / totalSales) * 100 : 0;

    // Create workbook
    const wb = XLSX.utils.book_new();

    // 1. Financial Overview Sheet
    const overviewData = [
      ["RINGKASAN KEUANGAN BULANAN"],
      [""],
      ["Periode:", getMonthName(month) + " " + year],
      ["Tanggal Generate:", new Date().toLocaleDateString("id-ID")],
      [""],
      ["RINGKASAN KEUANGAN"],
      ["Total Penjualan:", formatCurrency(totalSales)],
      ["Total Pembelian:", formatCurrency(totalPurchases)],
      ["Gross Profit:", formatCurrency(grossProfit)],
      ["Profit Margin:", safeNumber(profitMargin).toFixed(2) + "%"],
      [""],
      ["ANALISIS TRANSAKSI"],
      ["Transaksi Penjualan:", salesData.length],
      ["Transaksi Pembelian:", purchaseData.length],
      ["Total Transaksi:", salesData.length + purchaseData.length],
      [
        "Rata-rata Penjualan:",
        salesData.length > 0
          ? formatCurrency(totalSales / salesData.length)
          : formatCurrency(0),
      ],
      [
        "Rata-rata Pembelian:",
        purchaseData.length > 0
          ? formatCurrency(totalPurchases / purchaseData.length)
          : formatCurrency(0),
      ],
      [""],
      ["KESIMPULAN"],
      [grossProfit >= 0 ? "Status: PROFIT" : "Status: RUGI"],
      [
        "Rekomendasi:",
        grossProfit >= 0 ? "Pertahankan kinerja" : "Evaluasi strategi pricing",
      ],
    ];

    const overviewWs = XLSX.utils.aoa_to_sheet(overviewData);
    XLSX.utils.book_append_sheet(wb, overviewWs, "Ringkasan Keuangan");

    // 2. Sales Summary
    const salesSummary = [
      ["RINGKASAN PENJUALAN"],
      [""],
      ["Total Penjualan:", formatCurrency(totalSales)],
      ["Total Transaksi:", salesData.length],
      [
        "Rata-rata per Transaksi:",
        salesData.length > 0
          ? formatCurrency(totalSales / salesData.length)
          : formatCurrency(0),
      ],
      [""],
      ["DETAIL HARIAN PENJUALAN"],
      ["Tanggal", "Jumlah Transaksi", "Total Penjualan"],
      ...generateDailySalesStats(salesData),
    ];

    const salesWs = XLSX.utils.aoa_to_sheet(salesSummary);
    XLSX.utils.book_append_sheet(wb, salesWs, "Penjualan");

    // 3. Purchase Summary
    const purchaseSummary = [
      ["RINGKASAN PEMBELIAN"],
      [""],
      ["Total Pembelian:", formatCurrency(totalPurchases)],
      ["Total Transaksi:", purchaseData.length],
      [
        "Rata-rata per Transaksi:",
        purchaseData.length > 0
          ? formatCurrency(totalPurchases / purchaseData.length)
          : formatCurrency(0),
      ],
      [""],
      ["DETAIL HARIAN PEMBELIAN"],
      ["Tanggal", "Jumlah Transaksi", "Total Pembelian"],
      ...generateDailyPurchaseStats(purchaseData),
    ];

    const purchaseWs = XLSX.utils.aoa_to_sheet(purchaseSummary);
    XLSX.utils.book_append_sheet(wb, purchaseWs, "Pembelian");

    // Generate filename
    const monthName = getMonthName(month);
    const filename = `Laporan_Gabungan_${monthName}_${year}.xlsx`;

    // Set response headers
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    // Write to response
    const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
    res.send(buffer);
  } catch (error) {
    console.error("Generate combined report error:", error);
    res.status(500).json({
      message: "Gagal generate laporan gabungan",
      error: error.message,
    });
  }
};

// Helper Functions
function getMonthName(month) {
  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];
  return months[parseInt(month) - 1] || "Unknown";
}

function generateDailySalesStats(salesData) {
  const dailyStats = {};

  salesData.forEach((sale) => {
    const date = new Date(sale.createdAt).toLocaleDateString("id-ID");
    if (!dailyStats[date]) {
      dailyStats[date] = { count: 0, total: 0 };
    }
    dailyStats[date].count += 1;
    dailyStats[date].total += safeNumber(sale.total_harga);
  });

  return Object.entries(dailyStats)
    .sort(
      (a, b) =>
        new Date(a[0].split("/").reverse().join("-")) -
        new Date(b[0].split("/").reverse().join("-"))
    )
    .map(([date, data]) => [date, data.count, safeNumber(data.total)]);
}

function generateDailyPurchaseStats(purchaseData) {
  const dailyStats = {};

  purchaseData.forEach((purchase) => {
    const date = new Date(purchase.tanggal).toLocaleDateString("id-ID");
    if (!dailyStats[date]) {
      dailyStats[date] = { count: 0, total: 0 };
    }
    dailyStats[date].count += 1;
    dailyStats[date].total += safeNumber(purchase.total_harga);
  });

  return Object.entries(dailyStats)
    .sort(
      (a, b) =>
        new Date(a[0].split("/").reverse().join("-")) -
        new Date(b[0].split("/").reverse().join("-"))
    )
    .map(([date, data]) => [date, data.count, safeNumber(data.total)]);
}

function generateProductAnalysis(salesData) {
  const productStats = {};

  salesData.forEach((sale) => {
    if (sale.PenjualanDetails && Array.isArray(sale.PenjualanDetails)) {
      sale.PenjualanDetails.forEach((detail) => {
        const productName = detail.Produk
          ? detail.Produk.nama
          : "Produk Tidak Diketahui";
        const category =
          detail.Produk && detail.Produk.ProdukKategori
            ? detail.Produk.ProdukKategori.nama
            : "Tanpa Kategori";

        if (!productStats[productName]) {
          productStats[productName] = {
            qty: 0,
            revenue: 0,
            category: category,
          };
        }

        productStats[productName].qty += safeNumber(detail.qty);
        productStats[productName].revenue +=
          safeNumber(detail.qty) * safeNumber(detail.harga_satuan);
      });
    }
  });

  return productStats;
}

function generateSupplierAnalysis(purchaseData) {
  const supplierStats = {};

  purchaseData.forEach((purchase) => {
    const supplierName = purchase.Supplier
      ? purchase.Supplier.nama
      : "Supplier Tidak Diketahui";

    if (!supplierStats[supplierName]) {
      supplierStats[supplierName] = {
        transactions: 0,
        total: 0,
      };
    }

    supplierStats[supplierName].transactions += 1;
    supplierStats[supplierName].total += safeNumber(purchase.total_harga);
  });

  return supplierStats;
}
