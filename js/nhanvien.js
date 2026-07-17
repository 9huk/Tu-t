const modal =
document.getElementById("employeeModal");


const openModal =
document.getElementById("openModal");


const closeModal =
document.getElementById("closeModal");


const cancelBtn =
document.getElementById("cancelBtn");


const form =
document.getElementById("employeeForm");


const tableBody =
document.getElementById("employeeTableBody");


const modalTitle =
document.getElementById("modalTitle");



const searchInput =
document.getElementById("searchEmployee");


const filter =
document.getElementById("filterEmployee");



const totalEmployee =
document.getElementById("totalEmployee");


const workingEmployee =
document.getElementById("workingEmployee");



let editingRow = null;

function showModal(title){

    modalTitle.innerText = title;

    modal.classList.add("show");

}



function hideModal(){

    modal.classList.remove("show");

    form.reset();

    editingRow = null;

}



openModal.onclick = function(){

    showModal("Thêm nhân viên");

};



closeModal.onclick = hideModal;


cancelBtn.onclick = hideModal;



modal.onclick = function(e){

    if(e.target === modal){

        hideModal();

    }

};


function createAvatar(name){


    return name
    .trim()
    .split(" ")
    .map(x=>x[0])
    .slice(0,2)
    .join("")
    .toUpperCase();


}


function formatMoney(value){


    return Number(value)
    .toLocaleString("vi-VN")
    +"đ";


}


function updateStatistic(){


    const rows =
    tableBody.querySelectorAll("tr");


    totalEmployee.innerText =
    rows.length;



    let working = 0;



    rows.forEach(row=>{


        let status =
        row.children[5]
        .innerText
        .trim();



        if(status==="Đang làm"){

            working++;

        }


    });



    workingEmployee.innerText =
    working;


}
form.addEventListener(
"submit",
function(e){


e.preventDefault();



const name =
document.getElementById("employeeName").value;



const position =
document.getElementById("employeePosition").value;



const phone =
document.getElementById("employeePhone").value;



const email =
document.getElementById("employeeEmail").value;



const salary =
document.getElementById("employeeSalary").value;



const status =
document.getElementById("employeeStatus").value;



let statusClass =
status==="Đang làm"
?"active"
:"off";



const avatar =
createAvatar(name);





let html = `


<td class="employee-info">


<div class="avatar">

${avatar}

</div>


<div>

<strong>
${name}
</strong>


<span>
${position}
</span>


</div>


</td>




<td>
${position}
</td>




<td>
${phone}
</td>




<td>
${email}
</td>




<td>
${formatMoney(salary)}
</td>




<td>

<span class="status ${statusClass}">

${status}

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





if(editingRow){


    editingRow.innerHTML = html;


}

else{


    let row =
    document.createElement("tr");


    row.innerHTML = html;


    tableBody.appendChild(row);


}


hideModal();


updateStatistic();


});


tableBody.addEventListener(
"click",
function(e){



const edit =
e.target.closest(".edit-btn");



const del =
e.target.closest(".delete-btn");

if(edit){


editingRow =
edit.closest("tr");



document.getElementById("employeeName").value =
editingRow.querySelector("strong").innerText;



document.getElementById("employeePosition").value =
editingRow.children[1].innerText;



document.getElementById("employeePhone").value =
editingRow.children[2].innerText;



document.getElementById("employeeEmail").value =
editingRow.children[3].innerText;



document.getElementById("employeeSalary").value =
editingRow.children[4]
.innerText
.replaceAll(".","")
.replace("đ","");



document.getElementById("employeeStatus").value =
editingRow.children[5]
.innerText
.trim();



showModal("Sửa nhân viên");

}


if(del){


let row =
del.closest("tr");



if(confirm(
"Bạn có chắc muốn xóa nhân viên này?"
)){


row.remove();


updateStatistic();


}



}



});


searchInput.addEventListener(
"keyup",
function(){


let keyword =
this.value.toLowerCase();



tableBody
.querySelectorAll("tr")
.forEach(row=>{


let text =
row.innerText.toLowerCase();



row.style.display =
text.includes(keyword)
?""
:"none";



});


});

filter.addEventListener(
"change",
function(){


let value =
this.value;



tableBody
.querySelectorAll("tr")
.forEach(row=>{


let status =
row.children[5]
.innerText
.trim();



if(value==="all"
|| status===value){


row.style.display="";


}
else{


row.style.display="none";


}



});


});

updateStatistic();