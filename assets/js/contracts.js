// ===========================================================
// ECMS - Contract Management
// contracts.js
// ===========================================================

"use strict";

// ===========================================================
// Global State
// ===========================================================

const ContractApp = {
    contracts: [],
    filteredContracts: [],
    currentPage: 1,
    pageSize: 10,
    hasChanges: false
};

// ===========================================================
// Initialize
// ===========================================================

document.addEventListener("DOMContentLoaded", initialize);

function initialize() {
    console.log("Contract Management Loaded");

    bindEvents();
    loadContracts();
    updateKPICards();
}

// ===========================================================
// Event Binding
// ===========================================================

function bindEvents() {

    // Search Button
    document
        .querySelector(".btn-primary")
        ?.addEventListener("click", searchContracts);

    // Reset Button
    document
        .querySelector(".btn-outline-secondary")
        ?.addEventListener("click", resetFilters);

    // Export
    document
        .getElementById("exportBtn")
        ?.addEventListener("click", exportCSV);

    // Create Contract
    document
        .getElementById("createContractBtn")
        ?.addEventListener("click", function () {
            window.location.href = "create-contract.html";
        });

}

// ===========================================================
// Load Contracts
// ===========================================================

function loadContracts() {
    document
        .querySelectorAll("tbody tr")
        .forEach(row => {
            ContractApp.contracts.push(row);
        });

    ContractApp.filteredContracts = [...ContractApp.contracts];
}

// ===========================================================
// Search
// ===========================================================

function searchContracts() {
    const contractNo = document
        .querySelector("input")
        .value
        .toLowerCase();

    const customer = document
        .querySelectorAll("select")[0]
        .value
        .toLowerCase();

    ContractApp.filteredContracts = [];

    ContractApp.contracts.forEach(row => {
        const rowText = row.innerText.toLowerCase();

        let match = true;

        if (
            contractNo !== "" &&
            !rowText.includes(contractNo)
        ) {
            match = false;
        }

        if (
            customer !== "all customers" &&
            !rowText.includes(customer)
        ) {
            match = false;
        }

        row.style.display = match ? "" : "none";

        if (match)
            ContractApp.filteredContracts.push(row);
    });

    showToast(
        ContractApp.filteredContracts.length + " Contracts Found",
        "primary"
    );
}

// ===========================================================
// Reset Filters
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

    ContractApp.contracts.forEach(row => {
        row.style.display = "";
    });

    ContractApp.filteredContracts = [...ContractApp.contracts];

    showToast("Filters Reset", "success");
}

// ===========================================================
// KPI
// ===========================================================

function updateKPICards() {
    const total = ContractApp.contracts.length;

    console.log("Total Contracts:", total);
}

// ===========================================================
// Bind Table Action Buttons
// ===========================================================

document.addEventListener("DOMContentLoaded", () => {
    bindTableActions();
});

function bindTableActions() {
    document.querySelectorAll("tbody tr").forEach(row => {
        const buttons = row.querySelectorAll("button");

        if (buttons.length < 4) return;

        // View
        buttons[0].addEventListener("click", () => {
            viewContract(row);
        });

        // Edit
        buttons[1].addEventListener("click", () => {
            editContract(row);
        });

        // Duplicate
        buttons[2].addEventListener("click", () => {
            duplicateContract(row);
        });

        // Delete
        buttons[3].addEventListener("click", () => {
            deleteContract(row);
        });
    });
}

// ===========================================================
// View Contract
// ===========================================================

function viewContract(row) {
    const contractNo = row.cells[0].innerText.trim();

    showToast("Opening " + contractNo, "primary");

    setTimeout(() => {
        window.location.href = "contract-details.html";
    }, 600);
}

// ===========================================================
// Edit Contract
// ===========================================================

function editContract(row) {
    const contractNo = row.cells[0].innerText.trim();

    showToast("Editing " + contractNo, "warning");

    setTimeout(() => {
        window.location.href = "create-contract.html";
    }, 600);
}

// ===========================================================
// Duplicate Contract
// ===========================================================

function duplicateContract(row) {
    const clone = row.cloneNode(true);

    const newNumber = "CTR-" + Math.floor(100000 + Math.random() * 900000);

    clone.cells[0].innerHTML = `<a href="contract-details.html"
        class="fw-semibold text-decoration-none">

        ${newNumber}

        </a>`;

    row.parentNode.prepend(clone);

    ContractApp.contracts.unshift(clone);
    ContractApp.filteredContracts.unshift(clone);

    bindTableActions();
    updateKPICards();

    showToast("Contract Duplicated", "success");
}

