let select = document.querySelector(".select-heading")
let options = document.querySelector(".options")
let arrow = document.querySelector(".select-heading img")
let option = document.querySelectorAll(".option")
let selecttext = document.querySelector(".select-heading span")
let h1 = document.querySelector(".h1")
let chatbox = document.querySelector(".chat-box")
let chatbot = document.querySelector(".right-nav > img")


select.addEventListener("click", () => {
    options.classList.toggle("active-options")
    arrow.classList.toggle("rotate")
})

option.forEach((item) => {
    item.addEventListener("click", () => {
        selecttext.innerText = item.innerText
    })
})

// Chat-Bot with Hugging Face API (FREE - No API Key Needed!)

let prompt = document.querySelector(".prompt")
let chatbtn = document.querySelector(".input-area button")
let chatContainer = document.querySelector(".chat-container")
let userMessage = "";

// Improved AI with built-in fitness knowledge + API fallback
const FITNESS_RESPONSES = {
    "Hii": "Hello! I'm your Fitness Assistant 🤖💪. Ask me anything about workouts, diet, weight loss, muscle gain, or general fitness tips!",
    "chest": "Great chest workouts include: Bench Press (3x10), Push-ups (3x15), Dumbbell Flyes (3x12), and Incline Press (3x10). Focus on form and progressive overload!",
    "back": "Effective back exercises: Pull-ups (3x8), Deadlifts (3x8), Bent-over Rows (3x10), and Lat Pulldowns (3x12). Strong back = better posture!",
    "biceps": "Build bigger biceps with: Barbell Curls (3x10), Hammer Curls (3x12), Concentration Curls (3x10), and Chin-ups (3x8). Don't forget to rest!",
    "triceps": "Tricep exercises: Close-grip Bench Press (3x10), Tricep Dips (3x12), Overhead Extension (3x10), and Cable Pushdowns (3x12).",
    "shoulder": "Shoulder workout: Military Press (3x10), Lateral Raises (3x15), Front Raises (3x12), and Face Pulls (3x15). Build those delts!",
    "legs": "Leg day essentials: Squats (3x10), Lunges (3x12 each), Leg Press (3x12), and Calf Raises (3x20). Never skip leg day!",
    "cardio": "Great cardio options: Running, Cycling, Swimming, Jump Rope, or HIIT workouts. Aim for 20-30 minutes, 3-4 times per week!",
    "diet": "Healthy diet tips: Eat lean proteins (chicken, fish), complex carbs (rice, oats), healthy fats (nuts, avocado), and lots of vegetables. Stay hydrated!",
    "weight loss": "For weight loss: Create a calorie deficit, do cardio 3-4x/week, strength train 2-3x/week, eat protein-rich foods, and stay consistent!",
    "muscle gain": "To build muscle: Eat in a slight calorie surplus, consume 1.6-2.2g protein per kg bodyweight, lift heavy (6-12 reps), and get 7-9 hours sleep!",
    "protein": "Protein sources: Chicken breast, fish, eggs, Greek yogurt, protein shakes, lentils, and tofu. Aim for 0.8-1g per pound of bodyweight.",
    "workout": "A good workout split: Day 1: Chest/Triceps, Day 2: Back/Biceps, Day 3: Rest, Day 4: Shoulders, Day 5: Legs, Day 6: Full Body, Day 7: Rest.",
    "beginner": "Beginner tips: Start with 3 full-body workouts per week, focus on compound movements (squats, bench, deadlift), learn proper form, and be consistent!",
    "abs": "Ab exercises: Planks (3x60s), Crunches (3x20), Leg Raises (3x15), Russian Twists (3x20), and Mountain Climbers (3x20). Abs are made in the kitchen!",
};

async function generateApiResponse(aiChatBox) {
    const textElement = aiChatBox.querySelector(".text");
    
    try {
        // First, check if we have a pre-built response
        const lowerMessage = userMessage.toLowerCase();
        
        for (let keyword in FITNESS_RESPONSES) {
            if (lowerMessage.includes(keyword)) {
                textElement.innerText = FITNESS_RESPONSES[keyword];
                aiChatBox.querySelector(".loading").style.display = "none";
                chatContainer.scrollTop = chatContainer.scrollHeight;
                return;
            }
        }

        // If no pre-built response, try API
        const API_URL = "https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill";
        
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                inputs: userMessage,
                parameters: {
                    max_length: 150,
                    min_length: 20,
                    do_sample: true,
                    temperature: 0.7
                }
            })
        });

        const data = await response.json();
        console.log("API Response:", data);

        if (data.error) {
            // If model is loading, show helpful message
            if (data.error.includes("loading") || data.error.includes("currently loading")) {
                textElement.innerText = "⏳ AI is warming up (takes 20 seconds)... Meanwhile, try asking about: chest, back, diet, cardio, or workout tips!";
                setTimeout(() => {
                    aiChatBox.querySelector(".loading").style.display = "none";
                }, 2000);
                return;
            }
            
            throw new Error(data.error);
        }

        let apiResponse;
        
        // Handle response
        if (Array.isArray(data) && data.length > 0) {
            apiResponse = data[0].generated_text || data[0].summary_text;
        } else if (data.generated_text) {
            apiResponse = data.generated_text;
        } else {
            // Fallback to helpful message
            apiResponse = "I'm here to help with fitness questions! Ask me about chest, back, legs, cardio, diet, weight loss, or muscle gain!";
        }

        textElement.innerText = apiResponse;

    } catch (error) {
        console.error("Error:", error);
        // Provide helpful fallback message
        textElement.innerText = "💪 I can help with: Chest workouts, Back exercises, Leg day, Cardio tips, Diet advice, Weight loss, Muscle gain, and more! Try asking about these topics.";
    } finally {
        const loadingElement = aiChatBox.querySelector(".loading");
        if (loadingElement) {
            loadingElement.style.display = "none";
        }
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }
}

