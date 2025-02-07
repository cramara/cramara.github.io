Pour deploy :
npm run build
npm run deploy

Pour tester en local sur mobile

 live-server --host=192.168.1.60 --port=8000


 idée contact : 
 Raisonné de la personnalisation de la page contact pendant 4 secondes
Pour ce projet, tu pourrais utiliser JavaScript (ou jQuery) pour manipuler l'input utilisateur en temps réel. Par exemple, tu peux créer une fonction d'animation qui fait défiler l’écriture rapide des informations de contact. Lorsque l'utilisateur commence à taper, le texte pourrait être ajouté dynamiquement sur l'écran à l'aide de setInterval() ou requestAnimationFrame() pour simuler le mouvement de la machine à écrire. Tu pourrais utiliser une bibliothèque comme GSAP pour une animation plus fluide et élégante.

Pistes pour réaliser ce projet :

Animation de machine à écrire : Créer un container HTML pour simuler le papier. Utiliser CSS pour l'animation de la machine à écrire, ou implémenter un effet avec JavaScript.
Saisie utilisateur : Capter l'entrée avec un eventListener en JavaScript sur l'événement "input". Mettre à jour dynamiquement le texte affiché.
Bibliothèque optionnelle : Utiliser la bibliothèque Typed.js pour simuler l’animation dactylographiée, mais moins flexible pour l'entrée dynamique.
Effet retour à la ligne : Utiliser une transition CSS pour un effet fluide de retour à la ligne.
Quelques pistes :

Structure HTML/CSS :

Créez un conteneur type « feuille » (div) stylisé pour imiter du papier.
Ajoutez un curseur clignotant avec une animation CSS.
Animation de texte préchargé :

Utilisez JavaScript (setInterval/setTimeout) ou une bibliothèque comme Typed.js pour afficher lettre par lettre vos infos de contact.
Synchronisez l'animation pour imiter une frappe rapide.
Interaction utilisateur :

Ajoutez un écouteur d’événement sur le clavier (keydown ou input).
À chaque touche, insérez dynamiquement le caractère dans une nouvelle ligne sous le texte préchargé.
Effets supplémentaires :

Intégrez un effet de défilement ou de "retour à la ligne" pour simuler la machine à écrire qui avance sur la page.
Pensez à ajouter des sons de frappe pour renforcer l'immersion (optionnel).
Ces pistes devraient vous aider à démarrer.