// ==========================================
// ECMS Dashboard JavaScript
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    loadDashboard();

    searchCustomer();

    showGreeting();

    showCurrentDate();

    notificationCount();

    logoutConfirmation();

});

// ==========================================
// Dashboard Data
// ==========================================

function loadDashboard() {

    animateCounter("customerCount", 254);
    animateCounter("invoiceCount", 1086);
    animateCounter("revenueCount", 1250000);
    animateCounter("userCount", 34);

}

// ==========================================
// Counter Animation
// ==========================================

function animateCounter(id, target) {

    const element = document.getElementById(id);

    if (!element) return;

    let count = 0;

    const increment = Math.ceil(target / 100);

    const timer = setInterval(() => {

        count += increment;

        if (count >= target) {

            count = target;

            clearInterval(timer);

        }

        if (id === "revenueCount") {

            element.innerText = "£" + count.toLocaleString();

        } else {

            element.innerText = count;

        }

    }, 20);

}

// ==========================================
// Search Customer
// ==========================================

function searchCustomer() {

    const input = document.getElementById("searchCustomer");

    if (!input) return;

    input.addEventListener("keyup", function () {

        const value = this.value.toLowerCase();

        const rows = document.querySelectorAll("#customerTable tr");

        rows.forEach(row => {

            const text = row.innerText.toLowerCase();

            row.style.display = text.includes(value)
                ? ""
                : "none";

        });

    });

}

// ==========================================
// Greeting
// ==========================================

function showGreeting() {

    const hour = new Date().getHours();

    let greeting = "";

    if (hour < 12) {

        greeting = "Good Morning";

    }

    else if (hour < 18) {

        greeting = "Good Afternoon";

    }

    else {

        greeting = "Good Evening";

    }

    const heading = document.querySelector(".welcome h2");

    if (heading) {

        heading.innerHTML = greeting + ", Admin 👋";

    }

}

// ==========================================
// Current Date
// ==========================================

function showCurrentDate() {

    const topbar = document.querySelector(".topbar h3");

    if (!topbar) return;

    const today = new Date();

    const options = {

        weekday: "long",

        year: "numeric",

        month: "long",

        day: "numeric"

    };

    topbar.innerHTML =
        "Dashboard <br><small>" +
        today.toLocaleDateString("en-GB", options) +
        "</small>";

}

// ==========================================
// Notification Badge
// ==========================================

function notificationCount() {

    const bell = document.querySelector(".fa-bell");

    if (!bell) return;

    bell.insertAdjacentHTML(

        "afterend",

        `<span class="badge bg-danger ms-1">4</span>`

    );

}

// ==========================================
// Logout
// ==========================================

function logoutConfirmation() {

    const menuItems = document.querySelectorAll(".sidebar li");

    menuItems.forEach(item => {

        if (item.innerText.includes("Logout")) {

            item.addEventListener("click", () => {

                const confirmLogout = confirm(

                    "Are you sure you want to logout?"

                );

                if (confirmLogout) {

                    window.location.href = "login.html";

                }

            });

        }

    });

}

// ==========================================
// Table Row Click
// ==========================================

document.addEventListener("click", function (e) {

    if (e.target.innerText === "View") {

        alert("Customer Details page coming soon.");

    }

});
