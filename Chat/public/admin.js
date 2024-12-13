function loadDOM() {
    const retour = document.getElementById("retourAdmin");
    const logout = document.getElementById("logoutAdmin");

    // Handle retour
    retour.onclick = () => {
        window.location.href="index.html";
    };

    // Handle logout
    logout.onclick = () => {
        localStorage.setItem("adminUser", "false");
        window.location.href="index.html";
    };
}
// Fin du chargement du DOM
document.addEventListener('DOMContentLoaded', loadDOM);