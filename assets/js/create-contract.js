// ===========================================================
// ECMS - Create Contract
// create-contract.js
// ===========================================================

"use strict";

// ===========================================================
// Global State
// ===========================================================

const CreateContractApp = {
    contractNumber: "",
    hasChanges: false,
    currentTab: "general",
    deliveryPoints: 1
};

// ===========================================================
// Initialize
// ===========================================================

document.addEventListener("DOMContentLoaded", initialize);

function initialize() {
    generateContractNumber();
    setDefaultDates();
    bindEvents();
    restoreLastTab();

    showToast("Create Contract Ready", "success");
}

// ===========================================================
// Event Binding
// ===========================================================

function bindEvents() {

    document.getElementById("saveDraftBtn")
        ?.addEventListener("click", saveDraft);

    document.getElementById("saveDraftBtn2")
        ?.addEventListener("click", saveDraft);

    document.getElementById("saveDraftFooterBtn")
        ?.addEventListener("click", saveDraft);

    document.getElementById("createContractBtn")
        ?.addEventListener("click", createContract);

    document.getElementById("createContractBtn2")
        ?.addEventListener("click", createContract);

    document.getElementById("createFooterBtn")
        ?.addEventListener("click", createContract);

    document.getElementById("cancelBtn")
        ?.addEventListener("click", cancelForm);

    document.getElementById("cancelFooterBtn")
        ?.addEventListener("click", cancelForm);

    document.getElementById("resetContractBtn")
        ?.addEventListener("click", resetForm);

    document.getElementById("uploadDocumentBtn")
        ?.addEventListener("click", uploadDocument);

    document.getElementById("addDeliveryPointBtn")
        ?.addEventListener("click", addDeliveryPoint);

    document.querySelectorAll(".form-control,.form-select")
        .forEach(field => {
            field.addEventListener("change", () => {
                CreateContractApp.hasChanges = true;
            });
        });

    document.querySelectorAll('.nav-link[data-bs-toggle="tab"]')
        .forEach(tab => {
            tab.addEventListener("shown.bs.tab", function () {
                const id = this
                    .getAttribute("data-bs-target")
                    .replace("#", "");

                CreateContractApp.currentTab = id;

                localStorage.setItem("create_contract_tab", id);
            });
        });

}

// ===========================================================
// Contract Number
// ===========================================================

function generateContractNumber() {
    const number = "CTR-" + Math.floor(100000 + Math.random() * 900000);

    CreateContractApp.contractNumber = number;

    document.getElementById("contractNumber").value = number;
}

// ===========================================================
// Default Dates
// ===========================================================

function setDefaultDates() {
    const today = new Date();
    const nextYear = new Date();

    nextYear.setFullYear(today.getFullYear() + 1);

    const format = date => date.toISOString().split("T")[0];

    document.getElementById("effectiveDate").value = format(today);
    document.getElementById("expirationDate").value = format(nextYear);

    const start = document.getElementById("contractStart");
    const end = document.getElementById("contractEnd");

    if (start) start.value = format(today);
    if (end) end.value = format(nextYear);
}

// ===========================================================
// Restore Active Tab
// ===========================================================

function restoreLastTab() {
    const saved = localStorage.getItem("create_contract_tab");

    if (!saved) return;

    const btn = document.querySelector(`[data-bs-target="#${saved}"]`);

    if (btn) {
        new bootstrap.Tab(btn).show();
    }
}

// ===========================================================
// Save Draft
// ===========================================================

function saveDraft() {
    showToast("Draft Saved Successfully", "primary");

    CreateContractApp.hasChanges = false;
}

// ===========================================================
// Create Contract
// ===========================================================

function createContract() {
    if (!validateForm()) return;

    showToast("Contract Created Successfully", "success");

    setTimeout(() => {
        window.location.href = "contracts.html";
    }, 1200);
}

// ===========================================================
// Cancel
// ===========================================================

function cancelForm() {
    if (
        CreateContractApp.hasChanges &&
        !confirm("Discard changes?")
    ) return;

    history.back();
}

// ===========================================================
// Form Validation
// ===========================================================

function validateForm() {
    const requiredFields = [
        "customer",
        "legalEntity",
        "businessUnit",
        "contractType",
        "contractName",
        "effectiveDate",
        "expirationDate"
    ];

    let valid = true;

    requiredFields.forEach(id => {
        const field = document.getElementById(id);

        if (!field) return;

        field.classList.remove("is-invalid");

        if (field.value.trim() === "" || field.selectedIndex === 0) {
            field.classList.add("is-invalid");
            valid = false;
        }
    });

    if (!valid) {
        showToast("Please complete all required fields.", "danger");
    }

    return valid;
}

// ===========================================================
// Reset Form
// ===========================================================

function resetForm() {
    if (!confirm("Reset the entire form?"))
        return;

    document
        .querySelectorAll("input:not([readonly]), textarea")
        .forEach(field => {
            field.value = "";
        });

    document
        .querySelectorAll("select")
        .forEach(select => {
            select.selectedIndex = 0;
        });

    generateContractNumber();
    setDefaultDates();

    CreateContractApp.hasChanges = false;

    showToast("Form Reset Successfully", "warning");
}

// ===========================================================
// Upload Document
// ===========================================================

