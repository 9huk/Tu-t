let suppliers = JSON.parse(localStorage.getItem("suppliers")) || [];

const tableBody = document.getElementById("supplierTableBody");

const modal = document.getElementById("supplierModal");

const form = document.getElementById("supplierForm");

const openBtn = document.getElementById("openModal");

const closeBtn = document.getElementById("closeModal");

const cancelBtn = document.getElementById("cancelBtn");


function saveData(){

    localStorage.setItem(
        "suppliers",
        JSON.stringify(suppliers)
    );

}


function renderTable(data = suppliers){

    tableBody.innerHTML="";


    if(data.length === 0){

        document.getElementById("emptyMessage").style.display="block";

        return;

    }

    document.getElementById("emptyMessage").style.display="none";


    data.forEach((item,index)=>{


        let statusClass =
        item.status==="Đang hợp tác"
        ? "success"
        :
        "warning";


        tableBody.innerHTML += `

        <tr>

            <td>
                <b>${item.name}</b>
            </td>


            <td>${item.phone}</td>


            <td>${item.email}</td>


            <td>${item.address}</td>


            <td>${item.product}</td>


            <td>
                <span class="status ${statusClass}">
                    ${item.status}
                </span>
            </td>


            <td>

                <button 
                class="btn-edit"
                onclick="editSupplier(${index})">

                <i class="fa-solid fa-pen"></i>

                </button>


                <button
                class="btn-delete"
                onclick="deleteSupplier(${index})">

                <i class="fa-solid fa-trash"></i>

                </button>

            </td>


        </tr>

        `;


    });


    updateSummary();

}



function updateSummary(){


document.getElementById("totalSupplier")
.innerText=suppliers.length;


document.getElementById("activeSupplier")
.innerText=
suppliers.filter(
x=>x.status==="Đang hợp tác"
).length;


document.getElementById("pauseSupplier")
.innerText=
suppliers.filter(
x=>x.status==="Tạm ngưng"
).length;


let total=0;


suppliers.forEach(x=>{

    total += x.product.split(",").length;

});


document.getElementById("totalProduct")
.innerText=total;


}




openBtn.onclick=()=>{


modal.classList.add("show");

document.getElementById("modalTitle")
.innerText="Thêm nhà cung cấp";


form.reset();

document.getElementById("supplierIndex").value="";

}




closeBtn.onclick=
cancelBtn.onclick=()=>{

modal.classList.remove("show");

}




form.addEventListener(
"submit",
function(e){

e.preventDefault();



let index =
document.getElementById("supplierIndex").value;



let data={


name:
supplierName.value,


phone:
supplierPhone.value,


email:
supplierEmail.value,


address:
supplierAddress.value,


product:
supplierProduct.value,


status:
supplierStatus.value



};



if(index===""){


suppliers.push(data);


}else{


suppliers[index]=data;


}



saveData();

renderTable();


modal.classList.remove("show");


});


function editSupplier(index){


let s=suppliers[index];


modal.classList.add("show");


document.getElementById("modalTitle")
.innerText="Sửa nhà cung cấp";



supplierIndex.value=index;


supplierName.value=s.name;

supplierPhone.value=s.phone;

supplierEmail.value=s.email;

supplierAddress.value=s.address;

supplierProduct.value=s.product;

supplierStatus.value=s.status;


}



function deleteSupplier(index){


if(confirm(
"Bạn có chắc muốn xóa nhà cung cấp này?"
)){


suppliers.splice(index,1);


saveData();

renderTable();


}


}




searchInput.addEventListener(
"input",
function(){


let keyword=this.value
.toLowerCase();


let result=suppliers.filter(x=>


x.name.toLowerCase()
.includes(keyword)


||

x.phone.includes(keyword)


||

x.email.toLowerCase()
.includes(keyword)



);


renderTable(result);


});





filterStatus.addEventListener(
"change",
function(){


let value=this.value;


if(value===""){

renderTable();

}

else{


renderTable(
suppliers.filter(
x=>x.status===value
)
);


}


});





renderTable();