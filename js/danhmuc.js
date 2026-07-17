const defaultCategories = [
    { id: 1, name: 'Cà phê', description: 'Đồ uống cà phê truyền thống và pha chế.', productCount: 12, status: 'Hoạt động' },
    { id: 2, name: 'Trà', description: 'Trà nóng, trà sữa và trà trái cây.', productCount: 8, status: 'Hoạt động' },
    { id: 3, name: 'Sinh tố', description: 'Sinh tố tươi và đồ uống trái cây.', productCount: 5, status: 'Hoạt động' }
];

const categoryStorageKey = 'categoryList';
let categories = [];
let currentCategoryId = null;

let categoryGrid;
let categoryTableBody;
let categoryCount;
let categoryProductCount;
let activeCategoryCount;
let categorySearch;
let resetSearch;
let categoryModal;
let openAddCategory;
let closeCategoryModal;
let cancelCategoryModal;
let categoryForm;
let modalTitle;
let categoryName;
let categoryDescription;
let categoryStatus;

function setupCategoryElements() {
    categoryGrid = document.getElementById('categoryGrid');
    categoryTableBody = document.getElementById('categoryTableBody');
    categoryCount = document.getElementById('categoryCount');
    categoryProductCount = document.getElementById('categoryProductCount');
    activeCategoryCount = document.getElementById('activeCategoryCount');
    categorySearch = document.getElementById('categorySearch');
    resetSearch = document.getElementById('resetSearch');
    categoryModal = document.getElementById('categoryModal');
    openAddCategory = document.getElementById('openAddCategory');
    closeCategoryModal = document.getElementById('closeCategoryModal');
    cancelCategoryModal = document.getElementById('cancelCategoryModal');
    categoryForm = document.getElementById('categoryForm');
    modalTitle = document.getElementById('modalTitle');
    categoryName = document.getElementById('categoryName');
    categoryDescription = document.getElementById('categoryDescription');
    categoryStatus = document.getElementById('categoryStatus');
}

function loadCategories() {
    const saved = localStorage.getItem(categoryStorageKey);
    if (saved) {
        try {
            categories = JSON.parse(saved);
            if (!Array.isArray(categories)) throw new Error('Invalid category data');
        } catch (error) {
            console.warn('Xóa dữ liệu sai localStorage.categoryList và tải lại dữ liệu mặc định:', error);
            localStorage.removeItem(categoryStorageKey);
            categories = defaultCategories;
        }
    } else {
        categories = defaultCategories;
    }
    renderCategoryView(categories);
}

function saveCategories() {
    localStorage.setItem(categoryStorageKey, JSON.stringify(categories));
}

function renderCategoryView(list) {
    renderCategoryGrid(list);
    renderCategoryTable(list);
    updateCategoryStats(list);
}

function renderCategoryGrid(list) {
    categoryGrid.innerHTML = '';
    list.forEach(category => {
        const card = document.createElement('div');
        card.className = 'category-card';
        card.innerHTML = `
            <div>
                <h3>${category.name}</h3>
                <p>${category.description || 'Không có mô tả'}</p>
                <p><strong>${category.productCount}</strong> sản phẩm</p>
            </div>
            <div class="card-actions">
                <button class="btn-secondary" data-action="edit" data-id="${category.id}">Chỉnh sửa</button>
                <button class="btn-danger" data-action="delete" data-id="${category.id}">Xóa</button>
            </div>
        `;
        categoryGrid.appendChild(card);
    });
}

function renderCategoryTable(list) {
    categoryTableBody.innerHTML = '';
    list.forEach(category => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${category.name}</td>
            <td>${category.description || 'Không có mô tả'}</td>
            <td>${category.productCount}</td>
            <td><span class="status-${category.status === 'Hoạt động' ? 'success' : 'cancel'}">${category.status}</span></td>
            <td>
                <button class="btn-secondary" data-action="edit" data-id="${category.id}">Sửa</button>
                <button class="btn-danger" data-action="delete" data-id="${category.id}">Xóa</button>
            </td>
        `;
        categoryTableBody.appendChild(row);
    });
}

function updateCategoryStats(list) {
    categoryCount.textContent = list.length;
    categoryProductCount.textContent = list.reduce((sum, item) => sum + Number(item.productCount || 0), 0);
    activeCategoryCount.textContent = list.filter(item => item.status === 'Hoạt động').length;
}

function openCategoryModal(editId = null) {
    currentCategoryId = editId;
    categoryModal.classList.add('active');
    modalTitle.textContent = editId ? 'Chỉnh sửa danh mục' : 'Thêm danh mục';

    if (editId) {
        const category = categories.find(item => item.id === editId);
        categoryName.value = category.name;
        categoryDescription.value = category.description;
        categoryStatus.value = category.status;
    } else {
        categoryForm.reset();
        categoryStatus.value = 'Hoạt động';
    }
}

function closeCategoryModalFn() {
    categoryModal.classList.remove('active');
    categoryForm.reset();
    currentCategoryId = null;
}

function handleCategoryForm(event) {
    event.preventDefault();
    const name = categoryName.value.trim();
    const description = categoryDescription.value.trim();
    const status = categoryStatus.value;

    if (!name) {
        alert('Vui lòng nhập tên danh mục.');
        return;
    }

    if (currentCategoryId) {
        const index = categories.findIndex(item => item.id === currentCategoryId);
        categories[index] = {
            ...categories[index],
            name,
            description,
            status
        };
    } else {
        const nextId = categories.reduce((max, item) => Math.max(max, item.id), 0) + 1;
        categories.push({ id: nextId, name, description, productCount: 0, status });
    }

    saveCategories();
    renderCategoryView(categories);
    closeCategoryModalFn();
}

function filterCategories() {
    const query = categorySearch.value.trim().toLowerCase();
    return categories.filter(category =>
        category.name.toLowerCase().includes(query) ||
        category.description.toLowerCase().includes(query)
    );
}

function handleCategoryAction(event) {
    const button = event.target.closest('button');
    if (!button) return;
    const action = button.dataset.action;
    const id = Number(button.dataset.id);

    if (action === 'edit') {
        openCategoryModal(id);
    } else if (action === 'delete') {
        if (confirm('Bạn có chắc muốn xóa danh mục này không?')) {
            categories = categories.filter(item => item.id !== id);
            saveCategories();
            renderCategoryView(filterCategories());
        }
    }
}

function clearCategorySearch() {
    categorySearch.value = '';
    renderCategoryView(categories);
}

window.addEventListener('DOMContentLoaded', () => {
    setupCategoryElements();

    openAddCategory.addEventListener('click', () => openCategoryModal());
    closeCategoryModal.addEventListener('click', closeCategoryModalFn);
    cancelCategoryModal.addEventListener('click', closeCategoryModalFn);
    categoryForm.addEventListener('submit', handleCategoryForm);
    categorySearch.addEventListener('input', () => renderCategoryView(filterCategories()));
    resetSearch.addEventListener('click', clearCategorySearch);
    categoryGrid.addEventListener('click', handleCategoryAction);
    categoryTableBody.addEventListener('click', handleCategoryAction);
    categoryModal.addEventListener('click', event => {
        if (event.target === categoryModal) closeCategoryModalFn();
    });

    loadCategories();
});