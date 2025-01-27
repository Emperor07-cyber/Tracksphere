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

// Validate tracking number (10-12 numeric characters)
function isValidTrackingNumber(number) {
  const trackingRegex = /^[0-9]{10,12}$/;
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

// Display package details including shipper and receiver addresses in a dynamic table and cards
function displayPackageDetails(details) {
  trackingResult.innerHTML = `
    <div class="address-card">
        <h3>Shipper Address</h3>
        <p><strong>Shipper Name:</strong> ${details.shipperName || 'N/A'}</p>
        <p><strong>Shipper Address:</strong> ${details.shipperAddress || 'N/A'}</p>
        <p><strong>Email:</strong> ${details.shipperEmail || 'N/A'}</p>
    </div>
    
    <div class="address-card">
        <h3>Receiver Address</h3>
        <p><strong>Reciever Name:</strong> ${details.receiverName || 'N/A'}</p>
        <p><strong> Receiver Address:</strong> ${details.receiverAddress || 'N/A'}</p>
        <p><strong>Email:</strong> ${details.receiverEmail || 'N/A'}</p>
    </div>

    <h3>Package Details</h3>
    <table>
      <tr><th>Package Name</th><td>${details.packageName || 'N/A'}</td></tr>
      <tr><th>Tracking Number</th><td>${details.trackingNumber || 'N/A'}</td></tr>
      <tr><th>Departure Time</th><td>${details.departureTime || 'N/A'}</td></tr>
      <tr><th>Pick-Up Time</th><td>${details.pickUpTime || 'N/A'}</td></tr>
      <tr><th>Ship Date</th><td>${details.shipDate || 'N/A'}</td></tr>
      <tr><th>Delivery Date</th><td>${details.deliveryDate || 'N/A'}</td></tr>
      <tr><th>Origin</th><td>${details.origin || 'N/A'}</td></tr>
      <tr><th>Destination</th><td>${details.destination || 'N/A'}</td></tr>
      <tr><th>Carrier</th><td>${details.carrier || 'N/A'}</td></tr>
      <tr><th>Type of Shipment</th><td>${details.type_of_shipment || 'N/A'}</td></tr>
      <tr><th>Weight</th><td>${details.weight || 'N/A'}</td></tr>
      <tr><th>Payment Mode</th><td>${details.paymentMode || 'N/A'}</td></tr>
      <tr><th>Total Freight</th><td>${details.totalFreight || 'N/A'}</td></tr>
      <tr><th>Status</th><td>${details.packageStatus || 'N/A'}</td></tr>
      ${details.comments ? `<tr><th>Comments</th><td>${details.comments}</td></tr>` : ''}
    </table>

    
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
