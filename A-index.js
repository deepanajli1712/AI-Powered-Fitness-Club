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

// Chat-Bot

let prompt = document.querySelector(".prompt")
let chatbtn = document.querySelector(".input-area button")
let chatContainer = document.querySelector(".chat-container")
let userMessage = "";

let Api_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyBLxX85FWeko5pn8MBIj7f2nMrndd5mL_0"

async function generateApiResponse(aiChatBox) {
    const textElement = aiChatBox.querySelector(".text")
    try {
        const response = await fetch(Api_url, {
            method: "POST",
            header: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{
                    "role": "user",
                    "parts": [{ text: `${userMessage} in 10 words` }]
                }]
            })
        })
        const data = await response.json()
        const apiResponse = data?.candidates[0].content.parts[0].text.trim();
        textElement.innerText = apiResponse
    }
    catch (error) {
        console.log(error)
    }
    finally {
        aiChatBox.querySelector(".loading").style.display = "none"
    }

}

function createChatBox(html, className) {
    const div = document.createElement("div")
    div.classList.add(className)
    div.innerHTML = html;
    return div
}

function showLoading() {
    const html = `<p class="text"></p>
    <img src="load.gif" class="loading" width="50px">`
    let aiChatBox = createChatBox(html, "ai-chat-box")
    chatContainer.appendChild(aiChatBox)
    generateApiResponse(aiChatBox)
}

chatbtn.addEventListener("click", () => {
    h1.style.display="none"
    userMessage = prompt.value;
    const html = `<p class="text"></p>`
    let userChatBox = createChatBox(html, "user-chat-box")
    userChatBox.querySelector(".text").innerText = userMessage
    chatContainer.appendChild(userChatBox)
    prompt.value = ""
    setTimeout(showLoading, 500)

})
chatbot.addEventListener("click", () => {
    chatbox.classList.toggle("active-chat-box")
    if(chatbox.classList.contains("active-chat-box")){
        chatbot.src="cross.svg"
    }
    else{
        chatbot.src="chatbot.svg"
    }
    

})

// virtual Assistant

let ai=document.querySelector(".virtual-assistant img")
let speakpage=document.querySelector(".speak-page")
let content=document.querySelector(".speak-page h1")


function speak(text){
    let text_speak=new SpeechSynthesisUtterance(text)
    text_speak.rate=1
    text_speak.pitch=1
    text_speak.volume=1
    text_speak.lang="en-US"
    window.speechSynthesis.speak(text_speak)
}

let speechRecognition= window.SpeechRecognition || window.webkitSpeechRecognition
let recognition=new speechRecognition()
recognition.onresult=(event)=>{
    speakpage.style.display="none"
    let currentIndex=event.resultIndex
    let transcript=event.results[currentIndex][0].transcript
    content.innerText=transcript
    takeCommand(transcript.toLowerCase())
}
function takeCommand(message){
    if(message.includes("open") && message.includes("chat") ){
        speak("ok mam")
        chatbox.classList.add("active-chat-box")
    }
    else if(message.includes("close") && message.includes("chat")){
        speak("ok mam")
        chatbox.classList.remove("active-chat-box")
    }
    else if(message.includes("back") ){
        speak("ok mam")
        window.open("http://127.0.0.1:5500/back-W.html","_self")
    }
    else if(message.includes("chest") ){
        speak("ok mam")
        window.open("http://127.0.0.1:5500/chest-W.html","_self")
    }
    else if(message.includes("biceps") || message.includes("triceps") ) {
        speak("ok mam")
        window.open("http://127.0.0.1:5500/biceps-W.html","_self")
    }
    else if(message.includes("shoulder") ){
        speak("ok mam")
        window.open("http://127.0.0.1:5500/shoulder-W.html","_self")
    }
    else if(message.includes("leg") ){
        speak("ok mam")
        window.open("http://127.0.0.1:5500/leg-W.html","_self")
    }
    else if(message.includes("go to homepage") ){
        speak("ok mam")
        window.open("http://127.0.0.1:5500/A-index.html","_self")
    }
    else if(message.includes("hello") || message.includes("hey")){
        speak("hello sir,what can i help you?")
    }
    else if(message.includes("who are you") ){
        speak("I am a virtual assistant, created by Deepanjali Kumari")
    }
    else if(message.includes("open youtube") ){
        speak("opening youtube...")
        window.open("https://www.youtube.com/", "_blank")
    }
    else if(message.includes("Google") ){
        speak("opening google")
        window.open("https://www.google.com/","_blank")
    }
    else if(message.includes("time") ){
        let time=new Date().toLocaleTimeString(undefined,{hour:"numeric",minute:"numeric"})
        speak(time)
    }
    else if(message.includes("date") ){
        let date=new Date().toLocaleTimeString(undefined,{day:"numeric",month:"short"})
        speak(date)
    }
    else{
        let finalText="This is what I founf on internet regarding"+ message.replace("shipra","") || message.replace("shipra","")
        speak(finalText)
        window.open(`https://www.google.com/search?q=${message.replace("shipra",""),"_blank"}`)
        
    }

    }
    


ai.addEventListener("click",()=>{
    recognition.start()
    speakpage.style.display="flex"
        // speakpage.classList.add("active-speak-page")
    })
    