// ===========================================================
// Delete Contract
// ===========================================================

function deleteContract(row) {
    const contractNo = row.cells[0].innerText.trim();

    if (!confirm("Delete " + contractNo + " ?"))
        return;

    row.remove();

    ContractApp.contracts = ContractApp.contracts.filter(r => r !== row);
    ContractApp.filteredContracts = ContractApp.filteredContracts.filter(r => r !== row);

    updateKPICards();

    showToast("Contract Deleted", "danger");
}

// ===========================================================
// Pagination
// ===========================================================

function renderPagination() {
    const rows = ContractApp.filteredContracts;

    const start = (ContractApp.currentPage - 1) * ContractApp.pageSize;
    const end = start + ContractApp.pageSize;

    ContractApp.contracts.forEach(r => {
        r.style.display = "none";
    });

    rows.slice(start, end).forEach(r => {
        r.style.display = "";
    });
}

// ===========================================================
// Change Page
// ===========================================================

function changePage(page) {
    ContractApp.currentPage = page;

    renderPagination();
}

// ===========================================================
// Update KPI Cards
// ===========================================================

function updateKPICards() {
    const cards = document.querySelectorAll(".kpi-card h2");

    if (cards.length < 4)
        return;

    cards[0].innerHTML = ContractApp.contracts.length;

    const active = document.querySelectorAll(".badge.bg-success").length;
    const pending = document.querySelectorAll(".badge.bg-warning").length;
    const expired = document.querySelectorAll(".badge.bg-danger").length;

    cards[1].innerHTML = active;
    cards[2].innerHTML = pending;
    cards[3].innerHTML = expired;
}

// ===========================================================
// Export Contracts to CSV
// ===========================================================

function exportCSV() {
    let csv = [];

    csv.push(
        "Contract No,Customer,Type,Business Unit,Effective Date,Expiration Date,Status"
    );

    ContractApp.filteredContracts.forEach(row => {
        if (row.style.display === "none")
            return;

        const cols = row.querySelectorAll("td");

        csv.push(
            [
                cols[0].innerText.trim(),
                cols[1].innerText.trim(),
                cols[2].innerText.trim(),
                cols[3].innerText.trim(),
                cols[4].innerText.trim(),
                cols[5].innerText.trim(),
                cols[6].innerText.trim()
            ].join(",")
        );
    });

    const blob = new Blob([csv.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "contracts.csv";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    showToast("Contracts exported successfully.", "success");
}

// ===========================================================
// Live Search
// ===========================================================

const searchInput = document.querySelector("input");

if (searchInput) {
    searchInput.addEventListener("keyup", searchContracts);
}

// ===========================================================
// Keyboard Shortcuts
// ===========================================================

document.addEventListener("keydown", function (e) {

    // Ctrl + E Export
    if (e.ctrlKey && e.key.toLowerCase() === "e") {
        e.preventDefault();
        exportCSV();
    }

    // Ctrl + F Focus Search
    if (e.ctrlKey && e.key.toLowerCase() === "f") {
        e.preventDefault();
        searchInput?.focus();
    }

    // Ctrl + N Create Contract
    if (e.ctrlKey && e.key.toLowerCase() === "n") {
        e.preventDefault();
        window.location.href = "create-contract.html";
    }

    // Ctrl + P Print
    if (e.ctrlKey && e.key.toLowerCase() === "p") {
        e.preventDefault();
        window.print();
    }

});

// ===========================================================
// Toast Notification
// ===========================================================

function showToast(message, type = "primary") {
    const toast = document.createElement("div");

    toast.className = `alert alert-${type} position-fixed`;

    toast.style.top = "20px";
    toast.style.right = "20px";
    toast.style.minWidth = "300px";
    toast.style.zIndex = "99999";
    toast.style.boxShadow = "0 10px 25px rgba(0,0,0,.15)";

    toast.innerHTML = message;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// ===========================================================
// Loading Screen
// ===========================================================

function showLoading() {
    const loader = document.createElement("div");

    loader.id = "loader";
    loader.className =
        "position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-white";
    loader.style.zIndex = "999999";

    loader.innerHTML = `
        <div class="spinner-border text-primary"></div>
    `;

    document.body.appendChild(loader);
}

function hideLoading() {
    document
        .getElementById("loader")
        ?.remove();
}

// ===========================================================
// Simulate Initial Loading
// ===========================================================

showLoading();

window.addEventListener("load", () => {
    setTimeout(() => {
        hideLoading();
    }, 500);
});

// ===========================================================
// Page Ready
// ===========================================================

renderPagination();

console.log("Contract Management Ready");
