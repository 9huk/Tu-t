const defaultTables = [

    {
        name: "Bàn B01",
        capacity: 4,
        area: "Trong nhà",
        status: "available"
    },

    {
        name: "Bàn B02",
        capacity: 4,
        area: "Trong nhà",
        status: "occupied"
    },

    {
        name: "Bàn B03",
        capacity: 6,
        area: "Trong nhà",
        status: "available"
    },

    {
        name: "Bàn B04",
        capacity: 2,
        area: "Ngoài trời",
        status: "maintenance"
    },

    {
        name: "Bàn B05",
        capacity: 4,
        area: "Ngoài trời",
        status: "available"
    },

    {
        name: "Bàn T01",
        capacity: 8,
        area: "Tầng 2",
        status: "occupied"
    }

];



let tables =

    JSON.parse(

        localStorage.getItem("coffeeTables")

    ) || defaultTables;



const tableGrid =

    document.getElementById("tableGrid");


const tableModal =

    document.getElementById("tableModal");


const tableForm =

    document.getElementById("tableForm");


const modalTitle =

    document.getElementById("modalTitle");


const tableIndex =

    document.getElementById("tableIndex");


const tableName =

    document.getElementById("tableName");


const capacity =

    document.getElementById("capacity");


const area =

    document.getElementById("area");


const status =

    document.getElementById("status");


const searchInput =

    document.getElementById("searchInput");


const filterStatus =

    document.getElementById("filterStatus");


const filterArea =

    document.getElementById("filterArea");



function saveTables() {

    localStorage.setItem(

        "coffeeTables",

        JSON.stringify(tables)

    );

}



function getStatusText(status) {


    const statusMap = {

        available: "Còn trống",

        occupied: "Đang sử dụng",

        maintenance: "Bảo trì"

    };


    return statusMap[status];

}


function getStatusClass(status) {


    const classMap = {

        available: "status-available",

        occupied: "status-occupied",

        maintenance: "status-maintenance"

    };


    return classMap[status];

}



function renderTables() {


    const keyword =

        searchInput.value

            .toLowerCase()

            .trim();


    const selectedStatus =

        filterStatus.value;


    const selectedArea =

        filterArea.value;


    const filteredTables =

        tables.filter(table => {


            const matchName =

                table.name

                    .toLowerCase()

                    .includes(keyword);


            const matchStatus =

                !selectedStatus ||

                table.status === selectedStatus;


            const matchArea =

                !selectedArea ||

                table.area === selectedArea;


            return (

                matchName &&

                matchStatus &&

                matchArea

            );

        });


    tableGrid.innerHTML = "";


    if (filteredTables.length === 0) {


        tableGrid.innerHTML = `

            <div class="empty-state">


                <i class="fa-solid fa-chair"></i>


                <h3>

                    Không tìm thấy bàn

                </h3>


                <p>

                    Hãy thử thay đổi điều kiện tìm kiếm

                </p>


            </div>

        `;


        updateSummary();


        return;

    }


    filteredTables.forEach(table => {


        const realIndex =

            tables.indexOf(table);


        const card =

            document.createElement("article");


        card.className =

            "table-card";


        card.innerHTML = `


            <div class="table-card-header">


                <div class="table-icon">


                    <i class="fa-solid fa-chair"></i>


                </div>


                <span

                    class="status-badge

                    ${getStatusClass(table.status)}">


                    ${getStatusText(table.status)}


                </span>


            </div>


            <h2 class="table-name">


                ${table.name}


            </h2>


            <div class="table-info">


                <div class="info-item">


                    <i class="fa-solid fa-users"></i>


                    <span>


                        Sức chứa:

                        <strong>

                            ${table.capacity}

                        </strong>

                        người

                    </span>


                </div>


                <div class="info-item">


                    <i class="fa-solid fa-location-dot"></i>


                    <span>


                        ${table.area}

                    </span>


                </div>


            </div>


            <div class="card-actions">


                <button

                    class="card-action edit-btn"

                    onclick="editTable(${realIndex})">


                    <i class="fa-solid fa-pen"></i>

                    Sửa


                </button>


                <button

                    class="card-action delete-btn"

                    onclick="deleteTable(${realIndex})">


                    <i class="fa-solid fa-trash"></i>

                    Xóa


                </button>


            </div>


        `;


        tableGrid.appendChild(card);

    });


    updateSummary();

}



