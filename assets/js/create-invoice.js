// ==========================================================
// ECMS - Create Invoice
// ==========================================================

let invoice = {

    invoiceNo: "",

    items: [],

    subTotal: 0,

    taxTotal: 0,

    grandTotal: 0

};

let unsavedChanges = false;

// ==========================================================
// Initialize
// ==========================================================

document.addEventListener("DOMContentLoaded", () => {

    generateInvoiceNumber();

    addNewRow();

    bindEvents();

});

// ==========================================================
// Generate Invoice Number
// ==========================================================

function generateInvoiceNumber(){

    const random = Math.floor(100000 + Math.random() * 900000);

    invoice.invoiceNo = "INV-" + random;

    const field = document.querySelector("input[placeholder='Auto Generated']");

    if(field){

        field.value = invoice.invoiceNo;

    }

}

// ==========================================================
// Events
// ==========================================================

function bindEvents(){

    document
    .getElementById("addItemBtn")
    .addEventListener("click", addNewRow);

}

// ==========================================================
// Add Row
// ==========================================================

function addNewRow(){

    const tbody = document.getElementById("lineItemsBody");

    const row = document.createElement("tr");

    row.innerHTML = `

<td>

<select class="form-select commodity">

<option>Natural Gas</option>

<option>Transportation</option>

<option>Storage</option>

</select>

</td>

<td>

<input
class="form-control description"
placeholder="Description">

</td>

<td>

<input
type="number"
class="form-control qty"
value="1"
min="1">

</td>

<td>

<select class="form-select uom">

<option>MMBTU</option>

<option>EA</option>

</select>

</td>

<td>

<input
type="number"
class="form-control rate"
value="0">

</td>

<td>

<select class="form-select tax">

<option value="0">0%</option>

<option value="5">5%</option>

<option value="10">10%</option>

<option value="18">18%</option>

</select>

</td>

<td>

<input
class="form-control amount"
readonly
value="0.00">

</td>

<td>

<button
class="btn btn-danger btn-sm remove">

<i class="fa fa-trash"></i>

</button>

</td>

`;

    tbody.appendChild(row);

    bindRowEvents(row);

    calculateInvoice();

}

// ==========================================================
// Row Events
// ==========================================================

function bindRowEvents(row){

    row.querySelector(".qty")
    .addEventListener("input", calculateInvoice);

    row.querySelector(".rate")
    .addEventListener("input", calculateInvoice);

    row.querySelector(".tax")
    .addEventListener("change", calculateInvoice);

    row.querySelector(".remove")
    .addEventListener("click", function(){

        row.remove();

        calculateInvoice();

    });

}

// ==========================================================
// Calculate Invoice
// ==========================================================

function calculateInvoice(){

    let subtotal = 0;

    let tax = 0;

    document
    .querySelectorAll("#lineItemsBody tr")
    .forEach(row=>{

        const qty = parseFloat(row.querySelector(".qty").value)||0;

        const rate = parseFloat(row.querySelector(".rate").value)||0;

        const taxRate = parseFloat(row.querySelector(".tax").value)||0;

        const amount = qty * rate;

        const taxAmount = amount * taxRate / 100;

        row.querySelector(".amount").value = amount.toFixed(2);

        subtotal += amount;

        tax += taxAmount;

    });

    invoice.subTotal = subtotal;

    invoice.taxTotal = tax;

    invoice.grandTotal = subtotal + tax;

    updateTotals();

    unsavedChanges = true;

}

// ==========================================================
// Save Draft
// ==========================================================

