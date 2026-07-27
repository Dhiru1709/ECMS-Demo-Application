// ===============================
// ECMS Login Script
// ===============================

document.addEventListener("DOMContentLoaded", () => {

    const loginButton = document.getElementById("loginBtn");

    if (!loginButton) return;

    loginButton.addEventListener("click", loginUser);

});

// ===============================
// Login Function
// ===============================

function loginUser(event) {

    event.preventDefault();

    const username = document
        .getElementById("username")
        .value
        .trim();

    const password = document
        .getElementById("password")
        .value
        .trim();

    // Required Field Validation

    if (username === "" || password === "") {

        alert("Username and Password are required.");

        return;
    }

    // Demo Credentials

    if (
        username === "admin" &&
        password === "Admin@123"
    ) {

        alert("Login Successful");

        window.location.href = "dashboard.html";

    } else {

        alert("Invalid Username or Password");

    }

}
