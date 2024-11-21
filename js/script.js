// Données des projets
const projects = [
    {
        title: "Awale - Jeu en réseau",
        description: "Implémentation du jeu traditionnel Awale (ou Mancala) en version réseau, permettant aux joueurs de s'affronter en ligne avec un système de matchmaking, chat, et observation de parties.",
        technologies: ["C", "Sockets", "Makefile", "Multithreading"],
        features: [
            "Système de matchmaking",
            "Chat en temps réel",
            "Mode spectateur",
            "Gestion des profils joueurs",
            "Parties publiques/privées",
            "Interface console interactive"
        ],
        githubLink: "https://github.com/cramara/awale", // Ajoutez votre lien GitHub ici
        demoLink: null,  // Si vous avez une démo en ligne
        image: "assets/images/awale.png" // Ajoutez une image du projet
    },
    // Ajoutez d'autres projets ici
];

// Fonction pour créer les cartes de projets
function createProjectCard(project) {
    return `
        <article class="project-card">
            <div class="project-image">
                <img src="${project.image}" alt="${project.title}">
            </div>
            <div class="project-content">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <div class="technologies">
                    ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
                <div class="project-features">
                    <h4>Fonctionnalités principales :</h4>
                    <ul>
                        ${project.features.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                </div>
                <div class="project-links">
                    ${project.githubLink ? `<a href="${project.githubLink}" class="btn" target="_blank"><i class="fab fa-github"></i> Code source</a>` : ''}
                    ${project.demoLink ? `<a href="${project.demoLink}" class="btn" target="_blank"><i class="fas fa-external-link-alt"></i> Démo</a>` : ''}
                </div>
            </div>
        </article>
    `;
}

// Appeler la fonction au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    // Affichage des projets
    const projectsGrid = document.querySelector('.projects-grid');
    if (projectsGrid) {
        projectsGrid.innerHTML = projects.map(project => createProjectCard(project)).join('');
    }
}); 