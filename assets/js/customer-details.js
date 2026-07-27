// ===============================================
// ECMS Customer Details
// customer-details.js
// ===============================================

let customerChanged = false;

// ------------------------------
// Sample Customer Data
// ------------------------------

const customer = {

    id: "CUST-10001",

    name: "ABC Energy Ltd",

    email: "info@abcenergy.com",

    phone: "+44 123456789"

};

// ------------------------------
// Read Customer Id
// ------------------------------

const params = new URLSearchParams(window.location.search);

const customerId = params.get("id");

if(customerId){

    console.log("Loading Customer :", customerId);

}

// ------------------------------
// Detect Form Changes
// ------------------------------

document
.querySelectorAll("input,select,textarea")
.forEach(field=>{

    field.addEventListener("change",()=>{

        customerChanged = true;

    });

});

// ------------------------------
// Warn Before Leaving
// ------------------------------

window.addEventListener("beforeunload",function(e){

    if(customerChanged){

        e.preventDefault();

        e.returnValue="";

    }

});

// ------------------------------
// Save Buttons
// ------------------------------

document
.querySelectorAll(".btn-success,.btn-primary")
.forEach(btn=>{

    if(btn.innerText.includes("Save")){

        btn.addEventListener("click",saveCustomer);

    }

});

function saveCustomer(){

    if(!validateForm()){

        return;

    }

    customerChanged=false;

    showToast(

        "Customer saved successfully",

        "success"

    );

    addTimeline(

        "Customer Updated",

        "Customer information was updated."

    );

}

// ------------------------------
// Validation
// ------------------------------

function validateForm(){

    let valid=true;

    document
    .querySelectorAll("input[required]")
    .forEach(input=>{

        if(input.value.trim()===""){

            input.style.borderColor="red";

            valid=false;

        }else{

            input.style.borderColor="#ced4da";

        }

    });

    if(!valid){

        showToast(

            "Please fill mandatory fields",

            "danger"

        );

    }

    return valid;

}

// ------------------------------
// Back Button
// ------------------------------

const backBtn=document.querySelector(".btn-outline-secondary");

if(backBtn){

    backBtn.onclick=()=>{

        if(customerChanged){

            if(!confirm("Discard changes?")){

                return;

            }

        }

        window.location.href="customers.html";

    }

}

// ------------------------------
// Upload Button
// ------------------------------

document
.querySelectorAll(".btn")
.forEach(btn=>{

    if(btn.innerText.includes("Upload")){

        btn.onclick=()=>{

            showToast(

                "Document uploaded",

                "success"

            );

            addTimeline(

                "Document Uploaded",

                "Customer document uploaded."

            );

        }

    }

});

// ------------------------------
// Add Contact
// ------------------------------

document
.querySelectorAll(".btn")
.forEach(btn=>{

    if(btn.innerText.includes("Add Contact")){

        btn.onclick=()=>{

            showToast(

                "Contact added",

                "success"

            );

            addTimeline(

                "Contact Added",

                "New customer contact created."

            );

        }

    }

});

// ------------------------------
// Delete Buttons
// ------------------------------

document
.querySelectorAll(".btn-outline-danger")
.forEach(btn=>{

    btn.onclick=()=>{

        if(confirm("Delete this record?")){

            showToast(

                "Record deleted",

                "warning"

            );

        }

    }

});

// ------------------------------
// Timeline
// ------------------------------

function addTimeline(title,description){

    const timeline=document.querySelector(".timeline");

    if(!timeline) return;

    const item=document.createElement("div");

    item.className="timeline-item";

    item.innerHTML=`

<div class="timeline-icon bg-primary">

<i class="fa-solid fa-clock"></i>

</div>

<div class="timeline-content">

<h6>${title}</h6>

<p>${description}</p>

<small>${new Date().toLocaleString()}</small>

</div>

`;

    timeline.prepend(item);

}

// ------------------------------
// Toast Notification
// ------------------------------

function showToast(message,type){

    const toast=document.createElement("div");

    toast.className=

    `alert alert-${type} position-fixed`;

    toast.style.top="20px";

    toast.style.right="20px";

    toast.style.zIndex="99999";

    toast.style.minWidth="260px";

    toast.style.boxShadow="0 10px 25px rgba(0,0,0,.15)";

    toast.innerHTML=message;

    document.body.appendChild(toast);

    setTimeout(()=>{

        toast.remove();

    },3000);

}

// ------------------------------
// Auto Save Indicator
// ------------------------------

setInterval(()=>{

    if(customerChanged){

        console.log("Unsaved Changes...");

    }

},5000);

// ------------------------------
// Keyboard Shortcut
// ------------------------------

document.addEventListener("keydown",e=>{

    if(e.ctrlKey && e.key==="s"){

        e.preventDefault();

        saveCustomer();

    }

});

// ------------------------------
// Active Tab Persistence
// ------------------------------

const tabs=document.querySelectorAll(".nav-link");

tabs.forEach(tab=>{

    tab.addEventListener("click",()=>{

        localStorage.setItem(

            "customerTab",

            tab.dataset.bsTarget

        );

    });

});

window.addEventListener("load",()=>{

    const active=

    localStorage.getItem("customerTab");

    if(active){

        document

        .querySelector(`[data-bs-target="${active}"]`)

        ?.click();

    }

});

console.log("ECMS Customer Details Loaded");