function saveDraft() {

    const draft = {

        invoiceNo: invoice.invoiceNo,

        customer: document.getElementById("customer").value,

        businessUnit: document.getElementById("businessUnit").value,

        currency: document.getElementById("currency").value,

        invoiceDate: document.getElementById("invoiceDate").value,

        dueDate: document.getElementById("dueDate").value,

        paymentTerms: document.getElementById("paymentTerms").value,

        items: []

    };

    document.querySelectorAll("#lineItemsBody tr").forEach(row => {

        draft.items.push({

            commodity: row.querySelector(".commodity").value,

            description: row.querySelector(".description").value,

            qty: row.querySelector(".qty").value,

            uom: row.querySelector(".uom").value,

            rate: row.querySelector(".rate").value,

            tax: row.querySelector(".tax").value

        });

    });

    localStorage.setItem(
        "invoiceDraft",
        JSON.stringify(draft)
    );

    showToast(
        "Draft Saved Successfully",
        "success"
    );

    unsavedChanges = false;

}

// ==========================================================
// Restore Draft
// ==========================================================

function restoreDraft() {

    const draft =
        JSON.parse(localStorage.getItem("invoiceDraft"));

    if (!draft)
        return;

    document.getElementById("customer").value =
        draft.customer;

    document.getElementById("businessUnit").value =
        draft.businessUnit;

    document.getElementById("currency").value =
        draft.currency;

    document.getElementById("invoiceDate").value =
        draft.invoiceDate;

    document.getElementById("dueDate").value =
        draft.dueDate;

    document.getElementById("paymentTerms").value =
        draft.paymentTerms;

    document.getElementById("lineItemsBody").innerHTML = "";

    draft.items.forEach(item => {

        addNewRow();

        const row =
            document.querySelector(
                "#lineItemsBody tr:last-child"
            );

        row.querySelector(".commodity").value =
            item.commodity;

        row.querySelector(".description").value =
            item.description;

        row.querySelector(".qty").value =
            item.qty;

        row.querySelector(".uom").value =
            item.uom;

        row.querySelector(".rate").value =
            item.rate;

        row.querySelector(".tax").value =
            item.tax;

    });

    calculateInvoice();

}

// ==========================================================
// Validation
// ==========================================================

function validateInvoice() {

    if (
        document.getElementById("customer").selectedIndex == 0
    ) {

        alert("Please select Customer.");

        return false;

    }

    if (
        document.getElementById("businessUnit").selectedIndex == 0
    ) {

        alert("Please select Business Unit.");

        return false;

    }

    if (
        document.getElementById("invoiceDate").value == ""
    ) {

        alert("Please select Invoice Date.");

        return false;

    }

    if (
        document.getElementById("dueDate").value == ""
    ) {

        alert("Please select Due Date.");

        return false;

    }

    if (
        document.querySelectorAll("#lineItemsBody tr").length == 0
    ) {

        alert("Add at least one Line Item.");

        return false;

    }

    return true;

}

// ==========================================================
// Create Invoice
// ==========================================================

function createInvoice() {

    if (!validateInvoice())
        return;

    const invoiceData = {

        invoiceNumber: invoice.invoiceNo,

        customer:
            document.getElementById("customer").value,

        businessUnit:
            document.getElementById("businessUnit").value,

        invoiceDate:
            document.getElementById("invoiceDate").value,

        dueDate:
            document.getElementById("dueDate").value,

        currency:
            document.getElementById("currency").value,

        paymentTerms:
            document.getElementById("paymentTerms").value,

        subtotal: invoice.subTotal,

        tax: invoice.taxTotal,

        total: invoice.grandTotal

    };

    console.log(invoiceData);

    localStorage.removeItem("invoiceDraft");

    showToast(
        "Invoice Created Successfully",
        "success"
    );

    unsavedChanges = false;

    setTimeout(() => {

        window.location.href =
            "invoices.html";

    }, 1500);

}

// ==========================================================
// Button Events
// ==========================================================

document.addEventListener("DOMContentLoaded", () => {

    const saveDraftBtn =
        document.querySelector(".btn-outline-primary");

    if (saveDraftBtn) {

        saveDraftBtn.addEventListener(
            "click",
            saveDraft
        );

    }

    const createBtn =
        document.querySelector(".btn-success");

    if (createBtn) {

        createBtn.addEventListener(
            "click",
            createInvoice
        );

    }

    restoreDraft();

});

