// ===========================================================
// ECMS - Contract Details
// contract-details.js
// ===========================================================

"use strict";

// ===========================================================
// Global State
// ===========================================================

const ContractDetailsApp = {
    contractNumber: "CTR-100245",
    status: "Active",
    currentTab: "general",
    hasChanges: false
};

// ===========================================================
// Initialize
// ===========================================================

document.addEventListener("DOMContentLoaded", initialize);

function initialize() {
    console.log("Contract Details Loaded");

    bindEvents();
    restoreActiveTab();

    showToast("Contract Loaded", "primary");
}

// ===========================================================
// Event Binding
// ===========================================================

function bindEvents() {

    // Export
    document
        .getElementById("exportBtn")
        ?.addEventListener("click", exportContract);

    // Print
    document
        .getElementById("printBtn")
        ?.addEventListener("click", printContract);

    // Edit
    document
        .getElementById("editContractBtn")
        ?.addEventListener("click", editContract);

    // Upload Document
    document
        .getElementById("uploadDocumentBtn")
        ?.addEventListener("click", uploadDocument);

    // Bootstrap Tabs
    document
        .querySelectorAll('.nav-link[data-bs-toggle="tab"]')
        .forEach(tab => {
            tab.addEventListener("shown.bs.tab", function () {
                const target = this.getAttribute("data-bs-target");

                ContractDetailsApp.currentTab = target.replace("#", "");

                localStorage.setItem(
                    "contract_active_tab",
                    ContractDetailsApp.currentTab
                );
            });
        });

}

// ===========================================================
// Restore Last Open Tab
// ===========================================================

function restoreActiveTab() {
    const saved = localStorage.getItem("contract_active_tab");

    if (!saved) return;

    const button = document.querySelector(`[data-bs-target="#${saved}"]`);

    if (button) {
        new bootstrap.Tab(button).show();
    }
}

// ===========================================================
// Export
// ===========================================================

function exportContract() {
    showToast("Preparing Contract Export...", "primary");

    setTimeout(() => {
        showToast("Contract exported successfully.", "success");
    }, 1000);
}

// ===========================================================
// Print
// ===========================================================

function printContract() {
    window.print();
}

// ===========================================================
// Edit
// ===========================================================

function editContract() {
    showToast("Opening Edit Contract...", "warning");

    setTimeout(() => {
        window.location.href = "create-contract.html";
    }, 700);
}

// ===========================================================
// Upload Document
// ===========================================================

function uploadDocument() {
    showToast("Upload dialog will open here.", "info");
}

// ===========================================================
// Document Actions
// ===========================================================

function bindDocumentActions() {
    const tables = document.querySelectorAll("table");

    tables.forEach(table => {
        const rows = table.querySelectorAll("tbody tr");

        rows.forEach(row => {
            const buttons = row.querySelectorAll("button");

            if (buttons.length === 3) {

                // Download
                buttons[0].addEventListener("click", () => {
                    const file = row.cells[0].innerText;
                    downloadDocument(file);
                });

                // Preview
                buttons[1].addEventListener("click", () => {
                    const file = row.cells[0].innerText;
                    previewDocument(file);
                });

                // Delete
                buttons[2].addEventListener("click", () => {
                    deleteDocument(row);
                });

            }
        });
    });
}

// ===========================================================
// Download
// ===========================================================

function downloadDocument(file) {
    showToast(file + " downloaded.", "success");
}

// ===========================================================
// Preview
// ===========================================================

function previewDocument(file) {
    showToast("Opening " + file, "primary");
}

// ===========================================================
// Delete
// ===========================================================

function deleteDocument(row) {
    const file = row.cells[0].innerText;

    if (!confirm("Delete " + file + " ?"))
        return;

    row.remove();

    showToast("Document Deleted", "danger");
}

// ===========================================================
// Quick Action Buttons
// ===========================================================

function bindQuickActions() {
    document
        .querySelectorAll(".d-grid .btn")
        .forEach(btn => {
            const text = btn.innerText.trim();

            btn.addEventListener("click", () => {
                switch (text) {
                    case "Edit Contract":
                        editContract();
                        break;

                    case "Duplicate Contract":
                        duplicateContract();
                        break;

                    case "Generate Invoice":
                        generateInvoice();
                        break;

                    case "Print":
                        printContract();
                        break;

                    case "Terminate Contract":
                        terminateContract();
                        break;
                }
            });
        });
}

