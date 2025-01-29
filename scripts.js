// Import Firebase SDK modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDrkxn2Sw1CwE_XqktaZeiF4x3hJWURNHE",
  authDomain: "expressdelivery247-191d2.firebaseapp.com",
  projectId: "expressdelivery247-191d2",
  storageBucket: "expressdelivery247-191d2.firebasestorage.app",
  messagingSenderId: "573437430411",
  appId: "1:573437430411:web:8eaf8811344c0386a5628e",
  measurementId: "G-4D7T350EPJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Get references to form and table body
const form = document.getElementById("package-form");
const tableBody = document.querySelector("#package-table tbody");

// Retrieve packages from Firebase on page load
let packages = []; // Local array to store package data

const fetchPackagesFromFirebase = async () => {
  try {
    const snapshot = await get(ref(database, "packages"));
    if (snapshot.exists()) {
      packages = Object.values(snapshot.val());
      renderTable();
    }
  } catch (error) {
    console.error("Error fetching packages from Firebase:", error);
  }
};

// Function to render the table rows
const renderTable = () => {
  tableBody.innerHTML = ""; // Clear the table body

  packages.forEach((pkg, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${pkg.packageName}</td>
      <td>${pkg.trackingNumber}</td>
      <td>${pkg.departureTime}</td>
      <td>${pkg.pickUpTime}</td>
      <td>${pkg.shipDate}</td>
      <td>${pkg.deliveryDate}</td>
      <td>${pkg.origin}</td>
      <td>${pkg.destination}</td>
      <td>${pkg.weight}</td>
      <td>${pkg.paymentMode}</td>
      <td>${pkg.packageStatus}</td>
      <td>
        <button class="pause" data-index="${index}">Pause</button>
        <button class="resume" data-index="${index}">Resume</button>
        <button class="delivered" data-index="${index}">Delivered</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
};

// Handle form submission and save data to Firebase
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Get form values
  const packageName = document.getElementById("package-name").value;
  const trackingNumber = document.getElementById("tracking-number").value;
  const departureTime = document.getElementById("departure-time").value;
  const pickUpTime = document.getElementById("pick-up-time").value;
  const shipDate = document.getElementById("ship-date").value;
  const deliveryDate = document.getElementById("delivery-date").value;
  const origin = document.getElementById("origin").value;
  const destination = document.getElementById("destination").value;
  const weight = document.getElementById("weight").value;
  const paymentMode = document.getElementById("payment-mode").value;
  const comments = document.getElementById("comments").value;

  // Get shipper and receiver details
  const shipperName = document.getElementById("shipper-name").value;
  const shipperAddress = document.getElementById("shipper-address").value;
  const shipperPhone = document.getElementById("shipper-phone").value;

  const receiverName = document.getElementById("receiver-name").value;
  const receiverAddress = document.getElementById("receiver-address").value;
  const receiverPhone = document.getElementById("receiver-phone").value;

  // Check for required fields
  if (
    !packageName ||
    !trackingNumber ||
    !departureTime ||
    !pickUpTime ||
    !shipDate ||
    !deliveryDate ||
    !paymentMode ||
    !shipperName ||
    !shipperPhone ||
    !receiverName ||
    !receiverPhone
  ) {
    alert("Please fill in all the required fields.");
    return;
  }

  // Create a new package object
  const newPackage = {
    packageName,
    trackingNumber,
    departureTime,
    pickUpTime,
    shipDate,
    deliveryDate,
    packageStatus: "Paused", // Default status
    origin,
    destination,
    weight: `${weight} kg`, // Add "kg" suffix
    paymentMode,
    comments,
    shipperName,
    shipperAddress,
    shipperPhone,
    receiverName,
    receiverAddress,
    receiverPhone,
  };

  // Save the package to Firebase
  try {
    const packageRef = ref(database, `packages/${trackingNumber}`); // Use tracking number as the key
    await set(packageRef, newPackage);

    alert("Package saved to Firebase!");

    // Update local packages array and re-render table
    packages.push(newPackage);
    renderTable();
    form.reset(); // Clear the form fields
  } catch (error) {
    console.error("Error saving package to Firebase:", error);
    alert("Failed to save package to Firebase.");
  }
});

// Handle actions in the table (Pause, Resume, Delivered)
tableBody.addEventListener("click", (e) => {
  if (e.target.tagName === "BUTTON") {
    const button = e.target;
    const index = button.dataset.index;

    if (button.classList.contains("pause")) {
      packages[index].packageStatus = "Paused";
      alert(`Package "${packages[index].packageName}" paused!`);
    } else if (button.classList.contains("resume")) {
      packages[index].packageStatus = "In Transit";
      alert(`Package "${packages[index].packageName}" resumed!`);
    } else if (button.classList.contains("delivered")) {
      packages[index].packageStatus = "Delivered";
      alert(`Package "${packages[index].packageName}" marked as delivered!`);
    }

    // Update the package in Firebase
    const packageRef = ref(database, `packages/${packages[index].trackingNumber}`);
    set(packageRef, packages[index])
      .then(() => renderTable())
      .catch((error) => console.error("Error updating package status:", error));
  }
});

// Fetch and render packages on page load
fetchPackagesFromFirebase();