// ==========================================================
// Warn Before Leaving
// ==========================================================

window.addEventListener(
    "beforeunload",
    function (e) {

        if (!unsavedChanges)
            return;

        e.preventDefault();

        e.returnValue = "";

    }
);
// ==========================================================
// Toast Notification
// ==========================================================

function showToast(message, type = "success") {

    const toast = document.createElement("div");

    toast.className =
        `alert alert-${type} position-fixed`;

    toast.style.top = "20px";
    toast.style.right = "20px";
    toast.style.zIndex = "9999";
    toast.style.minWidth = "320px";
    toast.style.boxShadow =
        "0 10px 25px rgba(0,0,0,.15)";

    toast.innerHTML = message;

    document.body.appendChild(toast);

    setTimeout(() => {

        toast.remove();

    }, 3000);

}

// ==========================================================
// Reset Form
// ==========================================================

function resetForm() {

    document.getElementById("customer").selectedIndex = 0;

    document.getElementById("businessUnit").selectedIndex = 0;

    document.getElementById("currency").selectedIndex = 0;

    document.getElementById("paymentTerms").selectedIndex = 0;

    document.getElementById("invoiceDate").value = "";

    document.getElementById("dueDate").value = "";

    document.getElementById("lineItemsBody").innerHTML = "";

    invoice.items = [];

    invoice.subTotal = 0;

    invoice.taxTotal = 0;

    invoice.grandTotal = 0;

    updateTotals();

    addNewRow();

    generateInvoiceNumber();

}

// ==========================================================
// Cancel
// ==========================================================

function cancelInvoiceCreation() {

    if (confirm("Discard this invoice?")) {

        localStorage.removeItem("invoiceDraft");

        window.location.href = "invoices.html";

    }

}

// ==========================================================
// Auto Due Date
// ==========================================================

function calculateDueDate() {

    const invoiceDate =
        document.getElementById("invoiceDate").value;

    if (!invoiceDate)
        return;

    const payment =
        document.getElementById("paymentTerms").value;

    let days = 15;

    if (payment.includes("30"))
        days = 30;

    if (payment.includes("45"))
        days = 45;

    const date = new Date(invoiceDate);

    date.setDate(date.getDate() + days);

    document.getElementById("dueDate").value =
        date.toISOString().split("T")[0];

}

// ==========================================================
// Currency Format
// ==========================================================

function formatMoney(value) {

    return "£" +
        Number(value).toLocaleString(

            "en-GB",

            {

                minimumFractionDigits: 2,

                maximumFractionDigits: 2

            }

        );

}

// ==========================================================
// Override Total Update
// ==========================================================

function updateTotals() {

    document.getElementById("subTotal").innerHTML =
        formatMoney(invoice.subTotal);

    document.getElementById("taxTotal").innerHTML =
        formatMoney(invoice.taxTotal);

    document.getElementById("grandTotal").innerHTML =
        formatMoney(invoice.grandTotal);

}

// ==========================================================
// Keyboard Shortcuts
// ==========================================================

document.addEventListener("keydown", function(e){

    if(e.ctrlKey && e.key.toLowerCase()=="s"){

        e.preventDefault();

        saveDraft();

    }

    if(e.ctrlKey && e.key.toLowerCase()=="n"){

        e.preventDefault();

        resetForm();

        showToast("New Invoice Ready");

    }

    if(e.ctrlKey && e.key.toLowerCase()=="p"){

        e.preventDefault();

        window.print();

    }

});

// ==========================================================
// Events
// ==========================================================

document
.getElementById("paymentTerms")
.addEventListener("change", calculateDueDate);

document
.getElementById("invoiceDate")
.addEventListener("change", calculateDueDate);

document
.getElementById("cancelBtn")
?.addEventListener("click", cancelInvoiceCreation);

// ==========================================================
// Page Ready
// ==========================================================

document.addEventListener("DOMContentLoaded", () => {

    showToast("Create Invoice Module Loaded", "primary");

});
