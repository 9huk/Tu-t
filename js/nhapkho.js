const tableBody = document.getElementById("importTableBody");

const saveBtn = document.getElementById("saveBtn");

const searchInput = document.getElementById("searchInput");

const filterCategory = document.getElementById("filterCategory");

const maSP = document.getElementById("maSP");

const tenSP = document.getElementById("tenSP");

const danhMuc = document.getElementById("danhMuc");

const donVi = document.getElementById("donVi");

const soLuong = document.getElementById("soLuong");

const donGia = document.getElementById("donGia");

const nhaCungCap = document.getElementById("nhaCungCap");

const ngayNhap = document.getElementById("ngayNhap");


const totalImport = document.getElementById("totalImport");

const totalProduct = document.getElementById("totalProduct");

const totalMoney = document.getElementById("totalMoney");

const totalSupplier = document.getElementById("totalSupplier");



let editIndex = -1;

let inventory =
JSON.parse(localStorage.getItem("inventory")) || [

{
    ma:"SP001",
    ten:"Cà phê Arabica",
    dm:"Cà phê",
    dv:"Kg",
    sl:20,
    dg:250000,
    ncc:"Coffee Việt",
    ngay:"2026-07-01"
},

{
    ma:"SP002",
    ten:"Cà phê Robusta",
    dm:"Cà phê",
    dv:"Kg",
    sl:30,
    dg:180000,
    ncc:"Coffee Tây Nguyên",
    ngay:"2026-07-02"
},

{
    ma:"SP003",
    ten:"Sữa tươi",
    dm:"Sữa",
    dv:"Thùng",
    sl:15,
    dg:420000,
    ncc:"Vinamilk",
    ngay:"2026-07-03"
},

{
    ma:"SP004",
    ten:"Sirup Dâu",
    dm:"Sirup",
    dv:"Chai",
    sl:25,
    dg:120000,
    ncc:"Monin",
    ngay:"2026-07-04"
}

];

function saveData(){

    localStorage.setItem(

        "inventory",

        JSON.stringify(inventory)

    );

}

function renderTable(data = inventory){

    tableBody.innerHTML = "";

    data.forEach((item,index)=>{

        tableBody.innerHTML += `

        <tr>

    <td>${item.ma}</td>
    <td>${item.ten}</td>
    <td>${item.dm}</td>
    <td>${item.dv}</td>
    <td>${item.sl}</td>
    <td>${Number(item.dg).toLocaleString('vi-VN')}đ</td>
    <td>${(item.sl * item.dg).toLocaleString('vi-VN')}đ</td>
    <td>${item.ncc}</td>
    <td>${item.ngay}</td>

            <td>

                <button
                    class="btn-icon edit-btn"
                    onclick="editImport(${index})">

                    <i class="fa-solid fa-pen"></i>

                </button>

                <button
                    class="btn-icon delete-btn"
                    onclick="deleteImport(${index})">

                    <i class="fa-solid fa-trash"></i>

                </button>

            </td>

        </tr>

        `;

    });

    updateSummary();

}

const openBtn = document.getElementById("saveBtnTop");

openBtn.addEventListener("click", function () {
    document.querySelector(".content-card").scrollIntoView({
        behavior: "smooth"
    });

    document.getElementById("maSP").focus();
});

saveBtn.addEventListener("click",function(){

    if(
        maSP.value.trim()==="" ||
        tenSP.value.trim()==="" ||
        soLuong.value==="" ||
        donGia.value==="" ||
        nhaCungCap.value.trim()==="" ||
        ngayNhap.value===""

    ){

        alert("Vui lòng nhập đầy đủ thông tin.");

        return;

    }

    const item={

        ma:maSP.value,

        ten:tenSP.value,

        dm:danhMuc.value,

        dv:donVi.value,

        sl:Number(soLuong.value),

        dg:Number(donGia.value),

        ncc:nhaCungCap.value,

        ngay:ngayNhap.value

    };

    if(editIndex===-1){

        inventory.push(item);

    }else{

        inventory[editIndex]=item;

        editIndex=-1;

        saveBtn.innerHTML='<i class="fa-solid fa-plus"></i> Lưu phiếu nhập';

    }

    saveData();

    renderTable();

    clearForm();

});

function editImport(index){

    editIndex=index;

    const item=inventory[index];

    maSP.value=item.ma;

    tenSP.value=item.ten;

    danhMuc.value=item.dm;

    donVi.value=item.dv;

    soLuong.value=item.sl;

    donGia.value=item.dg;

    nhaCungCap.value=item.ncc;

    ngayNhap.value=item.ngay;

    saveBtn.innerHTML='<i class="fa-solid fa-floppy-disk"></i> Cập nhật';

}

function clearForm(){

    maSP.value="";

    tenSP.value="";

    danhMuc.selectedIndex=0;

    donVi.selectedIndex=0;

    soLuong.value="";

    donGia.value="";

    nhaCungCap.value="";

    ngayNhap.value="";

}
function deleteImport(index){

    if(confirm("Bạn có chắc muốn xóa phiếu nhập này?")){

        inventory.splice(index,1);

        saveData();

        renderTable();

    }

}

searchInput.addEventListener("keyup",function(){

    const keyword=this.value.toLowerCase();

    const result=inventory.filter(item=>

        item.ma.toLowerCase().includes(keyword) ||

        item.ten.toLowerCase().includes(keyword)

    );

    renderTable(result);

});

filterCategory.addEventListener("change",function(){

    if(this.value===""){

        renderTable();

        return;

    }

    const result=inventory.filter(item=>

        item.dm===this.value

    );

    renderTable(result);

});

function updateSummary(){

    totalImport.innerText=inventory.length;

    totalProduct.innerText=inventory.length;

    let money=0;

    inventory.forEach(item=>{

        money += item.sl * item.dg;

    });

    totalMoney.innerText=
        money.toLocaleString("vi-VN")+"đ";

    const supplier=new Set();

    inventory.forEach(item=>{

        supplier.add(item.ncc);

    });

    totalSupplier.innerText=supplier.size;

}

const resetBtn=document.getElementById("resetBtn");

if(resetBtn){

    resetBtn.onclick=function(){

        clearForm();

        editIndex=-1;

        saveBtn.innerHTML=
        '<i class="fa-solid fa-plus"></i> Lưu phiếu nhập';

    };

}

renderTable();
