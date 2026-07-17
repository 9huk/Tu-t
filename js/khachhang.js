const modal = document.getElementById("customerModal");
const form = document.getElementById("customerForm");
const tableBody = document.getElementById("customerTableBody");

const openModal = document.getElementById("openModal");
const closeModal = document.getElementById("closeModal");
const cancelBtn = document.getElementById("cancelBtn");

const modalTitle = document.getElementById("modalTitle");

const searchInput = document.getElementById("searchCustomer");
const filterType = document.getElementById("filterType");

const totalCustomer = document.getElementById("totalCustomer");
const vipCustomer = document.getElementById("vipCustomer");
const customerRevenue = document.getElementById("customerRevenue");

let editingRow = null;

function showModal(title = "Thêm khách hàng") {

    modalTitle.innerText = title;

    modal.classList.add("show");

}

function hideModal() {

    modal.classList.remove("show");

    form.reset();

    editingRow = null;

}

openModal.addEventListener("click", () => {

    showModal("Thêm khách hàng");

});

closeModal.addEventListener("click", hideModal);

cancelBtn.addEventListener("click", hideModal);

modal.addEventListener("click", function (e) {

    if (e.target === modal) {

        hideModal();

    }

});

document.addEventListener("keydown", function (e) {

    if (e.key === "Escape") {

        hideModal();

    }

});

function createAvatar(name) {

    return name
        .trim()
        .split(/\s+/)
        .map(word => word[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

}


function formatMoney(number) {

    return Number(number).toLocaleString("vi-VN") + "đ";

}

function updateSummary() {

    const rows = tableBody.querySelectorAll("tr");

    totalCustomer.innerText = rows.length;

    let vip = 0;

    let revenue = 0;

    rows.forEach(row => {

        const type =
            row.children[6].innerText.trim();

        if (type === "VIP") {

            vip++;

        }

        const money =
            row.children[4].innerText
                .replaceAll(".", "")
                .replace("đ", "")
                .replace(",", "");

        revenue += Number(money);

    });

    vipCustomer.innerText = vip;

    customerRevenue.innerText =
        formatMoney(revenue);

}

updateSummary();

form.addEventListener("submit", function (e) {

    e.preventDefault();

    const name = document.getElementById("customerName").value.trim();
    const email = document.getElementById("customerEmail").value.trim();
    const phone = document.getElementById("customerPhone").value.trim();
    const address = document.getElementById("customerAddress").value.trim();

    const money = document.getElementById("customerMoney").value || 0;
    const point = document.getElementById("customerPoint").value || 0;

    const type = document.getElementById("customerType").value;

    if (name === "") {

        alert("Vui lòng nhập họ tên.");

        return;

    }

    if (phone === "") {

        alert("Vui lòng nhập số điện thoại.");

        return;

    }

    let statusClass = "regular";

    if (type === "VIP") {

        statusClass = "vip";

    }

    else if (type === "Thân thiết") {

        statusClass = "loyal";

    }

    const avatar = createAvatar(name);

    if (editingRow) {

        editingRow.innerHTML = `

            <td></td>

            <td class="customer-info">

                <div class="avatar">

                    ${avatar}

                </div>

                <div>

                    <strong>${name}</strong>

                    <span>${email}</span>

                </div>

            </td>

            <td>${phone}</td>

            <td>${address}</td>

            <td>${formatMoney(money)}</td>

            <td>${point}</td>

            <td>

                <span class="status ${statusClass}">

                    ${type}

                </span>

            </td>

            <td class="action-buttons">

                <button class="btn-icon edit-btn">

                    <i class="fa-solid fa-pen"></i>

                </button>

                <button class="btn-icon delete-btn">

                    <i class="fa-solid fa-trash"></i>

                </button>

            </td>

        `;

    }

    else {

        const row = document.createElement("tr");

        row.innerHTML = `

            <td></td>

            <td class="customer-info">

                <div class="avatar">

                    ${avatar}

                </div>

                <div>

                    <strong>${name}</strong>

                    <span>${email}</span>

                </div>

            </td>

            <td>${phone}</td>

            <td>${address}</td>

            <td>${formatMoney(money)}</td>

            <td>${point}</td>

            <td>

                <span class="status ${statusClass}">

                    ${type}

                </span>

            </td>

            <td class="action-buttons">

                <button class="btn-icon edit-btn">

                    <i class="fa-solid fa-pen"></i>

                </button>

                <button class="btn-icon delete-btn">

                    <i class="fa-solid fa-trash"></i>

                </button>

            </td>

        `;

        tableBody.appendChild(row);

    }

    const rows = tableBody.querySelectorAll("tr");

    rows.forEach(function (row, index) {

        row.children[0].innerText = index + 1;

    });

    updateSummary();

    hideModal();

});

tableBody.addEventListener("click", function (e) {

    const editBtn = e.target.closest(".edit-btn");
    const deleteBtn = e.target.closest(".delete-btn");

    if (editBtn) {

        editingRow = editBtn.closest("tr");

        document.getElementById("customerName").value =
            editingRow.querySelector("strong").innerText;

        document.getElementById("customerEmail").value =
            editingRow.querySelector(".customer-info span").innerText;

        document.getElementById("customerPhone").value =
            editingRow.children[2].innerText;

        document.getElementById("customerAddress").value =
            editingRow.children[3].innerText;

        document.getElementById("customerMoney").value =
            editingRow.children[4].innerText
                .replaceAll(".", "")
                .replace("đ", "")
                .replace(",", "");

        document.getElementById("customerPoint").value =
            editingRow.children[5].innerText;

        document.getElementById("customerType").value =
            editingRow.children[6].innerText.trim();

        showModal("Sửa khách hàng");

        return;

    }


    if (deleteBtn) {

        if (!confirm("Bạn có chắc muốn xóa khách hàng này?")) {

            return;

        }

        deleteBtn.closest("tr").remove();

        updateRowNumber();

        updateSummary();

    }

});


function updateRowNumber() {

    const rows = tableBody.querySelectorAll("tr");

    rows.forEach(function (row, index) {

        row.children[0].innerText = index + 1;

    });

}

searchInput.addEventListener("keyup", function () {

    const keyword = this.value.toLowerCase();

    const rows = tableBody.querySelectorAll("tr");

    rows.forEach(function (row) {

        const text = row.innerText.toLowerCase();

        row.style.display = text.includes(keyword)
            ? ""
            : "none";

    });

});

filterType.addEventListener("change", function () {

    const value = this.value;

    const rows = tableBody.querySelectorAll("tr");

    rows.forEach(function (row) {

        if (value === "all") {

            row.style.display = "";

            return;

        }

        const type =
            row.children[6].innerText.trim();

        row.style.display =
            type === value ? "" : "none";

    });

});

updateRowNumber();

updateSummary();