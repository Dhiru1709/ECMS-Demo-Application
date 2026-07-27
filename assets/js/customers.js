// ==========================================
// ECMS - Customer Management
// customers.js
// ==========================================

// Demo Customer Data

let customers = [
    {
        id: "CUST-10001",
        name: "ABC Energy Ltd",
        unit: "North",
        legal: "Energy UK",
        portfolio: "Commercial",
        status: "Active"
    },
    {
        id: "CUST-10002",
        name: "Global Gas",
        unit: "South",
        legal: "Global Holdings",
        portfolio: "Industrial",
        status: "Pending"
    },
    {
        id: "CUST-10003",
        name: "Blue Ocean Fuels",
        unit: "East",
        legal: "Blue Ocean",
        portfolio: "Retail",
        status: "Inactive"
    }
];

const table = document.getElementById("customerTable");
const search = document.getElementById("searchCustomer");
const statusFilter = document.getElementById("statusFilter");
const businessUnit = document.getElementById("businessUnit");

// ==============================
// Load Customers
// ==============================

function loadCustomers(data = customers) {

    table.innerHTML = "";

    data.forEach(customer => {

        let badge = "";

        switch(customer.status){

            case "Active":
                badge="bg-success";
                break;

            case "Pending":
                badge="bg-warning";
                break;

            default:
                badge="bg-secondary";
        }

        table.innerHTML += `

        <tr>

            <td>${customer.id}</td>

            <td>${customer.name}</td>

            <td>${customer.unit}</td>

            <td>${customer.legal}</td>

            <td>${customer.portfolio}</td>

            <td>

                <span class="badge ${badge}">
                    ${customer.status}
                </span>

            </td>

            <td>

                <button
                    class="btn btn-sm btn-outline-primary viewBtn"
                    data-id="${customer.id}">

                    <i class="fa-solid fa-eye"></i>

                </button>

                <button
                    class="btn btn-sm btn-outline-warning editBtn"
                    data-id="${customer.id}">

                    <i class="fa-solid fa-pen"></i>

                </button>

                <button
                    class="btn btn-sm btn-outline-danger deleteBtn"
                    data-id="${customer.id}">

                    <i class="fa-solid fa-trash"></i>

                </button>

            </td>

        </tr>

        `;

    });

    bindEvents();

}

loadCustomers();


// ==============================
// Search
// ==============================

search.addEventListener("keyup", function(){

    const keyword = this.value.toLowerCase();

    const filtered = customers.filter(c =>
        c.name.toLowerCase().includes(keyword) ||
        c.id.toLowerCase().includes(keyword)
    );

    loadCustomers(filtered);

});


// ==============================
// Status Filter
// ==============================

statusFilter.addEventListener("change", filterData);
businessUnit.addEventListener("change", filterData);

function filterData(){

    let status = statusFilter.value;
    let unit = businessUnit.value;

    let filtered = customers.filter(c=>{

        let statusMatch =
            status==="All Status" ||
            c.status===status;

        let unitMatch =
            unit==="Business Unit" ||
            c.unit===unit;

        return statusMatch && unitMatch;

    });

    loadCustomers(filtered);

}


// ==============================
// Button Events
// ==============================

function bindEvents(){

    document.querySelectorAll(".viewBtn").forEach(btn=>{

        btn.onclick=function(){

            window.location.href =
            "customer-details.html?id="+this.dataset.id;

        }

    });


    document.querySelectorAll(".editBtn").forEach(btn=>{

        btn.onclick=function(){

            alert(
                "Edit Customer : "
                +this.dataset.id
            );

        }

    });


    document.querySelectorAll(".deleteBtn").forEach(btn=>{

        btn.onclick=function(){

            if(confirm("Delete this customer?")){

                customers = customers.filter(c=>
                    c.id!==this.dataset.id
                );

                loadCustomers();

            }

        }

    });

}


// ==============================
// Add Customer
// ==============================

document
.getElementById("addCustomerBtn")
.addEventListener("click",()=>{

    alert("Customer Creation Screen Coming Next");

});


// ==============================
// Export CSV
// ==============================

document
.querySelector(".btn-success")
.addEventListener("click",()=>{

    let csv="Customer ID,Customer Name,Business Unit,Legal Entity,Portfolio,Status\n";

    customers.forEach(c=>{

        csv += `${c.id},${c.name},${c.unit},${c.legal},${c.portfolio},${c.status}\n`;

    });

    const blob = new Blob([csv],{
        type:"text/csv"
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href=url;

    a.download="customers.csv";

    a.click();

    URL.revokeObjectURL(url);

});
