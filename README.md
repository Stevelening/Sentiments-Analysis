# Sentiments-Analysis
Projet de développement d´un modèle d´intelligence artificielle permettant d´évaluer automatiquement les messages pour la détection de messages toxiques dans un WebChat.


## Auteurs :
- Lazzari Vinicius
- Lening Steve
- Masi Alessio
- Theubo Ghislain


## Rendu du projet
- Le code d'entrainement : c´est le fichier `Modele/Model_classification_training.ipynb`
- Un exécutable de la démo : c´est tout ce dossier. Vous trouverez dans la suite de ce fichier ou dans le rapport partie VII.3. comment lancer l´application.
- Les poids du ou des réseau utilisés : ???
- Un pdf qui résume vos trois précédents rapports : c´est le fichier `Rapports/rapport_final.pdf`


## Structure du repository :
1. **Chat** contient l'essentiel de l'application web.
2. **Modele** contient le modele d'IA que nous utilisons et le code utilisé pour l´entrainement du modèle.
3. **Rapports** contient tous les rapports aux formats word et pdf.


## Lancer l´Application web :
1. Architecture du chat :
- Frontend : html5, css3 et javascript
- Backend : express
- BD : SQLite3

2. Comment lancer l'application Chat :
- Dams un terminal, se deplacer dans `Chat` en exécutant la commande `cd Chat`
- Executer la commande `npm install` pour installer les dependances necessaires
- Executer la commande `node index.js` pour lancer le serveur express. Si tout ce passe bien, vous verez apparaître le message `Server running at http://localhost:3000` dans votre terminal.
- Dans le navigateur, aller à l´adresse `http://localhost:3000`.
- Vous pouvez maintenant utiliser le Chat sous reserve de lancer le serveur python.

3. Lancer le serveur python qui permet d´evaluer les messages :
- Télécharger le dossier `model_save` via le lien [model_save](https://drive.google.com/drive/folders/13rzgQqhpOP6GMd-pG7DhsIygs12YgohV?usp=drive_link) et le mettre dans le dossier `Modele`. Attention : lorsque vous téléchargez le dossier, vous obtenez une archive qui une fois décompréssée ne donne pas le dossier directement, mais un dossier qui contient le bon dossier. C´est le dossier le plus profond de la hierarchie (celui qui contient directement les fichiers) qu´il faut mettre dans le dossier `Modele` parce que le code source du serveur (server.py) esseyera d´accéder à des fichiers qui se trouvent à l´adresse `./model_save/nom_fichier`.
- Dans une autre fenêtre du terminal, se deplacer dans `Modele` avec la commande `cd Modele` .
- Installer les dependances avec la commande `pip install -r requirements.txt` .
- Lancer le serveur avec la commande `python3 server.py` .

## Rapport final
Pour accéder au rapport, il suffit de double-cliquer sur le fichier `rapport_final.pdf` qui se trouve dans le dossier `Rapports` .