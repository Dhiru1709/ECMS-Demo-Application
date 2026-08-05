// =======================================================
// ECMS - Create Invoice
// Version : 1.0
// =======================================================

"use strict";

// =======================================================
// Global State
// =======================================================

const InvoiceApp = {
    invoiceNo: "",
    items: [],
    subtotal: 0,
    tax: 0,
    total: 0,
    draftKey: "ecms_invoice_draft",
    hasChanges: false
};

// =======================================================
// Initialize
// =======================================================

document.addEventListener("DOMContentLoaded", initialize);

function initialize() {
    console.log("ECMS Create Invoice Loaded");

    generateInvoiceNumber();
    bindEvents();
    restoreDraft();
    initializeLineItems();
}

// =======================================================
// Generate Invoice Number
// =======================================================

function generateInvoiceNumber() {
    const year = new Date().getFullYear();
    const random = Math.floor(100000 + Math.random() * 900000);

    InvoiceApp.invoiceNo = `INV-${year}-${random}`;

    const invoiceNumberField = document.querySelector("input[placeholder='Auto Generated']");

    if (invoiceNumberField) {
        invoiceNumberField.value = InvoiceApp.invoiceNo;
    }
}

// =======================================================
// Bind Events
// =======================================================

function bindEvents() {

    //--------------------------------------------------

    document
        .getElementById("createInvoiceBtn")
        ?.addEventListener("click", createInvoice);

    document
        .getElementById("createInvoiceBtn2")
        ?.addEventListener("click", createInvoice);

    document
        .getElementById("createInvoiceFooter")
        ?.addEventListener("click", createInvoice);

    //--------------------------------------------------

    document
        .getElementById("saveDraftBtn")
        ?.addEventListener("click", saveDraft);

    document
        .getElementById("saveDraftBtn2")
        ?.addEventListener("click", saveDraft);

    document
        .getElementById("saveDraftFooter")
        ?.addEventListener("click", saveDraft);

    //--------------------------------------------------

    document
        .getElementById("cancelBtn")
        ?.addEventListener("click", cancelInvoice);

    document
        .getElementById("cancelBtnFooter")
        ?.addEventListener("click", cancelInvoice);

    //--------------------------------------------------

    document
        .getElementById("resetInvoiceBtn")
        ?.addEventListener("click", resetForm);

    //--------------------------------------------------

    document
        .getElementById("addItemBtn")
        ?.addEventListener("click", addLineItem);

    //--------------------------------------------------

    document
        .getElementById("invoiceDate")
        ?.addEventListener("change", updateDueDate);

    document
        .getElementById("paymentTerms")
        ?.addEventListener("change", updateDueDate);

}

// =======================================================
// Initialize Table
// =======================================================

function initializeLineItems() {
    const tbody = document.getElementById("lineItemsBody");

    if (!tbody)
        return;

    if (tbody.children.length === 0) {
        addLineItem();
    }
}

// =======================================================
// Add Line Item
// =======================================================

function addLineItem() {
    const tbody = document.getElementById("lineItemsBody");
    const row = document.createElement("tr");

    row.innerHTML = `
        <td>
            <select class="form-select commodity">
                <option>Natural Gas</option>
                <option>Transportation</option>
                <option>Storage</option>
                <option>Recurring Fee</option>
            </select>
        </td>

        <td>
            <input type="text" class="form-control description" placeholder="Description">
        </td>

        <td>
            <input type="number" class="form-control qty" value="1" min="1">
        </td>

        <td>
            <select class="form-select uom">
                <option>MMBTU</option>
                <option>EA</option>
                <option>DTH</option>
            </select>
        </td>

        <td>
            <input type="number" class="form-control rate" value="0" min="0">
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
            <input class="form-control amount" readonly value="£0.00">
        </td>

        <td>
            <button type="button" class="btn btn-sm btn-outline-danger removeRow">
                <i class="fa-solid fa-trash"></i>
            </button>
        </td>
    `;

    tbody.appendChild(row);

    bindRowEvents(row);
    calculateTotals();
}

// =======================================================
// Bind Row Events
// =======================================================

function bindRowEvents(row) {
    row.querySelector(".qty")
        .addEventListener("input", calculateTotals);

    row.querySelector(".rate")
        .addEventListener("input", calculateTotals);

    row.querySelector(".tax")
        .addEventListener("change", calculateTotals);

    row.querySelector(".removeRow")
        .addEventListener("click", function () {
            row.remove();
            calculateTotals();
            InvoiceApp.hasChanges = true;
            showToast("Line Item Removed", "warning");
        });
}

// =======================================================
// Currency Formatter
// =======================================================

