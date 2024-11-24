// Données des projets
const projects = [
    {
        title_key: "awale_title",
        description_key: "awale_description",
        technologies: ["tech_c", "tech_sockets", "tech_makefile", "tech_multithreading"],
        features: [
            "awale_feature1",
            "awale_feature2",
            "awale_feature3",
            "awale_feature4",
            "awale_feature5"
        ],
        githubLink: "https://github.com/cramara/awale",
        demoLink: null,
        images: [
            "assets/images/awale/awale.png"
        ],
        private: false
    },
    {
        title_key: "gcu_title",
        description_key: "gcu_description",
        technologies: ["tech_react", "tech_nodejs", "tech_plsql", "tech_devops"],
        features: [
            "gcu_feature1",
            "gcu_feature2",
            "gcu_feature3",
            "gcu_feature4",
            "gcu_feature5"
        ],
        githubLink: "https://github.com/cramara/awale",
        demoLink: null,
        images: [
            "assets/images/gcu/dashboard.png",
            "assets/images/gcu/home.png",
            "assets/images/gcu/stats.png",
            "assets/images/gcu/var.png",
            "assets/images/gcu/fiche.png"
        ],
        private: true
    },
    {
        title_key: "spie_title",
        description_key: "spie_description",
        technologies: ["tech_figma", "tech_project_management", "tech_team"],
        features: [
            "spie_feature1",
            "spie_feature2",
            "spie_feature3",
            "spie_feature4",
            "spie_feature5"
        ],
        githubLink: "https://github.com/cramara/awale",
        demoLink: null,
        images: [
            "assets/images/spie/chef.svg",
            "assets/images/spie/dashboard.svg",
            "assets/images/spie/equipe.svg",
            "assets/images/spie/stats.svg"
        ],
        private: true
    },
    {
        title_key: "snake_title",
        description_key: "snake_description",
        technologies: ["tech_python", "tech_graphs", "tech_tkinter"],
        features: [
            "snake_feature1",
            "snake_feature2",
            "snake_feature3",
            "snake_feature4"
        ],
        githubLink: "https://github.com/cramara/Snake_duo",
        demoLink: null,
        images: [
            "assets/images/snake/menu.png",
            "assets/images/snake/partie.png",
            "assets/images/snake/debut.png",
            "assets/images/snake/fin_2.png"
        ],
        private: false
    }
];

// Fonction pour créer les cartes de projets
function createProjectCard(project) {
    const currentLang = localStorage.getItem('preferred_language') || 'fr';
    const t = translations[currentLang];

    const imagesHtml = project.images.map((img, index) => `
        <div class="carousel-item ${index === 0 ? 'active' : ''}">
            <img src="${img}" alt="${t[project.title_key]} - image ${index + 1}">
        </div>
    `).join('');

    return `
        <article class="project-card ${project.private ? 'private' : ''}">
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
                <h3>${t[project.title_key]}</h3>
                <p>${t[project.description_key]}</p>
                <div class="technologies">
                    ${project.technologies.map(tech => `<span class="tech-tag">${t[tech]}</span>`).join('')}
                </div>
                <div class="project-features">
                    <h4>${t.project_features}</h4>
                    <ul>
                        ${project.features.map(feature => `<li>${t[feature]}</li>`).join('')}
                    </ul>
                </div>
                <div class="project-links">
                    ${project.githubLink && !project.private ? 
                        `<a href="${project.githubLink}" class="btn" target="_blank"><i class="fab fa-github"></i> ${t.source_code}</a>` 
                        : project.private ? 
                        `<div class="tooltip-container">
                            <span class="btn disabled"><i class="fab fa-github"></i> ${t.source_code}</span>
                            <span class="tooltip-text">${t.private_source}</span>
                        </div>`
                        : ''
                    }
                    ${project.demoLink ? `<a href="${project.demoLink}" class="btn" target="_blank"><i class="fas fa-external-link-alt"></i> ${t.demo}</a>` : ''}
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