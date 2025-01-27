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
let packages = [];
try {
  const storedData = localStorage.getItem("packages");
  if (storedData) {
    packages = JSON.parse(storedData);
  }
} catch (e) {
  console.error("Error parsing packages from localStorage", e);
}

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
      <td>${pkg.carrier}</td>
      <td>${pkg.type_of_shipment}</td>
      <td>${pkg.weight} kg</td> <!-- Display weight with "kg" suffix -->
      <td>${pkg.paymentMode}</td>
       <td>${pkg.totalFreight}</td> <!-- Show totalFreight with "$" prefix -->
      <td>${pkg.packageStatus}</td> <!-- Add package status column -->
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
  try {
    localStorage.setItem("packages", JSON.stringify(packages));
  } catch (e) {
    console.error("Error saving packages to localStorage", e);
  }
};

// Handle form submission
form.addEventListener("submit", (e) => {
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
  const carrier = document.getElementById("carrier").value;
  const type_of_shipment = document.getElementById("type-of-shipment").value;
  const weight = document.getElementById("weight").value;
  const paymentMode = document.getElementById("payment-mode").value;
  const totalFreight = document.getElementById("total-freight").value;
  const comments = document.getElementById("comments").value;

  // Get shipper and receiver address details
  const shipperName = document.getElementById("shipper-name").value;
  const shipperAddress = document.getElementById("shipper-address").value;
  const shipperEmail = document.getElementById("shipper-email").value;

  const receiverName = document.getElementById("receiver-name").value;
  const receiverAddress = document.getElementById("receiver-address").value;
  const receiverEmail = document.getElementById("receiver-email").value;

  // Check for empty required fields (add more if needed)
  if (
    !packageName ||
    !trackingNumber ||
    !departureTime ||
    !pickUpTime ||
    !shipDate ||
    !deliveryDate ||
    !paymentMode ||
    !totalFreight ||
    !shipperName || // Check if shipper details are provided
    !shipperAddress || // Check if shipper address is provided
    !receiverName || // Check if receiver details are provided
    !receiverAddress // Check if receiver address is provided
  ) {
    alert("Please fill in all the required fields.");
    return;
  }

  // Create a new package object, including all necessary details
  const newPackage = {
    packageName,
    trackingNumber,
    departureTime,
    pickUpTime,
    shipDate,
    deliveryDate,
    packageStatus: "Pending", // Default status
    origin,
    destination,
    carrier,
    type_of_shipment,
    weight: `${weight} kg`, // Store weight with "kg" suffix
    paymentMode,
    totalFreight: `$${totalFreight}`, // Store freight with "$" prefix
    comments,
    shipperName,
    shipperAddress,
    shipperEmail,
    receiverName,
    receiverAddress,
    receiverEmail
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

// Handle actions in the table (Pause, Resume, Delivered)
tableBody.addEventListener("click", (e) => {
  if (e.target.tagName === "BUTTON") {
    const button = e.target;
    const index = button.dataset.index;

    if (button.classList.contains("pause")) {
      // Change status to "Pending" when Pause is clicked
      packages[index].packageStatus = "Pending";
      alert(`Package "${packages[index].packageName}" paused!`);
    } else if (button.classList.contains("resume")) {
      // Change status to "In Transit" when Resume is clicked
      packages[index].packageStatus = "In Transit";
      alert(`Package "${packages[index].packageName}" resumed and is now In Transit!`);
    } else if (button.classList.contains("delivered")) {
      // Change status to "Delivered" when Delivered is clicked
      packages[index].packageStatus = "Delivered";
      alert(`Package "${packages[index].packageName}" marked as delivered!`);
      // Optionally remove the package from the array after it's delivered
      // packages.splice(index, 1);
    }

    // Save the updated packages array to localStorage
    savePackagesToLocalStorage();

    // Re-render the table to reflect the updated status
    renderTable();
  }
});

// Initial render of the table
renderTable();
