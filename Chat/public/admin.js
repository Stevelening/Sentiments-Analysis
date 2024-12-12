function loadDOM() {
    const retour = document.getElementById("retourAdmin");

    // Handle retour
    retour.onclick = () => {
        window.location.href="index.html";
    };
}
// Fin du chargement du DOM
document.addEventListener('DOMContentLoaded', loadDOM);