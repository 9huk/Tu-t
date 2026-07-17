const defaultProducts = [
    { id: 1, name: 'Cà phê sữa', category: 'Cà phê', price: 35000, cost: 18000, stock: 120, status: 'Còn hàng' },
    { id: 2, name: 'Cà phê đen', category: 'Cà phê', price: 30000, cost: 16000, stock: 98, status: 'Còn hàng' },
    { id: 3, name: 'Cà phê bạc xỉu', category: 'Cà phê', price: 38000, cost: 20000, stock: 75, status: 'Còn hàng' },
    { id: 4, name: 'Trà đào', category: 'Trà', price: 40000, cost: 22000, stock: 85, status: 'Còn hàng' },
    { id: 5, name: 'Matcha latte', category: 'Trà', price: 45000, cost: 24000, stock: 60, status: 'Còn hàng' },
    { id: 6, name: 'Trà sữa trân châu', category: 'Trà', price: 42000, cost: 23000, stock: 92, status: 'Còn hàng' },
    { id: 7, name: 'Sinh tố dâu', category: 'Sinh tố', price: 48000, cost: 26000, stock: 55, status: 'Còn hàng' },
    { id: 8, name: 'Sinh tố bơ', category: 'Sinh tố', price: 52000, cost: 28000, stock: 38, status: 'Còn hàng' },
    { id: 9, name: 'Milkshake socola', category: 'Sinh tố', price: 50000, cost: 26000, stock: 40, status: 'Hết hàng' },
    { id: 10, name: 'Bánh mì kẹp', category: 'Đồ ăn', price: 30000, cost: 15000, stock: 50, status: 'Còn hàng' },
    { id: 11, name: 'Bánh trứng', category: 'Đồ ăn', price: 25000, cost: 12000, stock: 65, status: 'Còn hàng' },
    { id: 12, name: 'Bánh crepe', category: 'Đồ ăn', price: 32000, cost: 17000, stock: 45, status: 'Còn hàng' },
    { id: 13, name: 'Nước suối', category: 'Khác', price: 15000, cost: 5000, stock: 150, status: 'Còn hàng' },
    { id: 14, name: 'Nước ngọt', category: 'Khác', price: 20000, cost: 9000, stock: 110, status: 'Còn hàng' }
];

const productStorageKey = 'productList';
let products = [];
let currentEditId = null;

let productTableBody;
let totalProducts;
let totalStock;
let categoryCount;
let activeCount;
let productCount;
let searchInput;
let categoryFilter;
let resetFiltersButton;
let productModal;
let openAddProduct;
let closeModal;
let cancelModal;
let productForm;
let modalTitle;
let inlineAddButton;
let inlineProductName;
let inlineProductCategory;
let inlineProductPrice;
let inlineProductCost;
let inlineProductStock;
let inlineProductStatus;

function setupElements() {
    productTableBody = document.getElementById('productTableBody');
    totalProducts = document.getElementById('totalProducts');
    totalStock = document.getElementById('totalStock');
    categoryCount = document.getElementById('categoryCount');
    activeCount = document.getElementById('activeCount');
    productCount = document.getElementById('productCount');
    searchInput = document.getElementById('searchInput');
    categoryFilter = document.getElementById('categoryFilter');
    resetFiltersButton = document.getElementById('resetFilters');
    productModal = document.getElementById('productModal');
    openAddProduct = document.getElementById('openAddProduct');
    closeModal = document.getElementById('closeModal');
    cancelModal = document.getElementById('cancelModal');
    productForm = document.getElementById('productForm');
    modalTitle = document.getElementById('modalTitle');
    inlineAddButton = document.getElementById('inlineAddButton');
    inlineProductName = document.getElementById('inlineProductName');
    inlineProductCategory = document.getElementById('inlineProductCategory');
    inlineProductPrice = document.getElementById('inlineProductPrice');
    inlineProductCost = document.getElementById('inlineProductCost');
    inlineProductStock = document.getElementById('inlineProductStock');
    inlineProductStatus = document.getElementById('inlineProductStatus');
}

function loadProducts() {
    let saved = localStorage.getItem(productStorageKey);
    if (saved) {
        try {
            products = JSON.parse(saved);
            if (!Array.isArray(products)) throw new Error('Invalid product data');
        } catch (error) {
            console.warn('Xóa dữ liệu sai localStorage.productList và tải lại sản phẩm mẫu:', error);
            localStorage.removeItem(productStorageKey);
            products = defaultProducts;
        }
    } else {
        products = defaultProducts;
    }
    renderProducts(products);
}

function saveProducts() {
    localStorage.setItem(productStorageKey, JSON.stringify(products));
}

function formatCurrency(value) {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '₫';
}

