
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


// Chatbot interaction
const chatbotToggler = document.querySelector(".chatbot-toggler");
const closeBtn = document.querySelector(".close-btn");
const chatbox = document.querySelector(".chatbox");
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
let userMessage = null; // Variable to store user's message
const inputInitHeight = chatInput.scrollHeight;
// API configuration
const API_KEY = "AIzaSyDPTq_df9822DBkbPtLWlUsQ9CH9Ve5Ms8"; // Your API key here
const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`;
const createChatLi = (message, className) => {
    // Create a chat <li> element with passed message and className
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", `${className}`);
    let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi; // return chat <li> element
}
const generateResponse = async (chatElement) => {
    const messageElement = chatElement.querySelector("p");
    // Define the properties and message for the API request
    const requestOptions = {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            contents: [{
                role: "user",
                parts: [{text: userMessage}]
            }]
        }),
    }
    // Send POST request to API, get response and set the reponse as paragraph text
    try {
        const response = await fetch(API_URL, requestOptions);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error.message);

        // Get the API response text and update the message element
        messageElement.textContent = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, '$1');
    } catch (error) {
        // Handle error
        messageElement.classList.add("error");
        messageElement.textContent = error.message;
    } finally {
        chatbox.scrollTo(0, chatbox.scrollHeight);
    }
}
const handleChat = () => {
    userMessage = chatInput.value.trim(); // Get user entered message and remove extra whitespace
    if (!userMessage) return;
    // Clear the input textarea and set its height to default
    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`;
    // Append the user's message to the chatbox
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);
    setTimeout(() => {
        // Display "Thinking..." message while waiting for the response
        const incomingChatLi = createChatLi("Thinking...", "incoming");
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLi);
    }, 600);
}
chatInput.addEventListener("input", () => {
    // Adjust the height of the input textarea based on its content
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});
chatInput.addEventListener("keydown", (e) => {
    // If Enter key is pressed without Shift key and the window
    // width is greater than 800px, handle the chat
    if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleChat();
    }
});
sendChatBtn.addEventListener("click", handleChat);
closeBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));



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
    window.location.href = "../index.html";
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

document.addEventListener("DOMContentLoaded", function() {
    const boxes = document.querySelectorAll(".park-box");

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
            }
        });
    }, { threshold: 0.5 });

    boxes.forEach(box => {
        observer.observe(box);
    });


});

