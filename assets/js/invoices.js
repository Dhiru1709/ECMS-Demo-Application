// =====================================================
// ECMS - Invoice Management
// invoices.js
// =====================================================

document.addEventListener("DOMContentLoaded", () => {

    initializeEvents();
    updateInvoiceCount();

});

// =====================================================
// Initialize Events
// =====================================================

function initializeEvents() {

    const searchInput = document.querySelector("input[type='text']");
    const statusFilter = document.querySelectorAll(".form-select")[0];
    const businessFilter = document.querySelectorAll(".form-select")[1];

    searchInput?.addEventListener("keyup", filterInvoices);
    statusFilter?.addEventListener("change", filterInvoices);
    businessFilter?.addEventListener("change", filterInvoices);

    document.querySelector(".btn-primary")
        ?.addEventListener("click", createInvoice);

    document.querySelector(".btn-outline-primary")
        ?.addEventListener("click", exportCSV);

    bindActionButtons();

}

// =====================================================
// Search & Filters
// =====================================================

function filterInvoices() {

    const keyword = document
        .querySelector("input[type='text']")
        .value
        .toLowerCase();

    const status = document
        .querySelectorAll(".form-select")[0]
        .value
        .toLowerCase();

    const business = document
        .querySelectorAll(".form-select")[1]
        .value
        .toLowerCase();

    const rows = document.querySelectorAll("tbody tr");

    rows.forEach(row => {

        const text = row.innerText.toLowerCase();

        const statusMatch =
            status === "status" || text.includes(status);

        const businessMatch =
            business === "business unit" || text.includes(business);

        const keywordMatch =
            text.includes(keyword);

        row.style.display =
            statusMatch &&
            businessMatch &&
            keywordMatch
                ? ""
                : "none";

    });

    updateInvoiceCount();

}

// =====================================================
// View / Edit / Delete
// =====================================================

function bindActionButtons() {

    document.querySelectorAll(".view-btn").forEach(btn => {

        btn.addEventListener("click", () => {

            window.location.href =
                "invoice-details.html?id=INV-100245";

        });

    });

    document.querySelectorAll(".edit-btn").forEach(btn => {

        btn.addEventListener("click", () => {

            window.location.href =
                "create-invoice.html?mode=edit&id=INV-100245";

        });

    });

    document.querySelectorAll(".delete-btn").forEach(btn => {

        btn.addEventListener("click", function () {

            if (!confirm("Delete this invoice?"))
                return;

            this.closest("tr").remove();

            updateInvoiceCount();

            showToast(
                "Invoice deleted successfully",
                "success"
            );

        });

    });

}

// =====================================================
// Create Invoice
// =====================================================

function createInvoice() {

    window.location.href =
        "create-invoice.html";

}

// =====================================================
// Export CSV
// =====================================================

function exportCSV() {

    const rows = document.querySelectorAll("table tr");

    let csv = [];

    rows.forEach(row => {

        const cols = row.querySelectorAll("th,td");

        let data = [];

        cols.forEach(col => {

            data.push(
                `"${col.innerText.trim()}"`
            );

        });

        csv.push(data.join(","));

    });

    const csvFile = new Blob(
        [csv.join("\n")],
        { type: "text/csv" }
    );

    const downloadLink =
        document.createElement("a");

    downloadLink.download = "Invoices.csv";

    downloadLink.href =
        window.URL.createObjectURL(csvFile);

    downloadLink.click();

    showToast(
        "Invoice list exported",
        "primary"
    );

}

// =====================================================
// Invoice Counter
// =====================================================

function updateInvoiceCount() {

    const visibleRows =
        [...document.querySelectorAll("tbody tr")]
        .filter(r => r.style.display !== "none");

    console.log(
        "Visible Invoices :",
        visibleRows.length
    );

}

// =====================================================
// Toast Notification
// =====================================================

function showToast(message, type = "primary") {

    const toast = document.createElement("div");

    toast.className =
        `alert alert-${type} position-fixed`;

    toast.style.top = "20px";
    toast.style.right = "20px";
    toast.style.zIndex = "99999";
    toast.style.minWidth = "280px";
    toast.style.boxShadow =
        "0 10px 25px rgba(0,0,0,.15)";

    toast.innerHTML = message;

    document.body.appendChild(toast);

    setTimeout(() => {

        toast.remove();

    }, 3000);

}

// =====================================================
// Highlight Selected Row
// =====================================================

document.querySelectorAll("tbody tr")
.forEach(row => {

    row.addEventListener("click", () => {

        document
            .querySelectorAll("tbody tr")
            .forEach(r => r.classList.remove("table-active"));

        row.classList.add("table-active");

    });

});

// =====================================================
// Keyboard Shortcut
// Ctrl + N = New Invoice
// =====================================================

document.addEventListener("keydown", e => {

    if (e.ctrlKey && e.key.toLowerCase() === "n") {

        e.preventDefault();

        createInvoice();

    }

});

// =====================================================
// Double Click = Open Invoice
// =====================================================

document.querySelectorAll("tbody tr")
.forEach(row => {

    row.addEventListener("dblclick", () => {

        window.location.href =
            "invoice-details.html?id=INV-100245";

    });

});

// =====================================================
// Page Loaded
// =====================================================

console.log("ECMS Invoice Module Loaded Successfully");