function createChatBox(html, className) {
    const div = document.createElement("div");
    div.classList.add(className);
    div.innerHTML = html;
    return div;
}

function showLoading() {
    const html = `<p class="text"></p>
    <img src="load.gif" class="loading" width="50px" alt="Loading...">`;
    let aiChatBox = createChatBox(html, "ai-chat-box");
    chatContainer.appendChild(aiChatBox);
    generateApiResponse(aiChatBox);
}

chatbtn.addEventListener("click", () => {
    userMessage = prompt.value.trim();
    
    // Check if message is not empty
    if (!userMessage) return;
    
    if (h1) h1.style.display = "none";
    
    const html = `<p class="text"></p>`;
    let userChatBox = createChatBox(html, "user-chat-box");
    userChatBox.querySelector(".text").innerText = userMessage;
    chatContainer.appendChild(userChatBox);
    
    // Auto scroll after user message
    chatContainer.scrollTop = chatContainer.scrollHeight;
    
    prompt.value = "";
    setTimeout(showLoading, 500);
});

// Allow Enter key to send message
prompt.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        chatbtn.click();
    }
});

chatbot.addEventListener("click", () => {
    chatbox.classList.toggle("active-chat-box");
    if(chatbox.classList.contains("active-chat-box")){
        chatbot.src = "cross.svg";
    } else {
        chatbot.src = "chatbot.svg";
    }
});

// Virtual Assistant

let ai = document.querySelector(".virtual-assistant img");
let speakpage = document.querySelector(".speak-page");
let content = document.querySelector(".speak-page h1");

function speak(text){
    let text_speak = new SpeechSynthesisUtterance(text);
    text_speak.rate = 1;
    text_speak.pitch = 1;
    text_speak.volume = 1;
    text_speak.lang = "en-US";
    window.speechSynthesis.speak(text_speak);
}

let speechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = new speechRecognition();

recognition.onresult = (event) => {
    speakpage.style.display = "none";
    let currentIndex = event.resultIndex;
    let transcript = event.results[currentIndex][0].transcript;
    content.innerText = transcript;
    takeCommand(transcript.toLowerCase());
}

function takeCommand(message){
    if(message.includes("open") && message.includes("chat")){
        speak("opening chatbot");
        chatbox.classList.add("active-chat-box");
    }
    else if(message.includes("close") && message.includes("chat")){
        speak("closing chatbot");
        chatbox.classList.remove("active-chat-box");
    }
    else if(message.includes("back")){
        speak("opening back Workout");
        window.open("back-W.html","_self");
    }
    else if(message.includes("chest")){
        speak("opening chest Workout");
        window.open("chest-W.html","_self");
    }
    else if(message.includes("biceps") || message.includes("triceps")){
        speak("opening biceps & triceps Workout");
        window.open("biceps-W.html","_self");
    }
    else if(message.includes("shoulder")){
        speak("opening shoulder Workout");
        window.open("shoulder-W.html","_self");
    }
    else if(message.includes("leg")){
        speak("opening leg Workout");
        window.open("leg-W.html","_self");
    }
    else if(message.includes("homepage") || message.includes("home page") || message.includes("main page")){
        speak("opening homepage");
        window.open("index.html","_self");
    }
    else if(message.includes("hello") || message.includes("hey")){
        speak("hello sir, what can i help you?");
    }
    else if(message.includes("who are you")){
        speak("I am a virtual assistant, created by Deepanjali Kumari");
    }
    else if(message.includes("open youtube")){
        speak("opening youtube...");
        window.open("https://www.youtube.com/");
    }
    else if(message.includes("open google")){
        speak("opening google");
        window.open("https://www.google.com/");
    }
    else if(message.includes("time")){
        let time = new Date().toLocaleTimeString(undefined, {hour:"numeric", minute:"numeric"});
        speak(time);
    }
    else if(message.includes("date")){
        let date = new Date().toLocaleDateString(undefined, {day:"numeric", month:"short"});
        speak(date);
    }
    else {
        let finalText = "This is what I found on internet regarding " + message.replace("shipra","");
        speak(finalText);
        window.open(`https://www.google.com/search?q=${message.replace("shipra","")}`, "_blank");
    }
}

ai.addEventListener("click", () => {
    recognition.start();
    speakpage.style.display = "flex";

});
