"use strict";

// 1. DATA MENU GORENGAN
const products = [
    {
        id: 1,
        name: "Bakwan Sayur",
        price: 2000,
        description: "Bakwan sayur renyah dan gurih.",
        image: "bakwan.jpeg"
    },
    {
        id: 2,
        name: "Pisang Goreng",
        price: 2500,
        description: "Pisang goreng manis dan hangat.",
        image: "pisang gorweng.jpg"
    },
    {
        id: 3,
        name: "Tahu Isi",
        price: 2000,
        description: "Tahu dengan isian sayur yang lezat.",
        image: "tahu isi.jpg"
    },
    {
        id: 4,
        name: "Tempe Goreng",
        price: 1500,
        description: "Tempe gurih cocok untuk camilan.",
        image: "tempe.jpg"
    },
    {
        id: 5,
        name: "Risol Mayo",
        price: 3000,
        description: "Risol renyah dengan isian creamy.",
        image: "risol.jpeg"
    },
    {
        id: 6,
        name: "Cireng",
        price: 2000,
        description: "Camilan aci dengan tekstur kenyal.",
        image: "cireng.jpg"
    }
];
// 2. PENGATURAN KERANJANG
const cart = new Map();
const SHIPPING_COST = 5000;

const menuList = document.getElementById("menu-list");
const cartItems = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const subtotalElement = document.getElementById("subtotal");
const shippingElement = document.getElementById("shipping");
const totalElement = document.getElementById("total");
const checkoutForm = document.getElementById("checkout-form");
const orderResult = document.getElementById("order-result");
// Mengubah angka biasa menjadi format Rupiah (contoh: 2000 -> Rp2.000)
function formatRupiah(number) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(number);
}
