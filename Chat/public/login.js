function loadDOM() {
    const submitButton = document.getElementById("submit");

    // Handle sumit login form
    submitButton.onclick = () => {
        const login = document.getElementById("login");
        const password = document.getElementById("password");
        if(login.value === "login" && password.value === "password"){
            // on conserve la session de l'admin
            localStorage.setItem("adminUser", true);
            // on redirige vers la page admin
            window.location.href="admin.html";
            // admin doit contenir un bouton retour pour revenir a la 
            // page du chat et un bouton logout qui va faire passer 
            // adminUser a false.
        }
        else{
            alert("Identifiants incorrects");
        }
    };
}
// Fin du chargement du DOM
document.addEventListener('DOMContentLoaded', loadDOM);