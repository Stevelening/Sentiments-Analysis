function loadDOM() {
    const retour = document.getElementById("retourAdmin");
    const logout = document.getElementById("logoutAdmin");
    const tableBody = document.getElementById("suspectMessages");

    // Handle retour
    retour.onclick = () => {
        window.location.href = "index.html";
    };

    // Handle logout
    logout.onclick = () => {
        localStorage.setItem("adminUser", "false");
        window.location.href = "index.html";
    };

    // Fill the table and refresh every 1 second
    fillTable(tableBody);
    //setInterval(() => fillTable(tableBody), 1000);
}

async function fillTable(tableBody) {
    try {
        const response = await fetch(`/evaluated-messages`);
        const messages = await response.json();

        if(messages.length > 0){
            // Clear the table before updating
            tableBody.innerHTML = '';

            // Display all suspect messages (toxicity >= 0.5)
            messages.forEach((message) => {
                if(message.toxicity >= 0.5){
                    const tr = document.createElement("tr");
                    //console.log(message)

                    const name = document.createElement("td");
                    const msg = document.createElement("td");
                    const harassment = document.createElement("td");

                    name.innerHTML = `${message.sender}`;
                    msg.innerHTML = `${message.message}`;
                    harassment.innerHTML = `${message.toxicity}`;
                    
                    tr.appendChild(name);
                    tr.appendChild(msg);
                    tr.appendChild(harassment);

                    tableBody.appendChild(tr);
                }
            });
            tableBody.scrollTop = tableBody.scrollHeight;
        }
    } catch (error) {
        console.error("Error filling table:", error);
    }
}

// Fin du chargement du DOM
document.addEventListener('DOMContentLoaded', loadDOM);