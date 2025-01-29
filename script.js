// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getDatabase, ref, get, update } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDrkxn2Sw1CwE_XqktaZeiF4x3hJWURNHE",
  authDomain: "expressdelivery247-191d2.firebaseapp.com",
  databaseURL: "https://expressdelivery247-191d2-default-rtdb.firebaseio.com",
  projectId: "expressdelivery247-191d2",
  storageBucket: "expressdelivery247-191d2.firebasestorage.app",
  messagingSenderId: "573437430411",
  appId: "1:573437430411:web:8eaf8811344c0386a5628e",
  measurementId: "G-4D7T350EPJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Handle form submission and tracking number validation
const trackingForm = document.querySelector('.tracking-form');
const trackingInput = document.querySelector('.tracking-form input');
const trackingResult = document.getElementById('tracking-result');
const errorMessage = document.createElement('p');

errorMessage.style.color = 'red';
errorMessage.style.marginTop = '10px';
errorMessage.style.display = 'none';
trackingForm.appendChild(errorMessage);

trackingForm.addEventListener('submit', async (event) => {
  event.preventDefault(); // Prevent page reload
  const trackingNumber = trackingInput.value.trim();

  if (!isValidTrackingNumber(trackingNumber)) {
    errorMessage.textContent =
      'Invalid tracking number. Please enter a 20-character alphanumeric code.';
    errorMessage.style.display = 'block';
    trackingInput.style.border = '2px solid red';
    return;
  }

  errorMessage.style.display = 'none';
  trackingInput.style.border = '2px solid #FFD700';

  try {
    const packageDetails = await getPackageDetails(trackingNumber);
    if (packageDetails) {
      displayPackageDetails(packageDetails); // Display from Firebase
    } else {
      throw new Error("Tracking Number not found.");
    }
  } catch (error) {
    alert(error.message);
  }

  trackingInput.value = ''; // Clear input field
});

// Validate tracking number (20 alphanumeric characters)
function isValidTrackingNumber(number) {
  const trackingRegex = /^[a-zA-Z0-9]{20}$/;
  return trackingRegex.test(number);
}

// Live input validation for tracking number
trackingInput.addEventListener('input', () => {
  const value = trackingInput.value.trim();
  trackingInput.style.border = value === '' || !isValidTrackingNumber(value) ? '2px solid red' : '2px solid #FFD700';
});

// Retrieve package details from Firebase
async function getPackageDetails(trackingNumber) {
  try {
    const snapshot = await get(ref(database, `packages/${trackingNumber}`));
    return snapshot.exists() ? snapshot.val() : null;
  } catch (error) {
    console.error("Error fetching tracking details from Firebase:", error);
    return null;
  }
}

function displayPackageDetails(details) {
  trackingResult.innerHTML = `
    <div class="tracking-info">
        <h2>Tracking Number: ${details.trackingNumber || 'N/A'}</h2>
        <div class="barcode-container">
            <img src="https://barcode.tec-it.com/barcode.ashx?data=${details.trackingNumber || ''}&code=Code128&dpi=96" alt="Barcode for Tracking Number">
        </div>
    </div>

    <div class="address-cards">
        <div class="address-card">
            <h3>Shipper Address</h3>
            <hr>
            <p><strong>Shipper Name:</strong> ${details.shipperName || 'N/A'}</p>
            <p><strong>Shipper Address:</strong> ${details.shipperAddress || 'N/A'}</p>
            <p><strong>Phone Number:</strong> ${details.shipperPhone || 'N/A'}</p>
        </div>
        <div class="address-card">
            <h3>Receiver Address</h3>
            <hr>
            <p><strong>Receiver Name:</strong> ${details.receiverName || 'N/A'}</p>
            <p><strong>Receiver Address:</strong> ${details.receiverAddress || 'N/A'}</p>
            <p><strong>Phone Number:</strong> ${details.receiverPhone || 'N/A'}</p>
        </div>
    </div>

    <div class="package-details">
        <table class="details-table">
            <thead>
                <tr><th>Package Name</th>
                <th>Delivery Date</th>
                <th>Status</th></tr>
            </thead>
            <tbody>
                <tr>
                    <td>${details.packageName || 'N/A'}</td>
                    <td>${details.deliveryDate || 'N/A'}</td>
                    <td>${details.packageStatus || 'N/A'}</td>
                </tr>
            </tbody>
            <thead>
                <tr><th>Shipping Date</th>
                <th>Departure Time</th>
                <th>Estimated Delivery Time</th></tr>
            </thead>
            <tbody>
                <tr>
                    <td>${details.shipDate || 'N/A'}</td>
                    <td>${details.departureTime || 'N/A'}</td>
                    <td>${details.pickUpTime || 'N/A'}</td>
                </tr>
            </tbody>
            <thead>
                <tr><th>Origin</th>
                <th>Destination</th>
                <th>Weight</th></tr>
            </thead>
            <tbody>
                <tr>
                    <td>${details.origin || 'N/A'}</td>
                    <td>${details.destination || 'N/A'}</td>
                    <td>${details.weight || 'N/A'}</td>
                </tr>
            </tbody>
            <thead>
                <th>Payment Mode</th>
                <th>Comments</th></tr>
            </thead>
            <tbody>
                <tr>
                    <td>${details.paymentMode || 'N/A'}</td>
                    <td>${details.comments || 'N/A'}</td>
                </tr>
            </tbody>
        </table>
    </div>


  `;
}

// Handle status update clicks
trackingResult.addEventListener("click", async (event) => {
  if (event.target.classList.contains("pause") || event.target.classList.contains("resume") || event.target.classList.contains("delivered")) {
    const button = event.target;
    const trackingNumber = button.dataset.trackingNumber;

    try {
      const packageRef = ref(database, `packages/${trackingNumber}`);
      let newStatus = button.classList.contains("pause") ? "Paused" : 
                      button.classList.contains("resume") ? "In Progress" : "Delivered";

      await update(packageRef, { packageStatus: newStatus });

      const updatedPackageDetails = await getPackageDetails(trackingNumber);
      if (updatedPackageDetails) {
        displayPackageDetails(updatedPackageDetails);
      }

      alert(`Package status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating package status:", error);
      alert("Failed to update package status.");
    }
  }
});

// Smooth scrolling for navigation links
document.querySelectorAll('.nav-links a').forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    document.getElementById(event.target.getAttribute('href').slice(1))?.scrollIntoView({ behavior: 'smooth' });
  });
});

// Mobile Navigation Toggle
document.querySelector('.menu-toggle').addEventListener('click', () => {
  document.querySelector('.nav').classList.toggle('active');
});

// Profile Popup Form Logic
const profileIcon = document.querySelector('.profile-icon');
const popupForm = document.querySelector('.popup-form');
const profileForm = document.getElementById('profile-form');
const validCode = '199333';

profileIcon.addEventListener('click', (event) => {
  event.stopPropagation();
  popupForm.style.display = popupForm.style.display === 'block' ? 'none' : 'block';
});

document.addEventListener('click', (event) => {
  if (!popupForm.contains(event.target) && event.target !== profileIcon) {
    popupForm.style.display = 'none';
  }
});

profileForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const enteredCode = document.getElementById('six-digit-code').value;
  enteredCode === validCode ? (alert('Code is valid! Redirecting...'), window.location.href = 'success.html') : alert('Invalid code. Please try again.');
});
