const defaultOrders = [
    { id: 1, code: '#DH001', customer: 'Nguyễn Văn A', table: 'B01', staff: 'Lan', total: 320000, date: '2025-03-18', status: 'Đã thanh toán' },
    { id: 2, code: '#DH002', customer: 'Trần Văn B', table: 'B03', staff: 'Hùng', total: 210000, date: '2025-03-19', status: 'Đang phục vụ' },
    { id: 3, code: '#DH003', customer: 'Lê Văn C', table: 'Mang về', staff: 'Mai', total: 95000, date: '2025-03-20', status: 'Chờ thanh toán' }
];

const orderStorageKey = 'orderList';
let orders = [];
let currentOrderId = null;

let orderTableBody;
let orderSearch;
let orderSearchButton;
let orderStatusFilter;
let orderDateFilter;
let orderFilterButton;
let orderResetButton;
let orderModal;
let openOrderModal;
let closeOrderModal;
let cancelOrderModal;
let orderForm;
let orderModalTitle;
let orderCustomer;
let orderTable;
let orderStaff;
let orderTotal;
let orderDate;
let orderStatus;
let totalOrdersCount;
let totalRevenue;
let activeOrdersCount;

function setupOrderElements() {
    orderTableBody = document.getElementById('orderTableBody');
    orderSearch = document.getElementById('orderSearch');
    orderSearchButton = document.getElementById('orderSearchButton');
    orderStatusFilter = document.getElementById('orderStatusFilter');
    orderDateFilter = document.getElementById('orderDateFilter');
    orderFilterButton = document.getElementById('orderFilterButton');
    orderResetButton = document.getElementById('orderResetButton');
    orderModal = document.getElementById('orderModal');
    openOrderModal = document.getElementById('openOrderModal');
    closeOrderModal = document.getElementById('closeOrderModal');
    cancelOrderModal = document.getElementById('cancelOrderModal');
    orderForm = document.getElementById('orderForm');
    orderModalTitle = document.getElementById('orderModalTitle');
    orderCustomer = document.getElementById('orderCustomer');
    orderTable = document.getElementById('orderTable');
    orderStaff = document.getElementById('orderStaff');
    orderTotal = document.getElementById('orderTotal');
    orderDate = document.getElementById('orderDate');
    orderStatus = document.getElementById('orderStatus');
    totalOrdersCount = document.getElementById('totalOrdersCount');
    totalRevenue = document.getElementById('totalRevenue');
    activeOrdersCount = document.getElementById('activeOrdersCount');
}

function loadOrders() {
    const saved = localStorage.getItem(orderStorageKey);
    if (saved) {
        try {
            orders = JSON.parse(saved);
            if (!Array.isArray(orders)) throw new Error('Invalid order data');
        } catch (error) {
            console.warn('Xóa dữ liệu sai localStorage.orderList và tải lại dữ liệu mẫu:', error);
            localStorage.removeItem(orderStorageKey);
            orders = defaultOrders;
        }
    } else {
        orders = defaultOrders;
    }
    renderOrders(orders);
}

function saveOrders() {
    localStorage.setItem(orderStorageKey, JSON.stringify(orders));
}

function formatCurrency(value) {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '₫';
}

