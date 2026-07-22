const products = {

    "Cà Phê Đen": 25000,

    "Cà Phê Sữa": 35000,

    "Trà Đào": 45000,

    "Trà Xoài": 40000,

    "Trà Nhãn": 40000,

    "Trà Đào Cam Sả": 35000,

    "Trà Ô Long Vải": 50000,

    "Sữa Dừa Non Hạt Sen": 60000,

    "Trà Dâu": 45000

};


let orders = [

    {

        id: "DH001",

        customer: "Nguyễn Văn A",

        table: "B01",

        staff: "Lan",

        date: "2025-03-18",

        status: "Đã thanh toán",

        products: [

            {

                name: "Cà Phê Sữa",

                quantity: 2,

                price: 35000

            },

            {

                name: "Trà Đào",

                quantity: 1,

                price: 45000

            },

            {

                name: "Cà Phê Đen",

                quantity: 1,

                price: 25000

            }

        ]

    },


    {

        id: "DH002",

        customer: "Trần Văn B",

        table: "B03",

        staff: "Hùng",

        date: "2025-03-19",

        status: "Đang phục vụ",

        products: [

            {

                name: "Sữa Dừa Non Hạt Sen",

                quantity: 2,

                price: 60000

            },

            {

                name: "Trà Xoài",

                quantity: 1,

                price: 40000

            },

            {

                name: "Trà Đào",

                quantity: 2,

                price: 45000

            }

        ]

    },


    {

        id: "DH003",

        customer: "Lê Văn C",

        table: "Mang về",

        staff: "Mai",

        date: "2025-03-20",

        status: "Chờ thanh toán",

        products: [

            {

                name: "Cà Phê Đen",

                quantity: 2,

                price: 25000

            },

            {

                name: "Trà Dâu",

                quantity: 1,

                price: 45000

            }

        ]

    }

];


let editingOrderId = null;



const orderTableBody =
    document.getElementById("orderTableBody");


const totalOrdersCount =
    document.getElementById("totalOrdersCount");


const totalRevenue =
    document.getElementById("totalRevenue");


const activeOrdersCount =
    document.getElementById("activeOrdersCount");


const orderSearch =
    document.getElementById("orderSearch");


const orderStatusFilter =
    document.getElementById("orderStatusFilter");


const orderDateFilter =
    document.getElementById("orderDateFilter");


const orderModal =
    document.getElementById("orderModal");


const detailModal =
    document.getElementById("detailModal");


const orderForm =
    document.getElementById("orderForm");


const orderProducts =
    document.getElementById("orderProducts");


const orderTotal =
    document.getElementById("orderTotal");


const orderModalTitle =
    document.getElementById("orderModalTitle");



function formatMoney(number) {

    return number.toLocaleString("vi-VN") + "₫";

}



function calculateOrderTotal(order) {

    return order.products.reduce(

        (total, product) => {

            return total + (

                product.price *
                product.quantity

            );

        },

        0

    );

}


function getStatusClass(status) {


    if (status === "Đã thanh toán") {

        return "status-paid";

    }


    if (status === "Đang phục vụ") {

        return "status-serving";

    }


    return "status-waiting";

}



function renderProductNames(products) {


    const firstProduct =
        products[0];


    const totalProduct =
        products.length;


    if (totalProduct === 1) {

        return `

            <div class="product-list">

                <span class="product-name">

                    ${firstProduct.name}

                </span>

                <span class="product-count">

                    x${firstProduct.quantity}

                </span>

            </div>

        `;

    }


    return `

        <div class="product-list">

            <span class="product-name">

                ${firstProduct.name}

            </span>

            <span class="product-count">

                x${firstProduct.quantity}

                và ${totalProduct - 1} sản phẩm khác

            </span>

        </div>

    `;

}



