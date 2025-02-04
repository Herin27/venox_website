
const textElement = document.getElementById("loading-text");
const loadingPhrases = [
    "Initializing system",
    "Connecting to database...",
    "Loading security protocols...",
    "Fetching latest updates...",
    "Compiling source code...",
    "System ready!"
];

let index = 0;
function updateText() {
    if (index < loadingPhrases.length) {
        textElement.innerHTML = loadingPhrases[index] + '<span class="cursor"></span>';
        index++;
        setTimeout(updateText, 1200);
    } else {
        document.getElementById('loader').classList.add('hidden');
        document.getElementById('content').style.display = 'block';
    }
}

window.onload = function () {
    setTimeout(updateText, 1000);
};

document.addEventListener("DOMContentLoaded", () => {
    const userIcon = document.getElementById("userIcon");
    const userDetails = document.getElementById("userDetails");

    userIcon.addEventListener("click", (e) => {
        e.preventDefault(); // Prevents default anchor behavior
        userDetails.classList.toggle("active");
    });

    // Close dropdown if clicked outside
    document.addEventListener("click", (e) => {
        if (!userIcon.contains(e.target) && !userDetails.contains(e.target)) {
            userDetails.classList.remove("active");
        }
    });
});

// // Get the user details from localStorage
// const user = JSON.parse(localStorage.getItem('user'));
//
// // If the user is not logged in, redirect to the login page
// if (!user) {
//     window.location.href = "/login.html";
// } else {
//     // Display user information
//     document.getElementById("username").textContent = user.username;
//     document.getElementById("email").textContent = user.email;
// }

// Logout function to clear localStorage and redirect to login page
function logout() {
    localStorage.removeItem('user');
    window.location.href = "../deshboard.html";
}

document.addEventListener("DOMContentLoaded", () => {
    // Fetch slider data from the backend
    fetch('/api/slider-data')
        .then(response => response.json())
        .then(data => {
            // Call function to render slider with fetched data
            renderSlider(data);
        })
        .catch(error => console.error('Error fetching slider data:', error));
});

const slides = document.querySelectorAll(".slide");
const slideContainer = document.querySelector(".slides");
const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");
const dotsContainer = document.querySelector(".dots");
let currentIndex = 0;

function updateSlider() {
    slideContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
    document.querySelectorAll(".dot").forEach((dot, index) => {
        dot.classList.toggle("active", index === currentIndex);
    });
}

function nextSlide() {
    currentIndex = (currentIndex + 1) % slides.length;
    updateSlider();
}

function prevSlide() {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateSlider();
}

function createDots() {
    slides.forEach((_, index) => {
        const dot = document.createElement("span");
        dot.classList.add("dot");
        dot.addEventListener("click", () => {
            currentIndex = index;
            updateSlider();
        });
        dotsContainer.appendChild(dot);
    });
}

prevBtn.addEventListener("click", prevSlide);
nextBtn.addEventListener("click", nextSlide);

createDots();
updateSlider();
setInterval(nextSlide, 4000);