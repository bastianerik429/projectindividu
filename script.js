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
        image: "pisang goreng.jpg"
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
// 3. MENAMPILKAN DAFTAR MENU
function renderProducts() {
    menuList.innerHTML = products.map(product => `
        <article class="menu-card">
            <img
                src="${product.image}"
                alt="${product.name}"
                loading="lazy"
                onerror="this.style.display='none'"
            >

            <div class="menu-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>

                <div class="menu-bottom">
                    <span class="menu-price">
                        ${formatRupiah(product.price)}
                    </span>

                    <button
                        class="add-btn"
                        data-add="${product.id}"
                        type="button"
                    >
                        + Tambah
                    </button>
                </div>
            </div>
        </article>
    `).join("");
}

// 4. MENAMBAH BARANG KE KERANJANG
function addToCart(productId) {
    const currentQuantity = cart.get(productId) || 0;
    cart.set(productId, currentQuantity + 1);

    renderCart();
}

// Mengubah jumlah barang (+ / -).
// Jika jumlah mencapai 0, barang otomatis dihapus dari keranjang.
function changeQuantity(productId, change) {
    const currentQuantity = cart.get(productId) || 0;
    const newQuantity = currentQuantity + change;

    if (newQuantity <= 0) {
        cart.delete(productId);
    } else {
        cart.set(productId, newQuantity);
    }

    renderCart();
}

// 5. MENGHITUNG SUBTOTAL
function calculateSubtotal() {
    let subtotal = 0;

    cart.forEach((quantity, productId) => {
        const product = products.find(
            item => item.id === productId
        );

        if (product) {
            subtotal += product.price * quantity;
        }
    });

    return subtotal;
}

// 6. MENAMPILKAN & MENGUPDATE TAMPILAN KERANJANG
function renderCart() {
    let totalItems = 0;

    cart.forEach(quantity => {
        totalItems += quantity;
    });

    cartCount.textContent = totalItems;

    if (cart.size === 0) {
        cartItems.innerHTML = `
            <p class="empty-cart">
                Keranjang kamu masih kosong.
            </p>
        `;
    } else {
        cartItems.innerHTML = Array.from(cart.entries())
            .map(([productId, quantity]) => {
                const product = products.find(
                    item => item.id === productId
                );

                return `
                    <div class="cart-item">
                        <div class="cart-item-info">
                            <strong>${product.name}</strong>
                            <small>
                                ${formatRupiah(product.price)}
                                × ${quantity}
                            </small>
                            <strong>
                                ${formatRupiah(
                                    product.price * quantity
                                )}
                            </strong>
                        </div>

                        <div class="quantity-controls">
                            <button
                                type="button"
                                data-minus="${productId}"
                                aria-label="Kurangi ${product.name}"
                            >−</button>

                            <span>${quantity}</span>

                            <button
                                type="button"
                                data-plus="${productId}"
                                aria-label="Tambah ${product.name}"
                            >+</button>
                        </div>
                    </div>
                `;
            })
            .join("");
    }

    // Ongkir hanya dihitung jika ada barang di keranjang.
    const subtotal = calculateSubtotal();
    const shipping = subtotal > 0 ? SHIPPING_COST : 0;
    const total = subtotal + shipping;

    subtotalElement.textContent = formatRupiah(subtotal);
    shippingElement.textContent = formatRupiah(shipping);
    totalElement.textContent = formatRupiah(total);
}
// 7. EVENT DELEGATION UNTUK KLIK TOMBOL (+ TAMBAH, +, -)
document.addEventListener("click", event => {
    const addButton = event.target.closest("[data-add]");
    const plusButton = event.target.closest("[data-plus]");
    const minusButton = event.target.closest("[data-minus]");

    if (addButton) {
        const productId = Number(addButton.dataset.add);
        addToCart(productId);
    }

    if (plusButton) {
        const productId = Number(plusButton.dataset.plus);
        changeQuantity(productId, 1);
    }

    if (minusButton) {
        const productId = Number(minusButton.dataset.minus);
        changeQuantity(productId, -1);
    }
});
// 8. PROSES CHECKOUT FORM
checkoutForm.addEventListener("submit", event => {
    event.preventDefault();

    if (cart.size === 0) {
        alert("Keranjang kamu masih kosong! Pilih minimal 1 makanan.");
        return;
    }

    const name = document.getElementById("customer-name").value;
    const phone = document.getElementById("customer-phone").value;
    const address = document.getElementById("customer-address").value;
    const payment = document.getElementById("payment-method").value;

    const subtotal = calculateSubtotal();
    const shipping = SHIPPING_COST;
    const total = subtotal + shipping;
    // Menampilkan ringkasan resi pemesanan
    orderResult.hidden = false;
    orderResult.innerHTML = `
        <h3>Pesanan Berhasil Dibuat! 🎉</h3>
        <p><strong>Nama:</strong> ${name}</p>
        <p><strong>No. WhatsApp:</strong> ${phone}</p>
        <p><strong>Alamat:</strong> ${address}</p>
        <p><strong>Metode Pembayaran:</strong> ${payment}</p>
        <p><strong>Total Pembayaran:</strong> ${formatRupiah(total)}</p>
        <br>
        <p><em>Terima kasih telah memesan di GorengYuk! Pesanan Anda sedang diproses.</em></p>
        <button type="button" onclick="this.parentElement.hidden=true">Tutup</button>
    `;

    // Mengosongkan keranjang & form setelah pesanan dibuat
    cart.clear();
    checkoutForm.reset();
    renderCart();

    // Otomatis menggeser layar ke area hasil pesanan
    orderResult.scrollIntoView({ behavior: "smooth" });
});
// 9. INISIALISASI HALAMAN
renderProducts();
renderCart();