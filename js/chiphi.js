const expenseForm = document.getElementById("expenseForm");

const expenseBody = document.getElementById("expenseBody");

const searchInput = document.getElementById("searchInput");


const expenseCode = document.getElementById("expenseCode");

const expenseType = document.getElementById("expenseType");

const expenseAmount = document.getElementById("expenseAmount");

const expenseSupplier = document.getElementById("expenseSupplier");

const expensePerson = document.getElementById("expensePerson");

const expenseMethod = document.getElementById("expenseMethod");

const expenseDate = document.getElementById("expenseDate");

const expenseStatus = document.getElementById("expenseStatus");

const expenseNote = document.getElementById("expenseNote");

const totalExpense =
document.getElementById("totalExpense");


const totalMoney =
document.getElementById("totalMoney");


const paidExpense =
document.getElementById("paidExpense");


const unPaidExpense =
document.getElementById("unPaidExpense");

let expenses = [];


let editIndex = -1;


function formatMoney(number){

    return Number(number)
    .toLocaleString("vi-VN")
    + "đ";

}
function renderTable(data = expenses){


    expenseBody.innerHTML="";


    if(data.length === 0){

        expenseBody.innerHTML=`

        <tr>

            <td colspan="9"
            style="text-align:center">

                Không có dữ liệu

            </td>

        </tr>

        `;

        return;

    }



    data.forEach((item,index)=>{


        expenseBody.innerHTML += `


        <tr>


            <td>

                ${item.code}

            </td>


            <td>

                ${item.type}

            </td>


            <td>

                ${formatMoney(item.amount)}

            </td>


            <td>

                ${item.supplier}

            </td>


            <td>

                ${item.person}

            </td>


            <td>

                ${item.method}

            </td>


            <td>

                ${item.date}

            </td>



            <td>


                <span class="
                status 
                ${item.status}
                ">


                ${
                    item.status === "paid"

                    ?

                    "Đã thanh toán"

                    :

                    "Chưa thanh toán"

                }


                </span>


            </td>



            <td>


                <button

                class="btn-icon edit-btn"

                onclick="editExpense(${index})">


                <i class="fa-solid fa-pen"></i>


                </button>




                <button

                class="btn-icon delete-btn"

                onclick="deleteExpense(${index})">


                <i class="fa-solid fa-trash"></i>


                </button>


            </td>



        </tr>


        `;


    });


}

function generateCode(){


    let number = expenses.length + 1;


    let code =
    number.toString()
    .padStart(3,"0");



    return "CP" + code;


}
function getFormData(){


    return {


        code:
        expenseCode.value.trim(),



        type:
        expenseType.value,



        amount:
        Number(expenseAmount.value),



        supplier:
        expenseSupplier.value.trim(),



        person:
        expensePerson.value.trim(),



        method:
        expenseMethod.value,



        date:
        expenseDate.value,



        status:
        expenseStatus.value,



        note:
        expenseNote.value.trim()


    };


}

function validateForm(data){


    if(!data.type){

        alert("Vui lòng chọn loại chi phí!");

        return false;

    }



    if(!data.amount || data.amount <= 0){


        alert("Số tiền phải lớn hơn 0!");

        return false;


    }



    if(!data.date){


        alert("Vui lòng chọn ngày thanh toán!");

        return false;


    }



    if(!data.person){


        alert("Vui lòng nhập người thanh toán!");

        return false;


    }



    return true;


}

expenseForm.addEventListener(
"submit",

function(e){


    e.preventDefault();



    let data = getFormData();



    if(!validateForm(data)){

        return;

    }

    if(editIndex === -1){



        data.code = generateCode();



        expenses.push(data);



        alert(
        "Thêm khoản chi thành công!"
        );


    }

    else{



        expenses[editIndex] = data;



        alert(
        "Cập nhật khoản chi thành công!"
        );



        editIndex = -1;


    }





    renderTable();



    updateSummary();



    saveData();



    expenseForm.reset();


});

function editExpense(index){



    let item = expenses[index];



    expenseCode.value =
    item.code;



    expenseType.value =
    item.type;



    expenseAmount.value =
    item.amount;



    expenseSupplier.value =
    item.supplier;



    expensePerson.value =
    item.person;



    expenseMethod.value =
    item.method;



    expenseDate.value =
    item.date;



    expenseStatus.value =
    item.status;



    expenseNote.value =
    item.note;



    editIndex = index;



    window.scrollTo({

        top:0,

        behavior:"smooth"

    });



}
function deleteExpense(index){



    let confirmDelete = confirm(

        "Bạn có chắc chắn muốn xóa khoản chi này?"

    );



    if(!confirmDelete){

        return;

    }



    expenses.splice(index,1);



    renderTable();



    updateSummary();



    saveData();



    alert(

        "Đã xóa khoản chi!"

    );


}

searchInput.addEventListener(

"input",

function(){



    let keyword =

    this.value
    .toLowerCase()
    .trim();



    let result = expenses.filter(item => {



        return (


            item.code
            .toLowerCase()
            .includes(keyword)



            ||



            item.type
            .toLowerCase()
            .includes(keyword)



            ||



            item.supplier
            .toLowerCase()
            .includes(keyword)



            ||



            item.person
            .toLowerCase()
            .includes(keyword)



        );



    });



    renderTable(result);



});

function filterStatus(status){



    if(status === "all"){


        renderTable();


        return;


    }




    let result = expenses.filter(item=>


        item.status === status


    );



    renderTable(result);



}

function updateSummary(){



    let total = expenses.length;



    let money = 0;



    let paid = 0;



    let unpaid = 0;




    expenses.forEach(item=>{


        money += Number(item.amount);



        if(item.status==="paid"){


            paid++;


        }

        else{


            unpaid++;


        }



    });





    if(totalExpense){


        totalExpense.innerText =
        total;


    }





    if(totalMoney){


        totalMoney.innerText =

        formatMoney(money);



    }





    if(paidExpense){


        paidExpense.innerText =

        paid;


    }





    if(unPaidExpense){


        unPaidExpense.innerText =

        unpaid;


    }


}

function saveData(){


    localStorage.setItem(

        "coffee_expenses",

        JSON.stringify(expenses)

    );


}

function loadData(){



    let data =

    localStorage.getItem(
        "coffee_expenses"
    );



    if(data){


        expenses = JSON.parse(data);



    }



}

function createSampleData(){



    if(expenses.length > 0){

        return;

    }

    expenses = [


        {


            code:"CP001",

            type:"Tiền điện",

            amount:3000000,

            supplier:"Điện lực Hà Nội",

            person:"Admin",

            method:"Chuyển khoản",

            date:"2026-07-01",

            status:"paid",

            note:"Thanh toán tiền điện tháng"


        },



        {


            code:"CP002",

            type:"Tiền nước",

            amount:1200000,

            supplier:"Công ty nước",

            person:"Admin",

            method:"Tiền mặt",

            date:"2026-07-03",

            status:"paid",

            note:""


        },



        {


            code:"CP003",

            type:"Marketing",

            amount:2500000,

            supplier:"Facebook Ads",

            person:"Admin",

            method:"Ví điện tử",

            date:"2026-07-05",

            status:"unpaid",

            note:"Quảng cáo sản phẩm"


        }


    ];



}

document.addEventListener(

"DOMContentLoaded",

function(){



    loadData();



    createSampleData();



    renderTable();



    updateSummary();



    saveData();



});