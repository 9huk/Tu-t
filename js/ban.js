const modal = document.getElementById("tableModal");
const openModal = document.getElementById("openModal");
const closeModal = document.getElementById("closeModal");
const cancelBtn = document.getElementById("cancelBtn");

const tableForm = document.getElementById("tableForm");

const tableGrid = document.getElementById("tableGrid");

const searchInput = document.getElementById("searchInput");
const filterStatus = document.getElementById("filterStatus");

const tableName = document.getElementById("tableName");
const capacity = document.getElementById("capacity");
const area = document.getElementById("area");
const status = document.getElementById("status");
const tableIndex = document.getElementById("tableIndex");

let tables = [];

if(localStorage.getItem("tables")){

    tables = JSON.parse(localStorage.getItem("tables"));

}else{

    tables = [

        {
            name:"B01",
            capacity:4,
            area:"Trong nhà",
            status:"available"
        },

        {
            name:"B02",
            capacity:6,
            area:"Ngoài trời",
            status:"occupied"
        },

        {
            name:"B03",
            capacity:2,
            area:"Tầng 2",
            status:"available"
        }

    ];

    saveData();

}

function saveData(){

    localStorage.setItem(
        "tables",
        JSON.stringify(tables)
    );

}

openModal.addEventListener("click",()=>{

    tableForm.reset();

    tableIndex.value="";

    document.getElementById("modalTitle").innerText="Thêm bàn";

    modal.classList.add("show");

});

closeModal.addEventListener("click",()=>{

    modal.classList.remove("show");

});

cancelBtn.addEventListener("click",()=>{

    modal.classList.remove("show");

});

window.addEventListener("click",(e)=>{

    if(e.target===modal){

        modal.classList.remove("show");

    }

});

function renderTables(data = tables){

    tableGrid.innerHTML = "";

    data.forEach((table, index) => {

        let statusText = "";

        switch(table.status){

            case "available":
                statusText = "Còn trống";
                break;

            case "occupied":
                statusText = "Đang sử dụng";
                break;

            case "maintenance":
                statusText = "Bảo trì";
                break;
        }

        tableGrid.innerHTML += `

        <div class="table-card">

            <h3>${table.name}</h3>

            <p><strong>Sức chứa:</strong> ${table.capacity} người</p>

            <p><strong>Khu vực:</strong> ${table.area}</p>

            <p class="status ${table.status}">
                ${statusText}
            </p>

            <div class="card-buttons">

                <button class="detail-btn"
                    onclick="viewTable(${index})">
                    Chi tiết
                </button>

                <button class="edit-btn"
                    onclick="editTable(${index})">
                    Sửa
                </button>

                <button class="delete-btn"
                    onclick="deleteTable(${index})">
                    Xóa
                </button>

            </div>

        </div>

        `;

    });

}

function viewTable(index){

    const t = tables[index];

    let trangThai = "";

    if(t.status=="available")
        trangThai="Còn trống";

    if(t.status=="occupied")
        trangThai="Đang sử dụng";

    if(t.status=="maintenance")
        trangThai="Bảo trì";

    alert(

`Tên bàn: ${t.name}

Sức chứa: ${t.capacity} người

Khu vực: ${t.area}

Trạng thái: ${trangThai}`

    );

}

function editTable(index){

    const t = tables[index];

    tableIndex.value = index;

    tableName.value = t.name;

    capacity.value = t.capacity;

    area.value = t.area;

    status.value = t.status;

    document.getElementById("modalTitle").innerText = "Sửa bàn";

    modal.classList.add("show");

}

function deleteTable(index){

    if(confirm("Bạn có chắc muốn xóa bàn này?")){

        tables.splice(index,1);

        saveData();

        renderTables();

    }

}

renderTables();
tableForm.addEventListener("submit", function (e) {

    e.preventDefault();

    const newTable = {

        name: tableName.value.trim(),

        capacity: parseInt(capacity.value),

        area: area.value,

        status: status.value

    };
    if (newTable.name === "") {
        alert("Vui lòng nhập tên bàn.");
        return;
    }

    if (isNaN(newTable.capacity) || newTable.capacity <= 0) {
        alert("Sức chứa phải lớn hơn 0.");
        return;
    }
    const duplicate = tables.findIndex((item, index) => {
        return (
            item.name.toLowerCase() === newTable.name.toLowerCase() &&
            index != tableIndex.value
        );
    });

    if (duplicate !== -1) {
        alert("Tên bàn đã tồn tại.");
        return;
    }

    if (tableIndex.value === "") {

        tables.push(newTable);

    } else {

        tables[tableIndex.value] = newTable;

    }

    saveData();

    renderTables();

    modal.classList.remove("show");

    tableForm.reset();

});


searchInput.addEventListener("keyup", filterTables);


filterStatus.addEventListener("change", filterTables);


function filterTables() {

    const keyword = searchInput.value.toLowerCase();

    const statusFilter = filterStatus.value;

    const result = tables.filter(table => {

        const matchName =
            table.name.toLowerCase().includes(keyword);

        const matchStatus =
            statusFilter === "" ||
            table.status === statusFilter;

        return matchName && matchStatus;

    });

    renderTables(result);

}

renderTables();
