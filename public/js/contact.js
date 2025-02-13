
// Wait for the page to fully load before hiding the preloader
window.addEventListener('load', function () {
    const preloader = document.querySelector('.preloader');
    preloader.style.opacity = '0'; // Fade out the preloader
    preloader.style.visibility = 'hidden'; // Make the preloader invisible
});


let currentSlideIndex = 0;

async function fetchSliderData() {
    const response = await fetch("/get-sliders");
    const sliders = await response.json();

    const sliderContainer = document.getElementById("slider");
    sliders.forEach(slide => {
        const slideDiv = document.createElement("div");
        slideDiv.classList.add("slide");

        slideDiv.innerHTML = `
                    <div class="overlay">
                        <h2 class="slide-title">${slide.title}</h2>
                        <p class="slide-description">${slide.description}</p>
                    </div>
                    
                    <img src="${slide.image_url}" alt="${slide.title}">

                `;
        sliderContainer.appendChild(slideDiv);
    });

    // Start auto-rotate
    startAutoRotate(sliders.length);


    const text = `${slide.title}`;
    const typingText = document.getElementById("typing-text");
    let index = 0;

    // Function to display characters one by one
    function type() {
        if (index < text.length) {
            typingText.innerHTML += text.charAt(index);
            index++;
            setTimeout(type, 100); // Delay between each character
        }
    }

    // Start the typing effect
    type();
}

function startAutoRotate(totalSlides) {
    setInterval(() => {
        currentSlideIndex = (currentSlideIndex + 1) % totalSlides;
        document.getElementById("slider").style.transform = `translateX(-${currentSlideIndex * 100}%)`;
    }, 10000); // Change slide every 10 seconds
}

fetchSliderData();


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


document.addEventListener('DOMContentLoaded', function () {
    const issueTypeSelect = document.getElementById('issueType');
    const deviceConditionField = document.getElementById('deviceConditionField');
    const repairForm = document.getElementById('repairForm');

    // Listen for changes on the "issueType" select field
    issueTypeSelect.addEventListener('change', function () {
        // Show "Device Condition" field if "Broken Screen" is selected
        if (this.value === 'brokenScreen') {
            deviceConditionField.style.display = 'block';
        } else {
            deviceConditionField.style.display = 'none';
        }
    });

    // Handle form submission (for demonstration purposes)
    repairForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent actual form submission (for demo)

        const formData = new FormData(repairForm);
        // You can now use `formData` to send data to the server (e.g., using fetch or Ajax)

        alert('Repair Request Submitted Successfully!');
    });
});

var copy = document.querySelector(".logos-slide").cloneNode(true);
document.querySelector(".logo-slider").appendChild(copy);