function uploadDocument() {
    const tbody = document.getElementById("documentsTableBody");
    const row = document.createElement("tr");

    row.innerHTML = `
        <td>New Document.pdf</td>
        <td>Supporting</td>
        <td>Admin</td>
        <td>${new Date().toLocaleDateString()}</td>
        <td>
            <span class="badge bg-success">Uploaded</span>
        </td>
        <td>
            <button class="btn btn-sm btn-outline-primary">
                <i class="fa-solid fa-download"></i>
            </button>
            <button class="btn btn-sm btn-outline-danger">
                <i class="fa-solid fa-trash"></i>
            </button>
        </td>
    `;

    tbody.appendChild(row);

    showToast("Document Uploaded", "success");
}

// ===========================================================
// Add Delivery Point
// ===========================================================

function addDeliveryPoint() {
    const tbody = document.getElementById("deliveryPointsBody");
    const row = document.createElement("tr");

    row.innerHTML = `
        <td>
            <select class="form-select">
                <option>National Grid</option>
                <option>Transco</option>
            </select>
        </td>

        <td>
            <input class="form-control" placeholder="Receipt Point">
        </td>

        <td>
            <input class="form-control" placeholder="Delivery Point">
        </td>

        <td>
            <select class="form-select">
                <option>North</option>
                <option>South</option>
                <option>East</option>
                <option>West</option>
            </select>
        </td>

        <td>
            <input type="number" class="form-control" placeholder="Capacity">
        </td>

        <td>
            <select class="form-select">
                <option>MMBTU</option>
                <option>DTH</option>
            </select>
        </td>

        <td>
            <select class="form-select">
                <option>Primary</option>
                <option>Secondary</option>
            </select>
        </td>

        <td>
            <button class="btn btn-sm btn-outline-danger remove-delivery">
                <i class="fa-solid fa-trash"></i>
            </button>
        </td>
    `;

    tbody.appendChild(row);

    CreateContractApp.deliveryPoints++;

    bindDeliveryDelete();

    showToast("Delivery Point Added", "success");
}

// ===========================================================
// Delete Delivery Point
// ===========================================================

function bindDeliveryDelete() {
    document
        .querySelectorAll(".remove-delivery")
        .forEach(button => {
            button.onclick = function () {
                if (document.querySelectorAll("#deliveryPointsBody tr").length === 1) {
                    showToast("At least one delivery point is required.", "warning");
                    return;
                }

                this.closest("tr").remove();

                CreateContractApp.deliveryPoints--;

                showToast("Delivery Point Removed", "danger");
            };
        });
}

bindDeliveryDelete();

// ===========================================================
// Live Contract Summary
// ===========================================================

function updateSummary() {
    const customer = document.getElementById("customer");
    const unit = document.getElementById("businessUnit");
    const type = document.getElementById("contractType");
    const pricing = document.getElementById("pricingMethod");

    const cards = document.querySelectorAll(".border.rounded p");

    if (cards.length < 6) return;

    cards[0].innerHTML = customer.options[customer.selectedIndex].text;
    cards[1].innerHTML = unit.options[unit.selectedIndex].text;
    cards[2].innerHTML = type.options[type.selectedIndex].text;
    cards[3].innerHTML = pricing
        ? pricing.options[pricing.selectedIndex].text
        : "-";
}

document
    .querySelectorAll("select")
    .forEach(select => {
        select.addEventListener("change", updateSummary);
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

    toast.innerHTML = message;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// ===========================================================
// Export Draft (JSON)
// ===========================================================

function exportDraft() {
    const formData = {};

    document
        .querySelectorAll("input,select,textarea")
        .forEach(field => {
            if (field.id) {
                formData[field.id] = field.value;
            }
        });

    const blob = new Blob(
        [JSON.stringify(formData, null, 2)],
        { type: "application/json" }
    );

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = CreateContractApp.contractNumber + ".json";

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);

    showToast("Draft Exported", "success");
}

// ===========================================================
// Keyboard Shortcuts
// ===========================================================

document.addEventListener("keydown", function (e) {

    // Ctrl + S
    if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        saveDraft();
    }

    // Ctrl + Enter
    if (e.ctrlKey && e.key === "Enter") {
        e.preventDefault();
        createContract();
    }

    // Ctrl + R
    if (e.ctrlKey && e.key.toLowerCase() === "r") {
        e.preventDefault();
        resetForm();
    }

    // Ctrl + E
    if (e.ctrlKey && e.key.toLowerCase() === "e") {
        e.preventDefault();
        exportDraft();
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
// Auto Save Draft
// ===========================================================

setInterval(() => {
    if (CreateContractApp.hasChanges) {
        console.log("Auto Saving Draft...");
        CreateContractApp.hasChanges = false;
    }
}, 60000);

// ===========================================================
// Warn Before Exit
// ===========================================================

window.addEventListener("beforeunload", function (e) {
    if (CreateContractApp.hasChanges) {
        e.preventDefault();
        e.returnValue = "";
    }
});

// ===========================================================
// Footer Buttons
// ===========================================================

document
    .querySelectorAll(".page-footer .btn")
    .forEach(btn => {
        btn.addEventListener("click", () => {
            switch (btn.innerText.trim()) {
                case "Cancel":
                    cancelForm();
                    break;

                case "Save Draft":
                    saveDraft();
                    break;

                case "Create Contract":
                    createContract();
                    break;
            }
        });
    });

// ===========================================================
// Page Ready
// ===========================================================

console.log("Create Contract Ready");

showToast("Workspace Ready", "success");