function renderOrders(list) {
    orderTableBody.innerHTML = "";

    list.forEach(order => {

        const statusClass =
            order.status === "Đã thanh toán"
                ? "status-success"
                : order.status === "Đang phục vụ"
                ? "status-process"
                : "status-wait";

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${order.code}</td>

            <td>${order.customer}</td>

            <td>${order.table}</td>

            <td>${order.staff}</td>

            <td>${formatCurrency(order.total)}</td>

            <td>${order.date}</td>

            <td>
                <span class="${statusClass}">
                    ${order.status}
                </span>
            </td>

            <td>
                <div class="actions">

                    <button
                        class="action-btn view-btn"
                        data-action="view"
                        data-id="${order.id}"
                        title="Xem / Chỉnh sửa">

                        <i class="fa-solid fa-eye"></i>

                    </button>

                    <button
                        class="action-btn delete-btn"
                        data-action="delete"
                        data-id="${order.id}"
                        title="Xóa">

                        <i class="fa-solid fa-trash"></i>

                    </button>

                </div>
            </td>
        `;

        orderTableBody.appendChild(row);
    });

    updateOrderStats(list);
}

function updateOrderStats(list) {
    totalOrdersCount.textContent = list.length;
    totalRevenue.textContent = formatCurrency(list.reduce((sum, item) => sum + Number(item.total), 0));
    activeOrdersCount.textContent = list.filter(item => item.status === 'Đang phục vụ').length;
}

function openOrderModalFn(editId = null) {
    currentOrderId = editId;
    orderModal.classList.add('active');
    orderModalTitle.textContent = editId ? 'Sửa đơn hàng' : 'Tạo đơn hàng';

    if (editId) {
        const order = orders.find(item => item.id === editId);
        orderCustomer.value = order.customer;
        orderTable.value = order.table;
        orderStaff.value = order.staff;
        orderTotal.value = order.total;
        orderDate.value = order.date;
        orderStatus.value = order.status;
    } else {
        orderForm.reset();
        orderStatus.value = 'Đã thanh toán';
        orderDate.value = new Date().toISOString().slice(0, 10);
    }
}

function closeOrderModalFn() {
    orderModal.classList.remove('active');
    orderForm.reset();
    currentOrderId = null;
}

function handleOrderFormSubmit(event) {
    event.preventDefault();
    const customer = orderCustomer.value.trim();
    const table = orderTable.value.trim();
    const staff = orderStaff.value.trim();
    const total = Number(orderTotal.value);
    const date = orderDate.value;
    const status = orderStatus.value;

    if (!customer || !table || !staff || !date || isNaN(total)) {
        alert('Vui lòng nhập đủ thông tin đơn hàng.');
        return;
    }

    if (currentOrderId) {
        const index = orders.findIndex(item => item.id === currentOrderId);
        orders[index] = { id: currentOrderId, code: orders[index].code, customer, table, staff, total, date, status };
    } else {
        const nextId = orders.reduce((max, item) => Math.max(max, item.id), 0) + 1;
        const code = `#DH${String(nextId).padStart(3, '0')}`;
        orders.push({ id: nextId, code, customer, table, staff, total, date, status });
    }

    saveOrders();
    renderOrders(filterOrders());
    closeOrderModalFn();
}

function filterOrders() {
    const query = orderSearch.value.trim().toLowerCase();
    const status = orderStatusFilter.value;
    const date = orderDateFilter.value;

    return orders.filter(order => {
        const matchesQuery = order.code.toLowerCase().includes(query) || order.customer.toLowerCase().includes(query);
        const matchesStatus = status ? order.status === status : true;
        const matchesDate = date ? order.date === date : true;
        return matchesQuery && matchesStatus && matchesDate;
    });
}

function handleOrderAction(event) {
    const button = event.target.closest('button');
    if (!button) return;
    const action = button.dataset.action;
    const id = Number(button.dataset.id);

    if (action === 'view') {
        openOrderModalFn(id);
    } else if (action === 'delete') {
        if (confirm('Bạn có chắc muốn xóa đơn hàng này không?')) {
            orders = orders.filter(item => item.id !== id);
            saveOrders();
            renderOrders(filterOrders());
        }
    }
}

function resetOrderFilters() {
    orderSearch.value = '';
    orderStatusFilter.value = '';
    orderDateFilter.value = '';
    renderOrders(orders);
}

window.addEventListener('DOMContentLoaded', () => {
    setupOrderElements();

    openOrderModal.addEventListener('click', () => openOrderModalFn());
    closeOrderModal.addEventListener('click', closeOrderModalFn);
    cancelOrderModal.addEventListener('click', closeOrderModalFn);
    orderForm.addEventListener('submit', handleOrderFormSubmit);
    orderSearch.addEventListener('input', () => renderOrders(filterOrders()));
    orderSearchButton.addEventListener('click', () => renderOrders(filterOrders()));
    orderStatusFilter.addEventListener('change', () => renderOrders(filterOrders()));
    orderDateFilter.addEventListener('change', () => renderOrders(filterOrders()));
    orderFilterButton.addEventListener('click', () => renderOrders(filterOrders()));
    orderResetButton.addEventListener('click', resetOrderFilters);
    orderTableBody.addEventListener('click', handleOrderAction);
    orderModal.addEventListener('click', event => {
        if (event.target === orderModal) closeOrderModalFn();
    });

    loadOrders();
});