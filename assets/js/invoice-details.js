// =====================================================
// ECMS - Invoice Details
// invoice-details.js
// =====================================================

let invoiceModified = false;

// =====================================================
// Page Initialization
// =====================================================

document.addEventListener("DOMContentLoaded", () => {

    initializeEvents();
    restoreActiveTab();

    console.log("Invoice Details Loaded");

});

// =====================================================
// Initialize Events
// =====================================================

function initializeEvents() {

    // Save

    document.querySelector(".btn-success")
        ?.addEventListener("click", saveInvoice);

    // Export PDF

    document.querySelectorAll(".btn").forEach(btn => {

        if(btn.innerText.includes("Export PDF")){

            btn.addEventListener("click", exportPDF);

        }

    });

    // Print

    document.querySelectorAll(".btn").forEach(btn=>{

        if(btn.innerText.includes("Print")){

            btn.addEventListener("click", printInvoice);

        }

    });

    // Edit

    document.querySelectorAll(".btn").forEach(btn=>{

        if(btn.innerText.includes("Edit Invoice")){

            btn.addEventListener("click", editInvoice);

        }

    });

    // Duplicate

    document.querySelectorAll(".btn").forEach(btn=>{

        if(btn.innerText.includes("Duplicate")){

            btn.addEventListener("click", duplicateInvoice);

        }

    });

    // Email

    document.querySelectorAll(".btn").forEach(btn=>{

        if(btn.innerText.includes("Email")){

            btn.addEventListener("click", emailInvoice);

        }

    });

    // Cancel Invoice

    document.querySelectorAll(".btn").forEach(btn=>{

        if(btn.innerText.includes("Cancel Invoice")){

            btn.addEventListener("click", cancelInvoice);

        }

    });

    // Upload

    document.querySelectorAll(".btn").forEach(btn=>{

        if(btn.innerText.includes("Upload")){

            btn.addEventListener("click", uploadDocument);

        }

    });

    // Record Payment

    document.querySelectorAll(".btn").forEach(btn=>{

        if(btn.innerText.includes("Record Payment")){

            btn.addEventListener("click", recordPayment);

        }

    });

    bindDocumentButtons();
    saveActiveTab();

}

// =====================================================
// Save Invoice
// =====================================================

function saveInvoice(){

    invoiceModified=false;

    showToast(
        "Invoice updated successfully",
        "success"
    );

    addTimeline(
        "Invoice Updated",
        "Invoice information was modified."
    );

}

// =====================================================
// Edit
// =====================================================

function editInvoice(){

    window.location.href="create-invoice.html?mode=edit&id=INV-100245";

}

// =====================================================
// Export
// =====================================================

function exportPDF(){

    showToast(
        "PDF generated successfully.",
        "primary"
    );

}

// =====================================================
// Print
// =====================================================

function printInvoice(){

    window.print();

}

// =====================================================
// Email
// =====================================================

function emailInvoice(){

    showToast(
        "Invoice emailed successfully.",
        "success"
    );

    addTimeline(
        "Invoice Emailed",
        "Invoice emailed to customer."
    );

}

// =====================================================
// Duplicate
// =====================================================

function duplicateInvoice(){

    showToast(
        "Invoice duplicated.",
        "primary"
    );

}

// =====================================================
// Cancel Invoice
// =====================================================

function cancelInvoice(){

    if(!confirm("Cancel this invoice?"))
        return;

    showToast(
        "Invoice cancelled.",
        "danger"
    );

    addTimeline(
        "Invoice Cancelled",
        "Invoice marked as cancelled."
    );

}

// =====================================================
// Upload Document
// =====================================================

function uploadDocument(){

    showToast(
        "Document uploaded.",
        "success"
    );

    addTimeline(
        "Document Uploaded",
        "Supporting document uploaded."
    );

}

// =====================================================
// Record Payment
// =====================================================

function recordPayment(){

    showToast(
        "Payment recorded.",
        "success"
    );

    addTimeline(
        "Payment Recorded",
        "Customer payment has been recorded."
    );

}

// =====================================================
// Download / Delete Documents
// =====================================================

function bindDocumentButtons(){

    document
    .querySelectorAll(".btn-outline-primary")
    .forEach(btn=>{

        if(btn.querySelector(".fa-download")){

            btn.onclick=()=>{

                showToast(
                    "Downloading document...",
                    "primary"
                );

            }

        }

    });

    document
    .querySelectorAll(".btn-outline-danger")
    .forEach(btn=>{

        if(btn.querySelector(".fa-trash")){

            btn.onclick=()=>{

                if(confirm("Delete document?")){

                    btn.closest("tr").remove();

                    showToast(
                        "Document deleted.",
                        "warning"
                    );

                }

            }

        }

    });

}

// =====================================================
// Timeline
// =====================================================

function addTimeline(title,description){

    const timeline=document.querySelector(".timeline");

    if(!timeline)
        return;

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

// =====================================================
// Tab Persistence
// =====================================================

function saveActiveTab(){

    document.querySelectorAll(".nav-link")
    .forEach(tab=>{

        tab.addEventListener("click",()=>{

            localStorage.setItem(

                "invoiceTab",

                tab.dataset.bsTarget

            );

        });

    });

}

function restoreActiveTab(){

    const active=localStorage.getItem("invoiceTab");

    if(active){

        document
        .querySelector(`[data-bs-target="${active}"]`)
        ?.click();

    }

}

// =====================================================
// Detect Changes
// =====================================================

document
.querySelectorAll("input,textarea,select")
.forEach(field=>{

    field.addEventListener("change",()=>{

        invoiceModified=true;

    });

});

// =====================================================
// Warn Before Leaving
// =====================================================

window.addEventListener("beforeunload",(e)=>{

    if(invoiceModified){

        e.preventDefault();

        e.returnValue="";

    }

});

// =====================================================
// Keyboard Shortcuts
// =====================================================

document.addEventListener("keydown",(e)=>{

    if(e.ctrlKey && e.key==="s"){

        e.preventDefault();

        saveInvoice();

    }

    if(e.ctrlKey && e.key==="p"){

        e.preventDefault();

        printInvoice();

    }

    if(e.ctrlKey && e.key==="e"){

        e.preventDefault();

        exportPDF();

    }

});

// =====================================================
// Toast
// =====================================================

function showToast(message,type="primary"){

    const toast=document.createElement("div");

    toast.className=
        `alert alert-${type} position-fixed`;

    toast.style.top="20px";
    toast.style.right="20px";
    toast.style.minWidth="280px";
    toast.style.zIndex="99999";
    toast.style.boxShadow="0 10px 25px rgba(0,0,0,.15)";

    toast.innerHTML=message;

    document.body.appendChild(toast);

    setTimeout(()=>{

        toast.remove();

    },3000);

}