function updateSummary() {


    document

        .getElementById("totalTables")

        .textContent = tables.length;


    document

        .getElementById("availableTables")

        .textContent =

        tables.filter(

            table =>

                table.status === "available"

        ).length;


    document

        .getElementById("occupiedTables")

        .textContent =

        tables.filter(

            table =>

                table.status === "occupied"

        ).length;


    document

        .getElementById("maintenanceTables")

        .textContent =

        tables.filter(

            table =>

                table.status === "maintenance"

        ).length;

}



document

    .getElementById("openModal")

    .addEventListener(

        "click",

        () => {


            modalTitle.textContent =

                "Thêm bàn";


            tableForm.reset();


            tableIndex.value = "";


            status.value =

                "available";


            tableModal.classList.add(

                "active"

            );

        }

    );



function closeModal() {


    tableModal.classList.remove(

        "active"

    );

}


document

    .getElementById("closeModal")

    .addEventListener(

        "click",

        closeModal

    );


document

    .getElementById("cancelBtn")

    .addEventListener(

        "click",

        closeModal

    );



tableModal.addEventListener(

    "click",

    event => {


        if (

            event.target === tableModal

        ) {

            closeModal();

        }

    }

);



tableForm.addEventListener(

    "submit",

    event => {


        event.preventDefault();


        const name =

            tableName.value.trim();


        const tableCapacity =

            Number(

                capacity.value

            );


        const tableArea =

            area.value;


        const tableStatus =

            status.value;


        if (!name) {

            alert(

                "Vui lòng nhập tên bàn!"

            );

            return;

        }


        if (

            !tableCapacity ||

            tableCapacity < 1

        ) {

            alert(

                "Sức chứa phải lớn hơn 0!"

            );

            return;

        }


        const duplicate =

            tables.some(

                (table, index) =>

                    table.name

                        .toLowerCase()

                        === name.toLowerCase()

                    &&

                    index !==

                    Number(tableIndex.value)

            );


        if (duplicate) {


            alert(

                "Tên bàn đã tồn tại!"

            );


            return;

        }


        const tableData = {


            name: name,


            capacity:

                tableCapacity,


            area:

                tableArea,


            status:

                tableStatus

        };


        if (

            tableIndex.value === ""

        ) {


            tables.push(

                tableData

            );


            alert(

                "Thêm bàn thành công!"

            );

        }

        else {


            tables[

                Number(

                    tableIndex.value

                )

            ] = tableData;


            alert(

                "Cập nhật bàn thành công!"

            );

        }


        saveTables();


        renderTables();


        closeModal();

    }

);


function editTable(index) {


    const table =

        tables[index];


    if (!table) return;


    modalTitle.textContent =

        "Sửa thông tin bàn";


    tableIndex.value =

        index;


    tableName.value =

        table.name;


    capacity.value =

        table.capacity;


    area.value =

        table.area;


    status.value =

        table.status;


    tableModal.classList.add(

        "active"

    );

}



function deleteTable(index) {


    const table =

        tables[index];


    if (!table) return;


    const confirmDelete =

        confirm(

            `Bạn có chắc muốn xóa ${table.name}?`

        );


    if (!confirmDelete) return;


    tables.splice(

        index,

        1

    );


    saveTables();


    renderTables();


    alert(

        "Xóa bàn thành công!"

    );

}

searchInput.addEventListener(

    "input",

    renderTables

);


filterStatus.addEventListener(

    "change",

    renderTables

);


filterArea.addEventListener(

    "change",

    renderTables

);



document

    .getElementById("resetFilter")

    .addEventListener(

        "click",

        () => {


            searchInput.value = "";


            filterStatus.value = "";


            filterArea.value = "";


            renderTables();

        }

    );



renderTables();