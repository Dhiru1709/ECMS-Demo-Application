// ===========================================================
// ECMS - Price Agreements
// price-agreements.js
// ===========================================================

"use strict";

// ===========================================================
// Global State
// ===========================================================

const PriceAgreementApp = {
    agreements: [],
    filteredAgreements: [],
    currentPage: 1,
    pageSize: 10,
    hasChanges: false
};

// ===========================================================
// Initialize
// ===========================================================

document.addEventListener("DOMContentLoaded", initialize);

function initialize() {
    console.log("Price Agreements Loaded");

    bindEvents();
    loadAgreements();
    updateKPICards();
}

// ===========================================================
// Event Binding
// ===========================================================

function bindEvents() {

    document
        .getElementById("searchBtn")
        ?.addEventListener("click", searchAgreements);

    document
        .getElementById("resetBtn")
        ?.addEventListener("click", resetFilters);

    document
        .getElementById("exportBtn")
        ?.addEventListener("click", exportCSV);

    document
        .getElementById("exportFooterBtn")
        ?.addEventListener("click", exportCSV);

    document
        .getElementById("createAgreementBtn")
        ?.addEventListener("click", createAgreement);

    document
        .getElementById("createAgreementFooterBtn")
        ?.addEventListener("click", createAgreement);

}

// ===========================================================
// Load Agreements
// ===========================================================

function loadAgreements() {
    document
        .querySelectorAll("tbody tr")
        .forEach(row => {
            PriceAgreementApp.agreements.push(row);
        });

    PriceAgreementApp.filteredAgreements = [...PriceAgreementApp.agreements];
}

// ===========================================================
// Search Agreements
// ===========================================================

function searchAgreements() {
    const agreementNo = document
        .getElementById("agreementNumber")
        .value
        .toLowerCase();

    const customer = document
        .getElementById("customer")
        .value
        .toLowerCase();

    PriceAgreementApp.filteredAgreements = [];

    PriceAgreementApp.agreements.forEach(row => {
        const text = row.innerText.toLowerCase();

        let visible = true;

        if (
            agreementNo !== "" &&
            !text.includes(agreementNo)
        ) {
            visible = false;
        }

        if (
            customer !== "all customers" &&
            !text.includes(customer)
        ) {
            visible = false;
        }

        row.style.display = visible ? "" : "none";

        if (visible) {
            PriceAgreementApp.filteredAgreements.push(row);
        }
    });

    updateKPICards();

    showToast(
        PriceAgreementApp.filteredAgreements.length + " Agreements Found",
        "primary"
    );
}

// ===========================================================
// Reset
// ===========================================================

function resetFilters() {
    document
        .querySelectorAll("input")
        .forEach(input => {
            input.value = "";
        });

    document
        .querySelectorAll("select")
        .forEach(select => {
            select.selectedIndex = 0;
        });

    PriceAgreementApp.agreements.forEach(row => {
        row.style.display = "";
    });

    PriceAgreementApp.filteredAgreements = [...PriceAgreementApp.agreements];

    updateKPICards();

    showToast("Filters Reset", "success");
}

// ===========================================================
// Create Agreement
// ===========================================================

function createAgreement() {
    window.location.href = "create-price-agreement.html";
}

// ===========================================================
// KPI
// ===========================================================

function updateKPICards() {
    const cards = document.querySelectorAll(".kpi-card h2");

    if (cards.length < 4) return;

    cards[0].innerHTML = PriceAgreementApp.agreements.length;

    cards[1].innerHTML = document.querySelectorAll(".badge.bg-success").length;
    cards[2].innerHTML = document.querySelectorAll(".badge.bg-warning").length;
    cards[3].innerHTML = document.querySelectorAll(".badge.bg-danger").length;
}

// ===========================================================
// Bind Table Actions
// ===========================================================

document.addEventListener("DOMContentLoaded", () => {
    bindTableActions();
    bindBulkActions();
});

function bindTableActions() {
    document.querySelectorAll("tbody tr").forEach(row => {
        const buttons = row.querySelectorAll("button");

        if (buttons.length < 4) return;

        // View
        buttons[0].addEventListener("click", () => {
            viewAgreement(row);
        });

        // Edit
        buttons[1].addEventListener("click", () => {
            editAgreement(row);
        });

        // Duplicate
        buttons[2].addEventListener("click", () => {
            duplicateAgreement(row);
        });

        // Delete
        buttons[3].addEventListener("click", () => {
            deleteAgreement(row);
        });
    });
}

// ===========================================================
// View Agreement
// ===========================================================

function viewAgreement(row) {
    const agreement = row.cells[0].innerText.trim();

    showToast("Opening " + agreement, "primary");

    setTimeout(() => {
        window.location.href = "price-agreement-details.html";
    }, 600);
}

// ===========================================================
// Edit Agreement
// ===========================================================

function editAgreement(row) {
    const agreement = row.cells[0].innerText.trim();

    showToast("Editing " + agreement, "warning");

    setTimeout(() => {
        window.location.href = "create-price-agreement.html";
    }, 600);
}

// ===========================================================
// Duplicate Agreement
// ===========================================================

