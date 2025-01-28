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
      'Invalid tracking number. A valid tracking number must be 10-12 numeric characters.';
    errorMessage.style.display = 'block';
    trackingInput.style.border = '2px solid red';
    return;
  }

  errorMessage.style.display = 'none';
  trackingInput.style.border = '2px solid #FFD700';

  // Check for local data or fetch from external source
  const packageDetails = getPackageDetails(trackingNumber);
  if (packageDetails) {
    displayPackageDetails(packageDetails); // Display from local storage
  } else {
    try {
      const response = await fetch(`success.html?tracking=${trackingNumber}`);

      // Check if the response is OK (status 200)
      if (!response.ok) {
        throw new Error('Tracking Number not found.');
      }

      // Log the response status and headers
      console.log('Response Status:', response.status);
      console.log('Response Headers:', response.headers);

      const responseText = await response.text();
      console.log('Response Text:', responseText);  // Log the actual response text for debugging

      // Check if response is HTML (could be an error page)
      if (responseText.startsWith('<!DOCTYPE html>')) {
        throw new Error('Tracking Number not found in HTML response.');
      }

      // Attempt to parse the response as JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        throw new Error('Failed to parse JSON response');
      }

      displayPackageDetails(data); // Display fetched details
    } catch (error) {
      alert(error.message);
    }
  }

  trackingInput.value = '';
});

// Validate tracking number (20 alphanumeric characters)
function isValidTrackingNumber(number) {
  const trackingRegex = /^[a-zA-Z0-9]{20}$/;
  return trackingRegex.test(number);
}

// Live input validation for tracking number
trackingInput.addEventListener('input', () => {
  const value = trackingInput.value.trim();
  if (value === '' || !isValidTrackingNumber(value)) {
    trackingInput.style.border = '2px solid red';
  } else {
    trackingInput.style.border = '2px solid #FFD700';
  }
});

// Retrieve package details from local storage
function getPackageDetails(trackingNumber) {
  const packages = JSON.parse(localStorage.getItem('packages')) || [];
  return packages.find((pkg) => pkg.trackingNumber === trackingNumber);
}

function displayPackageDetails(details) {
  trackingResult.innerHTML = `
    <!-- Tracking Number with Barcode -->
    <div class="tracking-info">
        <h2>Tracking Number: ${details.trackingNumber || 'N/A'}</h2>
        <div class="barcode-container">
            <img src="https://barcode.tec-it.com/barcode.ashx?data=${details.trackingNumber || ''}&code=Code128&dpi=96" alt="Barcode for Tracking Number">
        </div>
    </div>

    <!-- Address Cards -->
    <div class="address-cards">
        <div class="address-card">
            <h3>Shipper Address</h3>
            <hr>
            <p><strong>Shipper Name:</strong> ${details.shipperName || 'N/A'}</p>
            <p><strong>Shipper Address:</strong> ${details.shipperAddress || 'N/A'}</p>
            <p><strong>Email:</strong> ${details.shipperEmail || 'N/A'}</p>
        </div>

        <div class="address-card">
            <h3>Receiver Address</h3>
            <hr>
            <p><strong>Receiver Name:</strong> ${details.receiverName || 'N/A'}</p>
            <p><strong>Receiver Address:</strong> ${details.receiverAddress || 'N/A'}</p>
            <p><strong>Email:</strong> ${details.receiverEmail || 'N/A'}</p>
        </div>
    </div>

<!-- Styled Table for Package Details -->
    <div class="package-details">
        <table class="details-table">
            <thead>
                <tr>
                    <th>Package Name</th>
                    <th>Delivery Date</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>${details.packageName || 'N/A'}</td>
                    <td>${details.deliveryDate || 'N/A'}</td>
                    <td>${details.packageStatus || 'N/A'}</td>
                </tr>
            </tbody>
            <thead>
                <tr>
                    <th>Shipping Date</th>
                    <th>Departure Time</th>
                    <th>Expected Delivery Time</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>${details.shipDate || 'N/A'}</td>
                    <td>${details.departureTime || 'N/A'}</td>
                    <td>${details.pickUpTime || 'N/A'}</td>
                </tr>
            </tbody>
            <thead>
                <tr>
                    <th>Origin</th>
                    <th>Destination</th>
                    <th>Weight</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>${details.origin || 'N/A'}</td>
                    <td>${details.destination || 'N/A'}</td>
                    <td>${details.weight || 'N/A'}</td>
                </tr>
            </tbody>
            <thead>
                <tr>
                    <th>Payment Mode</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>${details.paymentMode || 'N/A'}</td>
                </tr>
            </tbody>
        </table>
    </div>

  `;
}



// Action buttons to update package status
trackingResult.addEventListener('click', (event) => {
  if (event.target.classList.contains('pause') || event.target.classList.contains('resume') || event.target.classList.contains('delivered')) {
    const button = event.target;
    const index = button.dataset.index;
    let packages = JSON.parse(localStorage.getItem('packages')) || [];
    const pkg = packages[index];

    // Update the package status based on the button clicked
    if (button.classList.contains('pause')) {
      pkg.packageStatus = 'Paused';
    } else if (button.classList.contains('resume')) {
      pkg.packageStatus = 'In Progress';
    } else if (button.classList.contains('delivered')) {
      pkg.packageStatus = 'Delivered';
    }

    // Save the updated package data back to localStorage
    localStorage.setItem('packages', JSON.stringify(packages));

    // Refresh the displayed details
    displayPackageDetails(pkg);
  }
});

// Smooth scrolling for navigation links
const links = document.querySelectorAll('.nav-links a');
links.forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    const targetId = event.target.getAttribute('href').slice(1);
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Mobile Navigation Toggle
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

menuToggle.addEventListener('click', () => {
  nav.classList.toggle('active');
});

// Profile Popup Form Logic
const profileIcon = document.querySelector('.profile-icon');
const popupForm = document.querySelector('.popup-form');
const profileForm = document.getElementById('profile-form');
const validCode = '199333'; // Replace this with the correct code

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

  if (enteredCode === validCode) {
    alert('Code is valid! Redirecting...');
    window.location.href = 'success.html';
  } else {
    alert('Invalid code. Please try again.');
  }
});
