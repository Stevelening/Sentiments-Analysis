function loadDOM() {
    const usernameInput = document.getElementById("username-input");
    const setUsernameButton = document.getElementById("set-username-button");
    const recipientInput = document.getElementById("recipient-input");
    const messageInput = document.getElementById("message-input");
    const sendButton = document.getElementById("send-button");
    const chatBox = document.getElementById("chat-box");
    const logoutButton = document.getElementById("logout-button");
    const adminBututon = document.getElementById("administration");

    let username = getCookie("username"); // Try to get the username from the cookie
    let ws;

    // Check if there's a username cookie on page load
    if (username) {
        initializeWebSocket(username);
        fetchMessages(); // Fetch all messages for logged-in user
    }

    // Get cookie by name
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }

    // Set cookie
    function setCookie(name, value, days) {
        const d = new Date();
        d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = "expires=" + d.toUTCString();
        document.cookie = name + "=" + value + ";" + expires + ";path=/";
    }

    // Logout function
    function logout() {
        // Delete the username cookie
        document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
        if (ws) {
            ws.close();
        }
        username = null;

        document.getElementById("username-input-container").style.display = "flex";
        document.getElementById("recipient-input").style.display = "none";
        document.getElementById("message-input-container").style.display = "none";
        document.getElementById("logout-container").style.display = "none";

        chatBox.innerHTML = ''; // Clear chat on logout
    }

    // Initialize WebSocket connection with a username
    function initializeWebSocket(username) {
        ws = new WebSocket("ws://localhost:3000");

        ws.onopen = () => {
            // Send the username once connected
            ws.send(username);

            document.getElementById("username-input-container").style.display = "none";
            document.getElementById("recipient-input").style.display = "block";
            document.getElementById("message-input-container").style.display = "flex";
            document.getElementById("logout-container").style.display = "flex";
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data); // Parse the JSON data received from the server

            // Create a new message element
            const messageElement = document.createElement("div");
            messageElement.classList.add("message");

            // Check if the message is evaluated
            if (data.evaluated) {
                // If evaluated, show the toxicity level
                messageElement.innerHTML = `${data.sender}: ${data.message} <span class="evaluated">(Toxicity: ${data.toxicity})</span>`;
            } else {
                // If not evaluated, show the status as "Not Evaluated"
                messageElement.innerHTML = `${data.sender}: ${data.message} <span class="not-evaluated">(Not Evaluated)</span>`;
            }

            // Append the message to the chat box
            chatBox.appendChild(messageElement);

            // Scroll to the bottom of the chat box to show the new message
            chatBox.scrollTop = chatBox.scrollHeight;
        };
    }

    // Handle sending messages
    sendButton.onclick = () => {
        if (ws && recipientInput.value.trim() && messageInput.value.trim()) {
            const message = `${recipientInput.value.trim()}:${messageInput.value.trim()}`;
            ws.send(message);
            messageInput.value = ''; // Clear message input
        }
    };

    // Handle setting username
    setUsernameButton.onclick = () => {
        if (usernameInput.value.trim()) {
            username = usernameInput.value.trim();
            setCookie("username", username, 7); // Store username in cookies for 7 days
            initializeWebSocket(username);
        }
    };

    // Handle logout
    logoutButton.onclick = logout;

    // Handle administration
    adminBututon.onclick = () => {
        if(localStorage.getItem("adminUser") === "true"){
            window.location.href="admin.html";
        }
        else{
            window.location.href="login.html";
        }
    };

    // Fetch all messages for the logged-in user
    async function fetchMessages() {
        try {
            const response = await fetch(`/messages/${username}`);
            const messages = await response.json();

            // Clear the chat box before updating
            chatBox.innerHTML = '';

            // Display all messages
            messages.forEach((message) => {
                const messageElement = document.createElement("div");
                messageElement.classList.add("message");

                console.log(message)

                if (message.evaluated) {
                    messageElement.innerHTML = `${message.sender}: ${message.message} <span class="evaluated">(Toxicity: ${message.toxicity})</span>`;
                } else {
                    messageElement.innerHTML = `${message.sender}: ${message.message} <span class="not-evaluated">(Not Evaluated)</span>`;
                }

                if (message.sender == username) {
                    messageElement.style.textAlign = "right";
                }

                chatBox.appendChild(messageElement);
            });
            chatBox.scrollTop = chatBox.scrollHeight;
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    }

    // Refresh the chat every 1 second
    setInterval(fetchMessages, 1000); // Refresh every 1000 milliseconds (1 second)
}

// Fin du chargement du DOM
document.addEventListener('DOMContentLoaded', loadDOM);