function duplicateAgreement(row) {
    const clone = row.cloneNode(true);

    const newNo = "AGR-" + Math.floor(100000 + Math.random() * 900000);

    clone.cells[0].innerHTML =
`<a href="price-agreement-details.html"
class="fw-semibold text-decoration-none">

${newNo}

</a>`;

    row.parentNode.prepend(clone);

    PriceAgreementApp.agreements.unshift(clone);
    PriceAgreementApp.filteredAgreements.unshift(clone);

    bindTableActions();
    updateKPICards();

    showToast("Agreement Duplicated", "success");
}

// ===========================================================
// Delete Agreement
// ===========================================================

function deleteAgreement(row) {
    const agreement = row.cells[0].innerText.trim();

    if (!confirm("Delete " + agreement + " ?"))
        return;

    row.remove();

    PriceAgreementApp.agreements =
        PriceAgreementApp.agreements.filter(r => r !== row);

    PriceAgreementApp.filteredAgreements =
        PriceAgreementApp.filteredAgreements.filter(r => r !== row);

    updateKPICards();

    showToast("Agreement Deleted", "danger");
}

// ===========================================================
// Pagination
// ===========================================================

function renderPagination() {
    const rows = PriceAgreementApp.filteredAgreements;

    const start = (PriceAgreementApp.currentPage - 1) * PriceAgreementApp.pageSize;
    const end = start + PriceAgreementApp.pageSize;

    PriceAgreementApp.agreements.forEach(row => {
        row.style.display = "none";
    });

    rows.slice(start, end).forEach(row => {
        row.style.display = "";
    });
}

function changePage(page) {
    PriceAgreementApp.currentPage = page;

    renderPagination();
}

// ===========================================================
// Bulk Actions
// ===========================================================

function bindBulkActions() {

    document
        .getElementById("bulkExportBtn")
        ?.addEventListener("click", exportCSV);

    document
        .getElementById("bulkActivateBtn")
        ?.addEventListener("click", () => {
            showToast("Selected Agreements Activated", "success");
        });

    document
        .getElementById("bulkRenewBtn")
        ?.addEventListener("click", () => {
            showToast("Renewal Process Started", "warning");
        });

    document
        .getElementById("bulkDeleteBtn")
        ?.addEventListener("click", () => {
            if (confirm("Delete Selected Agreements?")) {
                showToast("Selected Agreements Deleted", "danger");
            }
        });

}

// ===========================================================
// Refresh
// ===========================================================

document
    .getElementById("refreshBtn")
    ?.addEventListener("click", () => {
        location.reload();
    });

// ===========================================================
// Export CSV
// ===========================================================

function exportCSV() {
    let csv = "Agreement,Customer,Type,Commodity,Price Type,Effective,Expiry,Status\n";

    PriceAgreementApp.filteredAgreements.forEach(row => {
        if (row.style.display === "none") return;

        const cols = row.querySelectorAll("td");

        csv +=
            `"${cols[0].innerText.trim()}","${cols[1].innerText.trim()}","${cols[2].innerText.trim()}","${cols[3].innerText.trim()}","${cols[4].innerText.trim()}","${cols[5].innerText.trim()}","${cols[6].innerText.trim()}","${cols[7].innerText.trim()}"\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = "Price_Agreements.csv";

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);

    showToast("CSV Exported Successfully", "success");
}

// ===========================================================
// Toast Notification
// ===========================================================

function showToast(message, type = "success") {
    const toast = document.createElement("div");

    toast.className = `alert alert-${type} position-fixed`;

    toast.style.top = "20px";
    toast.style.right = "20px";
    toast.style.minWidth = "320px";
    toast.style.zIndex = "99999";
    toast.style.boxShadow = "0 10px 25px rgba(0,0,0,.15)";

    toast.innerHTML = message;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// ===========================================================
// Keyboard Shortcuts
// ===========================================================

document.addEventListener("keydown", function (e) {

    // Ctrl + F
    if (e.ctrlKey && e.key.toLowerCase() === "f") {
        e.preventDefault();

        document
            .getElementById("agreementNumber")
            ?.focus();
    }

    // Ctrl + E
    if (e.ctrlKey && e.key.toLowerCase() === "e") {
        e.preventDefault();
        exportCSV();
    }

    // Ctrl + N
    if (e.ctrlKey && e.key.toLowerCase() === "n") {
        e.preventDefault();
        createAgreement();
    }

});

// ===========================================================
// Loading Screen
// ===========================================================

function showLoader() {
    const loader = document.createElement("div");

    loader.id = "pageLoader";
    loader.className = "position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-white";
    loader.style.zIndex = "999999";

    loader.innerHTML = `
        <div class="spinner-border text-primary"></div>
    `;

    document.body.appendChild(loader);
}

function hideLoader() {
    document
        .getElementById("pageLoader")
        ?.remove();
}

showLoader();

window.addEventListener("load", () => {
    setTimeout(() => {
        hideLoader();
    }, 500);
});

// ===========================================================
// Live Search
// ===========================================================

document
    .getElementById("agreementNumber")
    ?.addEventListener("keyup", searchAgreements);

document
    .getElementById("customer")
    ?.addEventListener("change", searchAgreements);

// ===========================================================
// Page Ready
// ===========================================================

renderPagination();

console.log("Price Agreements Ready");

showToast("Workspace Ready", "success");
