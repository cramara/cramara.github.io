// Données des projets
const projects = [
    {
        title: "Awale - Jeu en réseau",
        description: "Implémentation du jeu traditionnel Awale (ou Mancala) en version réseau, permettant aux joueurs de s'affronter en ligne avec un système de matchmaking, chat, et observation de parties.",
        technologies: ["C", "Sockets", "Makefile", "Multithreading"],
        features: [
            "Chat en temps réel",
            "Mode spectateur",
            "Gestion des profils joueurs",
            "Parties publiques/privées",
            "Interface console interactive"
        ],
        githubLink: "https://github.com/cramara/awale",
        demoLink: null,
        images: [
            "assets/images/awale/awale.png"
        ]
    },
    {
        title: "Développement d'une application de déclaration des horaires",
        description: "En collaboration avec la junior entreprise de l'INSA de Lyon (ETIC), nous avons développé une application de déclaration des horaires pour un département de l'école.",
        technologies: ["React", "Node.js", "PL/SQL", "Devops"],
        features: [
            "Dashboard des repatition des heures par matière",
            "Vue globale des horaires par enseignant",
            "Replissage des horaires partagés entre les responsables et les professeurs",
            "Import / Export des données",
            "Gestion des rôles utilisateurs"
        ],
        githubLink: "https://github.com/cramara/awale",
        demoLink: null,
        images: [
            "assets/images/gcu/dashboard.png",
            "assets/images/gcu/home.png",
            "assets/images/gcu/stats.png",
            "assets/images/gcu/var.png",
            "assets/images/gcu/fiche.png"
        ]
    },
    {
        title: "Conception d'un outil de gestion",
        description: "Lors d'un cours de conception d'outils de gestion, nous avons simuler un projet d'amélioration des processus de maintenance pour l'entreprise SPIE. " +
        "Nous avons choisi de créer un outil de gestion des maintenance pour l'entreprise SPIE.",
        technologies: ["Figma", "Gestion de projet", "Team"],
        features: [
            "Formulaire pour récupérer les informations des techniciens",
            "Différents Dashboard pour les différents rôles de l'entreprise",
            "Amélioration des processus existants au sein de l'entreprise",
            "Redaction de documents de gestion de projet (dossier de cadrage, fiches de suivis, etc.)",
            "Présentation orale devant un jury"
        ],
        githubLink: "https://github.com/cramara/awale",
        demoLink: null,
        images: [
            "assets/images/spie/chef.svg",
            "assets/images/spie/dashboard.svg",
            "assets/images/spie/equipe.svg",
            "assets/images/spie/stats.svg"
        ]
    },
    
    // Ajoutez d'autres projets ici
];

// Fonction pour créer les cartes de projets
function createProjectCard(project) {
    const imagesHtml = project.images.map((img, index) => `
        <div class="carousel-item ${index === 0 ? 'active' : ''}">
            <img src="${img}" alt="${project.title} - image ${index + 1}">
        </div>
    `).join('');

    return `
        <article class="project-card">
            <div class="project-carousel">
                <div class="carousel-container">
                    ${imagesHtml}
                </div>
                ${project.images.length > 1 ? `
                    <button class="carousel-btn prev" onclick="moveCarousel(this, -1)">❮</button>
                    <button class="carousel-btn next" onclick="moveCarousel(this, 1)">❯</button>
                    <div class="carousel-dots">
                        ${project.images.map((_, index) => `
                            <span class="dot ${index === 0 ? 'active' : ''}" onclick="setCarouselSlide(this, ${index})"></span>
                        `).join('')}
                    </div>
                ` : ''}
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

// Ajouter les fonctions de contrôle du carrousel
function moveCarousel(btn, direction) {
    const carousel = btn.closest('.project-carousel');
    const container = carousel.querySelector('.carousel-container');
    const items = container.querySelectorAll('.carousel-item');
    const dots = carousel.querySelectorAll('.dot');
    
    let activeIndex = Array.from(items).findIndex(item => item.classList.contains('active'));
    let newIndex = activeIndex + direction;

    if (newIndex >= items.length) newIndex = 0;
    if (newIndex < 0) newIndex = items.length - 1;

    items[activeIndex].classList.remove('active');
    items[newIndex].classList.add('active');
    
    dots[activeIndex].classList.remove('active');
    dots[newIndex].classList.add('active');
}

function setCarouselSlide(dot, index) {
    const carousel = dot.closest('.project-carousel');
    const container = carousel.querySelector('.carousel-container');
    const items = container.querySelectorAll('.carousel-item');
    const dots = carousel.querySelectorAll('.dot');
    
    items.forEach(item => item.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    items[index].classList.add('active');
    dots[index].classList.add('active');
} 