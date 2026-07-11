// for unique id of each conversation
let conversationId = Date.now();
// conversation function take input from user give it to flask take ai response and show to chat
function sendMessage(){
// for unique id of every message
let messageId = Date.now();

    let input = document.getElementById("userInput");
    
    let message = input.value;


    if(message.trim() === ""){
        return;
    }

document.getElementById("suggestions").style.display = "none";

    let chat = document.getElementById("messages");

chat.innerHTML += `
<div class="text-end mb-3" id="user-${messageId}">
    <small class="text-muted d-block mb-1">You</small>
    <div class="d-inline-block bg-primary text-white rounded-4 px-3 py-2 shadow-sm">
        ${message}
    </div>
</div>
`;
// AI typing indicator
chat.innerHTML += `
<div class="text-start mb-3" id="typing">
    <small class="text-muted d-block mb-1">AI Assistant</small>
    <div class="d-inline-block bg-light border rounded-4 px-3 py-2 shadow-sm">
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
    </div>
</div>
`;

chat.scrollTop = chat.scrollHeight;

    fetch("/chat", {

        method: "POST",

        headers:{
            "Content-Type":"application/json"
        },

        body: JSON.stringify({
            message: message
        })

    })

    


    .then(response => response.json())


    .then(data => {
setTimeout(() => {

        const typing = document.getElementById("typing");
        if (typing) typing.remove();

        chat.innerHTML += `
        <div class="text-start mb-3" id="bot-${messageId}">
            <small class="text-muted d-block mb-1">AI Assistant</small>
            <div class="d-inline-block bg-light border rounded-4 px-3 py-2 shadow-sm">
                ${data.reply}
            </div>
        </div>
        `;

    }, 1000);
// Get old chats
let chats = JSON.parse(localStorage.getItem("chats")) || [];

// Add current conversation
chats.push({
    conversationId: conversationId,
    id: messageId,
    user: message,
    bot: data.reply
});

// Save back to localStorage
localStorage.setItem("chats", JSON.stringify(chats));
chat.scrollTop = chat.scrollHeight;
    })


    .catch(error => {

       let typing = document.getElementById("typing");
    if (typing) typing.remove();

    chat.innerHTML += `
    <div class="text-danger">
        Error! Unable to connect.
    </div>
    `;

    console.log(error);


    });


    input.value="";

}

let input = document.getElementById("userInput");
 input.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            sendMessage();
        }
    });
    
   
function sendPredefined(question){

    document.getElementById("userInput").value = question;

    sendMessage();
}
document.getElementById("newchat").addEventListener("click", function(event){
event.preventDefault();
    conversationId = Date.now();   // New conversation
        

document.getElementById("messages").innerHTML = "";
document.getElementById("userInput").value = "";
});
document.getElementById("searchChats").addEventListener("click", function(event){

    event.preventDefault();

    let searchBox = document.getElementById("searchBox");
    let searchResults = document.getElementById("searchResults");
    let searchInput = document.getElementById("searchInput");

    if(searchBox.style.display === "block"){

        searchBox.style.display = "none";
        searchInput.value = "";
        searchResults.innerHTML = "";

    }else{

        searchBox.style.display = "block";
        searchInput.focus();

    }

});// Search while typing
document.getElementById("searchInput").addEventListener("input", function () {

    let keyword = this.value.toLowerCase();

    let chats = JSON.parse(localStorage.getItem("chats")) || [];

    let results = document.getElementById("searchResults");

    results.innerHTML = "";

    chats.forEach(function(chat){

        if(
            chat.user.toLowerCase().includes(keyword) ||
            chat.bot.toLowerCase().includes(keyword)
        ){

           results.innerHTML += `
<div class="card mb-2 shadow-sm search-result"
     data-conversation="${chat.conversationId}"
     data-message="${chat.id}"
     style="cursor:pointer;">

    <div class="card-body">
        <strong>You:</strong> ${chat.user}<br>
        <strong>AI:</strong> ${chat.bot}
    </div>

</div>
`;
        }

    });

});
document.getElementById("searchResults").addEventListener("click", function(e){

    let card = e.target.closest(".search-result");

    if(!card) return;

    let conversationId = card.dataset.conversation;
    let messageId = card.dataset.message;

    loadConversation(conversationId);

    setTimeout(function(){

        let target = document.getElementById("user-" + messageId);

        console.log(target);   // debugging

        if(target){
            target.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        }

    }, 100);

    document.getElementById("searchBox").style.display = "none";
    document.getElementById("searchInput").value = "";
    document.getElementById("searchResults").innerHTML = "";

});
function loadConversation(conversationId){

    let chats = JSON.parse(localStorage.getItem("chats")) || [];

    let messages = document.getElementById("messages");

    messages.innerHTML = "";

    chats
        .filter(chat => chat.conversationId == conversationId)
        .forEach(chat => {

            messages.innerHTML += `
<div class="text-end mb-3" id="user-${chat.id}">
    <small class="text-muted d-block mb-1">You</small>
    <div class="d-inline-block bg-primary text-white rounded-4 px-3 py-2 shadow-sm">
        ${chat.user}
    </div>
</div>

<div class="text-start mb-3" id="bot-${chat.id}">
    <small class="text-muted d-block mb-1">AI Assistant</small>
    <div class="d-inline-block bg-light border rounded-4 px-3 py-2 shadow-sm">
        ${chat.bot}
    </div>
</div>
`;
        });

    // messages.scrollTop = messages.scrollHeight;
}

function loadHistory(){

    let chats = JSON.parse(localStorage.getItem("chats")) || [];

    let historyPanel = document.getElementById("historyPanel");

    historyPanel.innerHTML = "";

    let shownConversations = [];

    chats.forEach(function(chat){

        if(!shownConversations.includes(chat.conversationId)){

            shownConversations.push(chat.conversationId);

            historyPanel.innerHTML += `
                <div class="card mb-2 history-item"
                     data-conversation="${chat.conversationId}"
                     style="cursor:pointer;">

                    <div class="card-body">
                        ${chat.user}
                    </div>

                </div>
            `;

        }

    });

}
document.getElementById("history").addEventListener("click", function(e){

    e.preventDefault();

    loadHistory();

    let panel = document.getElementById("historyPanel");

    if(panel.style.display == "none"){
        panel.style.display = "block";
    }else{
        panel.style.display = "none";
    }

});
document.getElementById("historyPanel").addEventListener("click", function(e){

    let item = e.target.closest(".history-item");

    if(!item) return;

    let conversationId = item.dataset.conversation;

    loadConversation(conversationId);

    document.getElementById("historyPanel").style.display = "none";

});

document.getElementById("settings").addEventListener("click", function(e){

    e.preventDefault();
    console.log("Settings Clicked");

    let panel = document.getElementById("settingsPanel");
        


    if(panel.style.display === "block"){
        panel.style.display = "none";
    }else{
        panel.style.display = "block";
    }

});
document.getElementById("toggleTheme").addEventListener("click", function(){

    document.body.classList.toggle("dark-mode");

});
document.getElementById("clearHistory").addEventListener("click", function(){

    if(confirm("Are you sure you want to delete all chat history?")){

        localStorage.removeItem("chats");

        document.getElementById("messages").innerHTML = "";
        document.getElementById("historyPanel").innerHTML = "";

        alert("History cleared successfully.");

    }

});

