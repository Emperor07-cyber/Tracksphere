// scripts.js

// Responsive Menu Toggle
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");

menuToggle.addEventListener("click", () => {
  nav.classList.toggle("active");
});

// Get references to form and table body
const form = document.getElementById("package-form");
const tableBody = document.querySelector("#package-table tbody");

// Retrieve stored packages from localStorage
let packages = JSON.parse(localStorage.getItem("packages")) || [];

// Function to render the table rows
const renderTable = () => {
  tableBody.innerHTML = ""; // Clear the table body

  packages.forEach((pkg, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${pkg.trackingNumber}</td>
      <td>${pkg.fullName}</td>
      <td>${pkg.phoneNumber}</td>
      <td>
        <button class="pause" data-index="${index}">Pause</button>
        <button class="resume" data-index="${index}">Resume</button>
        <button class="delivered" data-index="${index}">Delivered</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
};

// Save the packages array to localStorage
const savePackagesToLocalStorage = () => {
  localStorage.setItem("packages", JSON.stringify(packages));
};

// Handle form submission
form.addEventListener("submit", (e) => {
  e.preventDefault();

  // Get form values
  const trackingNumber = document.getElementById("tracking-number").value;
  const fullName = document.getElementById("full-name").value;
  const phoneNumber = document.getElementById("phone-number").value;

  // Create a new package object
  const newPackage = {
    trackingNumber,
    fullName,
    phoneNumber,
  };

  // Add the package to the array
  packages.push(newPackage);

  // Save the updated packages array to localStorage
  savePackagesToLocalStorage();

  // Re-render the table
  renderTable();

  // Clear the form fields
  form.reset();
});

// Handle actions in the table
tableBody.addEventListener("click", (e) => {
  if (e.target.tagName === "BUTTON") {
    const button = e.target;
    const index = button.dataset.index;

    if (button.classList.contains("pause")) {
      alert(`Package #${packages[index].trackingNumber} paused!`);
    } else if (button.classList.contains("resume")) {
      alert(`Package #${packages[index].trackingNumber} resumed!`);
    } else if (button.classList.contains("delivered")) {
      // Remove the package from the array
      alert(`Package #${packages[index].trackingNumber} marked as delivered!`);
      packages.splice(index, 1);

      // Save the updated packages array to localStorage
      savePackagesToLocalStorage();

      // Re-render the table
      renderTable();
    }
  }
});

// Initial render of the table
renderTable();
