// Handle form submission and tracking number validation
const trackingForm = document.querySelector('.tracking-form');
const trackingInput = document.querySelector('.tracking-form input');
const errorMessage = document.createElement('p');
errorMessage.style.color = 'red';
errorMessage.style.marginTop = '10px';
errorMessage.style.display = 'none';
trackingForm.appendChild(errorMessage);

trackingForm.addEventListener('submit', (event) => {
  event.preventDefault(); // Prevent page reload
  const trackingNumber = trackingInput.value.trim();

  if (!isValidTrackingNumber(trackingNumber)) {
    errorMessage.textContent =
      'Invalid tracking number. A valid tracking number must be 10-12 numeric characters.';
    errorMessage.style.display = 'block';
    trackingInput.style.border = '2px solid red';
    return;
  }

  console.log(`Tracking Number: ${trackingNumber}`);
  errorMessage.style.display = 'none';
  trackingInput.style.border = '2px solid #FFD700';
  alert(`Tracking Number: ${trackingNumber} submitted successfully!`);
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
  console.log('Menu toggle clicked');
  nav.classList.toggle('active');
});

// Profile Popup Form Logic
const profileIcon = document.querySelector('.profile-icon');
const popupForm = document.querySelector('.popup-form');
const profileForm = document.getElementById('profile-form');
const validCode = "123456"; // Replace this with the correct code

// Show the popup form when clicking the profile icon
profileIcon.addEventListener('click', (event) => {
  console.log('Profile icon clicked');
  event.stopPropagation(); // Prevent click event from bubbling up
  popupForm.style.display = popupForm.style.display === 'block' ? 'none' : 'block';
  console.log(`Popup form visibility: ${popupForm.style.display}`);
});

// Hide the popup form when clicking outside of it
document.addEventListener('click', (event) => {
  if (!popupForm.contains(event.target) && event.target !== profileIcon) {
    console.log('Click detected outside popup form');
    popupForm.style.display = 'none';
    console.log('Popup form hidden');
  }
});

// Handle the popup form submission
profileForm.addEventListener('submit', (event) => {
  event.preventDefault(); // Prevent form from submitting normally
  const enteredCode = document.getElementById('six-digit-code').value;
  console.log(`Entered code: ${enteredCode}`);

  if (enteredCode === validCode) {
    console.log('Code is valid! Redirecting...');
    alert('Code is valid! Redirecting...');
    window.location.href = 'success.html'; // Redirect to success page
  } else {
    console.log('Invalid code entered');
    alert('Invalid code. Please try again.');
  }
});