function renderProducts(list) {
    productTableBody.innerHTML = '';
    list.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>${formatCurrency(product.price)}</td>
            <td>${formatCurrency(product.cost)}</td>
            <td>${product.stock}</td>
            <td>${renderStatus(product.status)}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-secondary" data-action="edit" data-id="${product.id}"><i class="fa-solid fa-pen"></i></button>
                    <button class="btn-danger" data-action="delete" data-id="${product.id}"><i class="fa-solid fa-trash"></i></button>
                </div>
            </td>
        `;
        productTableBody.appendChild(row);
    });
    updateStats(list);
}

function renderStatus(status) {
    let className = 'badge ';
    if (status === 'Còn hàng') className += 'available';
    else if (status === 'Hết hàng') className += 'out-of-stock';
    else className += 'inactive';
    return `<span class="${className}">${status}</span>`;
}

function updateStats(list) {
    totalProducts.textContent = list.length;
    totalStock.textContent = list.reduce((sum, item) => sum + Number(item.stock), 0);
    categoryCount.textContent = new Set(list.map(item => item.category)).size;
    activeCount.textContent = list.filter(item => item.status === 'Còn hàng').length;
    productCount.textContent = `${list.length} sản phẩm`;
}

function openModal(editId = null) {
    currentEditId = editId;
    productModal.classList.add('active');
    modalTitle.textContent = editId ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm';
    if (editId) {
        const product = products.find(item => item.id === editId);
        document.getElementById('productName').value = product.name;
        document.getElementById('productCategory').value = product.category;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productCost').value = product.cost;
        document.getElementById('productStock').value = product.stock;
        document.getElementById('productStatus').value = product.status;
    } else {
        productForm.reset();
    }
}

function closeProductModal() {
    productModal.classList.remove('active');
    productForm.reset();
    currentEditId = null;
}

function handleFormSubmit(event) {
    event.preventDefault();
    const name = document.getElementById('productName').value.trim();
    const category = document.getElementById('productCategory').value;
    const price = Number(document.getElementById('productPrice').value);
    const cost = Number(document.getElementById('productCost').value);
    const stock = Number(document.getElementById('productStock').value);
    const status = document.getElementById('productStatus').value;

    if (!name || !category || !price || !cost || isNaN(stock)) {
        alert('Vui lòng điền đầy đủ thông tin sản phẩm.');
        return;
    }

    if (currentEditId) {
        const index = products.findIndex(item => item.id === currentEditId);
        products[index] = { id: currentEditId, name, category, price, cost, stock, status };
    } else {
        const nextId = products.reduce((max, item) => Math.max(max, item.id), 0) + 1;
        products.push({ id: nextId, name, category, price, cost, stock, status });
    }

    saveProducts();
    clearFilters();
    closeProductModal();
}

function filterProducts() {
    const searchText = searchInput.value.trim().toLowerCase();
    const categoryValue = categoryFilter.value;
    return products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchText) || product.category.toLowerCase().includes(searchText);
        const matchesCategory = categoryValue ? product.category === categoryValue : true;
        return matchesSearch && matchesCategory;
    });
}

function handleTableAction(event) {
    const button = event.target.closest('button');
    if (!button) return;
    const action = button.dataset.action;
    const id = Number(button.dataset.id);
    if (action === 'edit') {
        openModal(id);
    } else if (action === 'delete') {
        if (confirm('Bạn có chắc muốn xóa sản phẩm này không?')) {
            products = products.filter(item => item.id !== id);
            saveProducts();
            renderProducts(filterProducts());
        }
    }
}

function clearFilters() {
    searchInput.value = '';
    categoryFilter.value = '';
    renderProducts(products);
}

function addInlineProduct() {
    const name = inlineProductName.value.trim();
    const category = inlineProductCategory.value;
    const price = Number(inlineProductPrice.value);
    const cost = Number(inlineProductCost.value);
    const stock = Number(inlineProductStock.value);
    const status = inlineProductStatus.value;

    if (!name || !category || !price || !cost || isNaN(stock)) {
        alert('Vui lòng điền đủ thông tin để thêm sản phẩm nhanh.');
        return;
    }

    const nextId = products.reduce((max, item) => Math.max(max, item.id), 0) + 1;
    products.push({ id: nextId, name, category, price, cost, stock, status });
    saveProducts();
    clearFilters();
    renderProducts(products);

    inlineProductName.value = '';
    inlineProductPrice.value = '';
    inlineProductCost.value = '';
    inlineProductStock.value = '';
    inlineProductCategory.value = 'Cà phê';
    inlineProductStatus.value = 'Còn hàng';
}

window.addEventListener('DOMContentLoaded', function () {
    setupElements();

    openAddProduct.addEventListener('click', () => openModal());
    closeModal.addEventListener('click', closeProductModal);
    cancelModal.addEventListener('click', closeProductModal);
    productForm.addEventListener('submit', handleFormSubmit);
    searchInput.addEventListener('input', () => renderProducts(filterProducts()));
    categoryFilter.addEventListener('change', () => renderProducts(filterProducts()));
    resetFiltersButton.addEventListener('click', clearFilters);
    productTableBody.addEventListener('click', handleTableAction);
    productModal.addEventListener('click', function (event) {
        if (event.target === productModal) closeProductModal();
    });
    inlineAddButton.addEventListener('click', addInlineProduct);

    loadProducts();
});