function formatCurrency(value) {
    return "£" + Number(value).toLocaleString("en-GB", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

// =======================================================
// Calculate Invoice
// =======================================================

function calculateTotals() {
    let subtotal = 0;
    let totalTax = 0;

    const rows = document.querySelectorAll("#lineItemsBody tr");

    rows.forEach(row => {
        const qty = parseFloat(row.querySelector(".qty").value) || 0;
        const rate = parseFloat(row.querySelector(".rate").value) || 0;
        const taxRate = parseFloat(row.querySelector(".tax").value) || 0;

        const amount = qty * rate;
        const tax = (amount * taxRate) / 100;

        subtotal += amount;
        totalTax += tax;

        row.querySelector(".amount").value = formatCurrency(amount);
    });

    InvoiceApp.subtotal = subtotal;
    InvoiceApp.tax = totalTax;
    InvoiceApp.total = subtotal + totalTax;

    updateSummary();

    InvoiceApp.hasChanges = true;
}

// =======================================================
// Update Invoice Summary
// =======================================================

function updateSummary() {
    const subTotal = document.getElementById("subTotal");
    const taxTotal = document.getElementById("taxTotal");
    const grandTotal = document.getElementById("grandTotal");

    if (subTotal) {
        subTotal.innerHTML = formatCurrency(InvoiceApp.subtotal);
    }

    if (taxTotal) {
        taxTotal.innerHTML = formatCurrency(InvoiceApp.tax);
    }

    if (grandTotal) {
        grandTotal.innerHTML = formatCurrency(InvoiceApp.total);
    }

    updateTaxTab();
}

// =======================================================
// Update Tax Tab
// =======================================================

function updateTaxTab() {
    const sub = document.getElementById("taxSubTotal");
    const tax = document.getElementById("taxAmount");
    const grand = document.getElementById("taxGrandTotal");

    if (sub) {
        sub.innerHTML = formatCurrency(InvoiceApp.subtotal);
    }

    if (tax) {
        tax.innerHTML = formatCurrency(InvoiceApp.tax);
    }

    if (grand) {
        grand.innerHTML = formatCurrency(InvoiceApp.total);
    }
}

// =======================================================
// Due Date Calculation
// =======================================================

function updateDueDate() {
    const invoiceDate = document.getElementById("invoiceDate");
    const paymentTerms = document.getElementById("paymentTerms");
    const dueDate = document.getElementById("dueDate");

    if (
        !invoiceDate.value ||
        !paymentTerms.value
    )
        return;

    let days = 15;

    switch (paymentTerms.value) {
        case "Net 15":
            days = 15;
            break;
        case "Net 30":
            days = 30;
            break;
        case "Net 45":
            days = 45;
            break;
    }

    const date = new Date(invoiceDate.value);

    date.setDate(date.getDate() + days);

    dueDate.value = date.toISOString().split("T")[0];
}

// =======================================================
// Store Items
// =======================================================

function buildInvoiceItems() {
    InvoiceApp.items = [];

    document.querySelectorAll("#lineItemsBody tr").forEach(row => {
        InvoiceApp.items.push({
            commodity: row.querySelector(".commodity").value,
            description: row.querySelector(".description").value,
            quantity: Number(row.querySelector(".qty").value),
            uom: row.querySelector(".uom").value,
            rate: Number(row.querySelector(".rate").value),
            tax: Number(row.querySelector(".tax").value),
            amount: Number(
                row.querySelector(".amount")
                    .value
                    .replace("£", "")
                    .replace(/,/g, "")
            )
        });
    });
}

// =======================================================
// Invoice Statistics
// =======================================================

function updateStatistics() {
    buildInvoiceItems();

    console.table(InvoiceApp.items);

    console.log("Items :", InvoiceApp.items.length);
    console.log("Subtotal :", InvoiceApp.subtotal);
    console.log("Tax :", InvoiceApp.tax);
    console.log("Grand Total :", InvoiceApp.total);
}

// =======================================================
// Recalculate whenever data changes
// =======================================================

document.addEventListener("input", function (e) {
    if (
        e.target.classList.contains("qty") ||
        e.target.classList.contains("rate") ||
        e.target.classList.contains("description")
    ) {
        calculateTotals();
    }
});

document.addEventListener("change", function (e) {
    if (
        e.target.classList.contains("tax") ||
        e.target.classList.contains("commodity") ||
        e.target.classList.contains("uom")
    ) {
        calculateTotals();
    }
});

// =======================================================
// Validate Invoice
// =======================================================

function validateInvoice() {
    const customer = document.getElementById("customer");
    const business = document.getElementById("businessUnit");
    const invoiceDate = document.getElementById("invoiceDate");
    const dueDate = document.getElementById("dueDate");

    if (customer.selectedIndex === 0) {
        showToast("Please select Customer.", "danger");
        customer.focus();
        return false;
    }

    if (business.selectedIndex === 0) {
        showToast("Please select Business Unit.", "danger");
        business.focus();
        return false;
    }

    if (invoiceDate.value === "") {
        showToast("Invoice Date is required.", "danger");
        invoiceDate.focus();
        return false;
    }

    if (dueDate.value === "") {
        showToast("Due Date is required.", "danger");
        dueDate.focus();
        return false;
    }

    if (document.querySelectorAll("#lineItemsBody tr").length === 0) {
        showToast("Add at least one Line Item.", "danger");
        return false;
    }

    return true;
}

// =======================================================
// Save Draft
// =======================================================

function saveDraft() {
    buildInvoiceItems();

    const draft = {
        invoiceNo: InvoiceApp.invoiceNo,
        customer: document.getElementById("customer").value,
        businessUnit: document.getElementById("businessUnit").value,
        currency: document.getElementById("currency").value,
        invoiceDate: document.getElementById("invoiceDate").value,
        dueDate: document.getElementById("dueDate").value,
        paymentTerms: document.getElementById("paymentTerms").value,
        items: InvoiceApp.items,
        subtotal: InvoiceApp.subtotal,
        tax: InvoiceApp.tax,
        total: InvoiceApp.total
    };

    localStorage.setItem(InvoiceApp.draftKey, JSON.stringify(draft));

    InvoiceApp.hasChanges = false;

    showToast("Draft saved successfully.", "success");
}

// =======================================================
// Restore Draft
// =======================================================

function restoreDraft() {
    const draft = localStorage.getItem(InvoiceApp.draftKey);

    if (!draft) return;

    const data = JSON.parse(draft);

    document.getElementById("customer").value = data.customer;
    document.getElementById("businessUnit").value = data.businessUnit;
    document.getElementById("currency").value = data.currency;
    document.getElementById("invoiceDate").value = data.invoiceDate;
    document.getElementById("dueDate").value = data.dueDate;
    document.getElementById("paymentTerms").value = data.paymentTerms;

    const tbody = document.getElementById("lineItemsBody");

    tbody.innerHTML = "";

    data.items.forEach(item => {
        addLineItem();

        const row = tbody.lastElementChild;

        row.querySelector(".commodity").value = item.commodity;
        row.querySelector(".description").value = item.description;
        row.querySelector(".qty").value = item.quantity;
        row.querySelector(".uom").value = item.uom;
        row.querySelector(".rate").value = item.rate;
        row.querySelector(".tax").value = item.tax;
    });

    calculateTotals();

    showToast("Draft restored.", "primary");
}

// =======================================================
// Create Invoice
// =======================================================

function createInvoice() {
    if (!validateInvoice()) return;

    buildInvoiceItems();

    const invoiceData = {
        invoiceNumber: InvoiceApp.invoiceNo,
        customer: document.getElementById("customer").value,
        businessUnit: document.getElementById("businessUnit").value,
        invoiceDate: document.getElementById("invoiceDate").value,
        dueDate: document.getElementById("dueDate").value,
        paymentTerms: document.getElementById("paymentTerms").value,
        subtotal: InvoiceApp.subtotal,
        tax: InvoiceApp.tax,
        total: InvoiceApp.total,
        items: InvoiceApp.items
    };

    console.log(invoiceData);

    localStorage.removeItem(InvoiceApp.draftKey);

    InvoiceApp.hasChanges = false;

    showToast("Invoice created successfully.", "success");

    setTimeout(() => {
        window.location.href = "invoices.html";
    }, 1500);
}

// =======================================================
// Cancel
// =======================================================

function cancelInvoice() {
    if (confirm("Discard current invoice?")) {
        window.location.href = "invoices.html";
    }
}

// =======================================================
// Reset
// =======================================================

function resetForm() {
    if (!confirm("Reset all fields?"))
        return;

    localStorage.removeItem(InvoiceApp.draftKey);

    document.querySelectorAll("input").forEach(input => {
        if (!input.readOnly) {
            input.value = "";
        }
    });

    document.querySelectorAll("textarea")
        .forEach(t => t.value = "");

    document.querySelectorAll("select")
        .forEach(s => s.selectedIndex = 0);

    document.getElementById("lineItemsBody").innerHTML = "";

    InvoiceApp.items = [];
    InvoiceApp.subtotal = 0;
    InvoiceApp.tax = 0;
    InvoiceApp.total = 0;

    updateSummary();
    generateInvoiceNumber();
    addLineItem();

    showToast("Form reset.", "warning");
}

// =======================================================
// Toast
// =======================================================

function showToast(message, type = "success") {
    const toast = document.createElement("div");

    toast.className = `alert alert-${type} position-fixed`;

    toast.style.top = "20px";
    toast.style.right = "20px";
    toast.style.zIndex = "9999";
    toast.style.minWidth = "320px";
    toast.style.boxShadow = "0 10px 25px rgba(0,0,0,.15)";

    toast.innerHTML = message;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// =======================================================
// Keyboard Shortcuts
// =======================================================

document.addEventListener("keydown", function (e) {
    if (e.ctrlKey && e.key.toLowerCase() === "s") {
        e.preventDefault();
        saveDraft();
    }

    if (e.ctrlKey && e.key.toLowerCase() === "p") {
        e.preventDefault();
        window.print();
    }

    if (e.ctrlKey && e.key.toLowerCase() === "n") {
        e.preventDefault();
        resetForm();
    }
});

// =======================================================
// Warn Before Leaving
// =======================================================

window.addEventListener("beforeunload", function (e) {
    if (InvoiceApp.hasChanges) {
        e.preventDefault();
        e.returnValue = "";
    }
});

// =======================================================
// Ready
// =======================================================

console.log("Create Invoice Module Ready");
