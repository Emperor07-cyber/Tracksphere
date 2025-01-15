// script.js

document.querySelectorAll('.nav-list a').forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        const targetSection = document.querySelector(this.getAttribute('href'));
        targetSection.scrollIntoView({ behavior: 'smooth' });
    });
});

document.getElementById('tracking-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const trackingId = document.getElementById('tracking-id').value;
    const statusMessage = document.createElement('p');

    statusMessage.textContent = trackingId.trim()
        ? `Tracking ID ${trackingId} status: In Transit.`
        : "Please enter a valid tracking ID.";

    const heroContent = document.querySelector('.hero-content');
    heroContent.appendChild(statusMessage);
});

// Simulated actions for testimonials
const testimonials = [
    "This platform made tracking my shipments a breeze. Highly recommend!",
    "As a business owner, I love the admin controls. It saves me so much time.",
    "Reliable, fast, and easy to use. Perfect for my needs."
];

let testimonialIndex = 0;
const testimonialDisplay = document.querySelector('.testimonials-grid blockquote p');

function rotateTestimonials() {
    testimonialDisplay.textContent = testimonials[testimonialIndex];
    testimonialIndex = (testimonialIndex + 1) % testimonials.length;
}

setInterval(rotateTestimonials, 5000);
