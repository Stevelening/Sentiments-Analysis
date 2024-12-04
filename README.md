# Sentiments-Analysis
Projet d'analyse de sentiments pour la détection de messages haineux dans une conversation.


## Auteurs :
- Lazzari Vinicius
- Lening Steve
- Masi Alessio
- Theubo Ghislain


## Structure du repository :
1. **Chat** contient l'essentiel de l'application web
2. **Modele** contient le modele d'IA que nous utilisons
3. **Rapports** contient tous les rapports aux formats word et pdf


## I - Application web :
1. Architecture du chat :
- Frontend : html, css et javascript
- Backend : express
- BD : SQLite3

2. Comment lancer l'application :
- Se deplacer dans Chat en exécutant la commande `cd Chat`
- Executer la commande `npm install` pour installer les dependances necessaires
- Executer la commande `node index.js` pour lancer le serveur express. Si tout ce passe bien, vous verez apparaître le message `Server running at http://localhost:3000` dans votre terminal.
- Dans le navigateur, aller à l´adresse `http://localhost:3000`.
- Vous pouvez maintenant utiliser le Chat.
