function loadDOM() {
    const submitButton = document.getElementById("submit");
    const retourButton = document.getElementById("retourLogin");

    // Handle sumit login form
    submitButton.onclick = () => {
        const login = document.getElementById("login").value;
        const password = document.getElementById("password").value;
        
        fetch('/admin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ login, password }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // on conserve la session de l'admin
                localStorage.setItem("adminUser", "true");
                // on redirige vers la page admin
                window.location.href="admin.html";
            } else {
                alert("Identifiants incorrects");
            }
        })
        .catch(error => {
            console.error("Erreur lors de la connexion");
        });
    };

    retourButton.onclick = () => {
        window.location.href="index.html";
    }
}
// Fin du chargement du DOM
document.addEventListener('DOMContentLoaded', loadDOM);