// ===========================================================
// Duplicate Contract
// ===========================================================

function duplicateContract() {
    showToast("Creating Copy...", "info");

    setTimeout(() => {
        window.location.href = "create-contract.html";
    }, 700);
}

// ===========================================================
// Generate Invoice
// ===========================================================

function generateInvoice() {
    showToast("Opening Create Invoice...", "primary");

    setTimeout(() => {
        window.location.href = "create-invoice.html";
    }, 700);
}

// ===========================================================
// Terminate Contract
// ===========================================================

function terminateContract() {
    if (!confirm("Terminate this Contract?"))
        return;

    ContractDetailsApp.status = "Terminated";

    const statusField = document.querySelector('input[value="Active"]');

    if (statusField) {
        statusField.value = "Terminated";
    }

    showToast("Contract Terminated", "warning");
}

// ===========================================================
// Activity Timeline
// ===========================================================

function addActivity(title, description) {
    const timeline = document.querySelector(".timeline");

    if (!timeline)
        return;

    const item = document.createElement("div");

    item.className = "timeline-item";

    item.innerHTML = `
        <div class="timeline-icon bg-info">
            <i class="fa-solid fa-clock"></i>
        </div>
        <div class="timeline-content">
            <h6>${title}</h6>
            <p>${description}</p>
            <small>
                ${new Date().toLocaleString()}
            </small>
        </div>
    `;

    timeline.prepend(item);
}

// ===========================================================
// Related Records
// ===========================================================

function bindRelatedCards() {
    document
        .querySelectorAll(".border.rounded")
        .forEach(card => {
            card.style.cursor = "pointer";

            card.addEventListener("click", () => {
                showToast(card.querySelector("h6").innerText, "primary");
            });
        });
}

// ===========================================================
// Initialize Interactive Sections
// ===========================================================

document.addEventListener("DOMContentLoaded", () => {
    bindDocumentActions();
    bindQuickActions();
    bindRelatedCards();
});

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
    toast.style.transition = "all .3s";

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

    // Ctrl + E
    if (e.ctrlKey && e.key.toLowerCase() === "e") {
        e.preventDefault();
        exportContract();
    }

    // Ctrl + P
    if (e.ctrlKey && e.key.toLowerCase() === "p") {
        e.preventDefault();
        printContract();
    }

    // Ctrl + I
    if (e.ctrlKey && e.key.toLowerCase() === "i") {
        e.preventDefault();
        generateInvoice();
    }

    // Ctrl + D
    if (e.ctrlKey && e.key.toLowerCase() === "d") {
        e.preventDefault();
        duplicateContract();
    }

});

// ===========================================================
// Export JSON
// ===========================================================

function exportJSON() {
    const data = {
        contractNumber: ContractDetailsApp.contractNumber,
        status: ContractDetailsApp.status,
        tab: ContractDetailsApp.currentTab,
        exportDate: new Date().toLocaleString()
    };

    const blob = new Blob(
        [JSON.stringify(data, null, 2)],
        { type: "application/json" }
    );

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = ContractDetailsApp.contractNumber + ".json";

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);

    showToast("JSON Exported", "success");
}

// ===========================================================
// Loading Screen
// ===========================================================

function showLoader() {
    const loader = document.createElement("div");

    loader.id = "pageLoader";
    loader.className =
        "position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-white";
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

// ===========================================================
// Unsaved Changes
// ===========================================================

window.addEventListener("beforeunload", function (e) {
    if (ContractDetailsApp.hasChanges) {
        e.preventDefault();
        e.returnValue = "";
    }
});

// ===========================================================
// Print Styling
// ===========================================================

window.addEventListener("beforeprint", () => {
    showToast("Preparing Print...", "primary");
});

// ===========================================================
// Simulate Loading
// ===========================================================

showLoader();

window.addEventListener("load", () => {
    setTimeout(() => {
        hideLoader();
    }, 500);
});

// ===========================================================
// Footer Buttons
// ===========================================================

document
    .querySelectorAll(".page-footer .btn")
    .forEach(btn => {
        btn.addEventListener("click", () => {
            const text = btn.innerText.trim();

            switch (text) {
                case "Back":
                    history.back();
                    break;

                case "Export":
                    exportJSON();
                    break;

                case "Edit Contract":
                    editContract();
                    break;
            }
        });
    });

// ===========================================================
// Page Ready
// ===========================================================

console.log("Contract Workspace Ready");

showToast("Workspace Ready", "success");