function renderOrders(data = orders) {


    orderTableBody.innerHTML = "";


    if (data.length === 0) {

        orderTableBody.innerHTML = `

            <tr>

                <td
                    colspan="9"
                    style="text-align:center;padding:40px">

                    Không tìm thấy đơn hàng

                </td>

            </tr>

        `;

        updateSummary(data);

        return;

    }


    data.forEach(order => {


        const total =
            calculateOrderTotal(order);


        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>

                <span class="order-id">

                    #${order.id}

                </span>

            </td>


            <td>

                ${order.customer}

            </td>


            <td>

                ${renderProductNames(order.products)}

            </td>


            <td>

                ${order.table}

            </td>


            <td>

                ${order.staff}

            </td>


            <td>

                <span class="order-price">

                    ${formatMoney(total)}

                </span>

            </td>


            <td>

                ${order.date}

            </td>


            <td>

                <span class="status ${getStatusClass(order.status)}">

                    ${order.status}

                </span>

            </td>


            <td>


                <div class="action-buttons">


                    <button

                        class="action-btn view-btn"

                        onclick="viewOrder('${order.id}')">

                        <i class="fa-solid fa-eye"></i>

                    </button>


                    <button

                        class="action-btn edit-btn"

                        onclick="editOrder('${order.id}')">

                        <i class="fa-solid fa-pen"></i>

                    </button>


                    <button

                        class="action-btn delete-btn"

                        onclick="deleteOrder('${order.id}')">

                        <i class="fa-solid fa-trash"></i>

                    </button>


                </div>


            </td>

        `;


        orderTableBody.appendChild(row);

    });


    updateSummary(data);

}


function updateSummary(data = orders) {


    totalOrdersCount.textContent =
        data.length;


    const revenue =
        data.reduce(

            (total, order) => {

                return total +
                    calculateOrderTotal(order);

            },

            0

        );


    totalRevenue.textContent =
        formatMoney(revenue);


    const active =
        data.filter(

            order =>

                order.status === "Đang phục vụ"

        ).length;


    activeOrdersCount.textContent =
        active;

}



document
    .getElementById("openOrderModal")
    .addEventListener("click", () => {


        editingOrderId = null;


        orderModalTitle.textContent =
            "Tạo đơn hàng";


        orderForm.reset();


        orderProducts.innerHTML =
            createProductRow();


        orderTotal.value =
            "0₫";


        orderModal.classList.add("active");


        document
            .getElementById("orderDate")
            .valueAsDate = new Date();

    });


function createProductRow(name = "", quantity = 1) {


    return `

        <div class="product-row">


            <select
                class="product-select"
                required>


                <option value="">

                    -- Chọn sản phẩm --

                </option>


                ${Object.keys(products)

                    .map(product => `

                        <option

                            value="${product}"

                            data-price="${products[product]}"

                            ${product === name ? "selected" : ""}>

                            ${product} -

                            ${formatMoney(products[product])}

                        </option>

                    `)

                    .join("")}


            </select>


            <input

                type="number"

                class="product-quantity"

                min="1"

                value="${quantity}"

                required>


            <button

                type="button"

                class="remove-product">

                <i class="fa-solid fa-trash"></i>

            </button>


        </div>

    `;

}


document
    .getElementById("addProductBtn")
    .addEventListener("click", () => {


        orderProducts.insertAdjacentHTML(

            "beforeend",

            createProductRow()

        );

    });


orderProducts.addEventListener(

    "change",

    calculateFormTotal

);


orderProducts.addEventListener(

    "input",

    calculateFormTotal

);


function calculateFormTotal() {


    let total = 0;


    const rows =
        document.querySelectorAll(".product-row");


    rows.forEach(row => {


        const select =
            row.querySelector(".product-select");


        const quantity =
            row.querySelector(".product-quantity");


        const price =
            Number(

                select
                    .selectedOptions[0]
                    ?.dataset.price || 0

            );


        const quantityValue =
            Number(quantity.value) || 0;


        total +=
            price * quantityValue;

    });


    orderTotal.value =
        formatMoney(total);

}


orderProducts.addEventListener(

    "click",

    event => {


        const button =
            event.target.closest(".remove-product");


        if (!button) return;


        const rows =
            document.querySelectorAll(".product-row");


        if (rows.length === 1) {

            alert(

                "Đơn hàng phải có ít nhất một sản phẩm!"

            );

            return;

        }


        button
            .closest(".product-row")
            .remove();


        calculateFormTotal();

    }

);



orderForm.addEventListener(

    "submit",

    event => {


        event.preventDefault();


        const customer =
            document
                .getElementById("orderCustomer")
                .value.trim();


        const table =
            document
                .getElementById("orderTable")
                .value.trim();


        const staff =
            document
                .getElementById("orderStaff")
                .value.trim();


        const date =
            document
                .getElementById("orderDate")
                .value;


        const status =
            document
                .getElementById("orderStatus")
                .value;


        const productRows =
            document.querySelectorAll(".product-row");


        const selectedProducts = [];


        productRows.forEach(row => {


            const select =
                row.querySelector(".product-select");


            const quantity =
                row.querySelector(".product-quantity");


            const productName =
                select.value;


            const quantityValue =
                Number(quantity.value);


            if (productName) {


                selectedProducts.push({

                    name: productName,

                    quantity: quantityValue,

                    price: products[productName]

                });

            }

        });


        if (selectedProducts.length === 0) {

            alert(

                "Vui lòng chọn ít nhất một sản phẩm!"

            );

            return;

        }


        if (editingOrderId) {


            const order =
                orders.find(

                    order =>

                        order.id === editingOrderId

                );


            order.customer =
                customer;


            order.table =
                table;


            order.staff =
                staff;


            order.date =
                date;


            order.status =
                status;


            order.products =
                selectedProducts;


            alert(

                "Cập nhật đơn hàng thành công!"

            );


        } else {


            const newId =

                "DH" +

                String(

                    orders.length + 1

                ).padStart(3, "0");


            orders.push({

                id: newId,

                customer,

                table,

                staff,

                date,

                status,

                products: selectedProducts

            });


            alert(

                "Tạo đơn hàng thành công!"

            );

        }


        renderOrders();


        closeOrderModal();

    }

);



function editOrder(id) {


    const order =
        orders.find(

            order =>

                order.id === id

        );


    if (!order) return;


    editingOrderId =
        id;


    orderModalTitle.textContent =
        "Sửa đơn hàng";


    document
        .getElementById("orderCustomer")
        .value =
        order.customer;


    document
        .getElementById("orderTable")
        .value =
        order.table;


    document
        .getElementById("orderStaff")
        .value =
        order.staff;


    document
        .getElementById("orderDate")
        .value =
        order.date;


    document
        .getElementById("orderStatus")
        .value =
        order.status;


    orderProducts.innerHTML = "";


    order.products.forEach(product => {


        orderProducts.insertAdjacentHTML(

            "beforeend",

            createProductRow(

                product.name,

                product.quantity

            )

        );

    });


    calculateFormTotal();


    orderModal.classList.add("active");

}



function deleteOrder(id) {


    const order =
        orders.find(

            order =>

                order.id === id

        );


    if (!order) return;


    const confirmDelete =
        confirm(

            `Bạn có chắc muốn xóa đơn hàng #${id}?`

        );


    if (!confirmDelete) return;


    orders =
        orders.filter(

            order =>

                order.id !== id

        );


    renderOrders();


    alert(

        "Đã xóa đơn hàng!"

    );

}


function viewOrder(id) {


    const order =
        orders.find(

            order =>

                order.id === id

        );


    if (!order) return;


    const total =
        calculateOrderTotal(order);


    const productHTML =
        order.products

            .map(product => `

                <div class="detail-product">


                    <span>

                        ${product.name}

                        x${product.quantity}

                    </span>


                    <strong>

                        ${formatMoney(

                            product.price *

                            product.quantity

                        )}

                    </strong>


                </div>

            `)

            .join("");


    document
        .getElementById("orderDetailContent")
        .innerHTML = `


        <div class="detail-info">


            <div class="detail-box">

                <span>Mã đơn hàng</span>

                <strong>#${order.id}</strong>

            </div>


            <div class="detail-box">

                <span>Khách hàng</span>

                <strong>${order.customer}</strong>

            </div>


            <div class="detail-box">

                <span>Bàn</span>

                <strong>${order.table}</strong>

            </div>


            <div class="detail-box">

                <span>Nhân viên</span>

                <strong>${order.staff}</strong>

            </div>


            <div class="detail-box">

                <span>Ngày</span>

                <strong>${order.date}</strong>

            </div>


            <div class="detail-box">

                <span>Trạng thái</span>

                <strong>${order.status}</strong>

            </div>


        </div>


        <h3>

            Danh sách sản phẩm

        </h3>


        <div class="detail-products">

            ${productHTML}

        </div>


        <div class="detail-total">

            <span>Tổng tiền</span>

            <strong>${formatMoney(total)}</strong>

        </div>

    `;


    detailModal.classList.add("active");

}


function closeOrderModal() {

    orderModal.classList.remove("active");

}


document
    .getElementById("closeOrderModal")
    .addEventListener(

        "click",

        closeOrderModal

    );


document
    .getElementById("cancelOrderModal")
    .addEventListener(

        "click",

        closeOrderModal

    );


document
    .getElementById("closeDetailModal")
    .addEventListener(

        "click",

        () => {

            detailModal.classList.remove(

                "active"

            );

        }

    );



function filterOrders() {


    const keyword =
        orderSearch.value

            .toLowerCase()

            .trim();


    const status =
        orderStatusFilter.value;


    const date =
        orderDateFilter.value;


    const result =
        orders.filter(order => {


            const productMatch =

                order.products

                    .some(

                        product =>

                            product.name

                                .toLowerCase()

                                .includes(keyword)

                    );


            const keywordMatch =


                order.id

                    .toLowerCase()

                    .includes(keyword)


                ||


                order.customer

                    .toLowerCase()

                    .includes(keyword)


                ||


                productMatch;


            const statusMatch =

                !status ||

                order.status === status;


            const dateMatch =

                !date ||

                order.date === date;


            return (

                keywordMatch &&

                statusMatch &&

                dateMatch

            );

        });


    renderOrders(result);

}


document

    .getElementById("orderSearchButton")

    .addEventListener(

        "click",

        filterOrders

    );


orderSearch

    .addEventListener(

        "input",

        filterOrders

    );


document

    .getElementById("orderFilterButton")

    .addEventListener(

        "click",

        filterOrders

    );



document

    .getElementById("orderResetButton")

    .addEventListener(

        "click",

        () => {


            orderSearch.value =
                "";


            orderStatusFilter.value =
                "";


            orderDateFilter.value =
                "";


            renderOrders();

        }

    );


window.addEventListener(

    "click",

    event => {


        if (

            event.target === orderModal

        ) {

            closeOrderModal();

        }


        if (

            event.target === detailModal

        ) {

            detailModal.classList.remove(

                "active"

            );

        }

    }

);
renderOrders();
