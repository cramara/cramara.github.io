// Données des projets
const projects = [
    {
        title: "Projet 1",
        description: "Description du projet 1",
        image: "chemin/vers/image1.jpg",
        technologies: ["HTML", "CSS", "JavaScript"],
        github: "https://github.com/votre-username/projet1",
        demo: "https://demo-projet1.com"
    },
    // Ajoutez d'autres projets ici
];

// Fonction pour créer les cartes de projets
function createProjectCards() {
    const projectsGrid = document.querySelector('.projects-grid');
    
    projects.forEach(project => {
        const card = document.createElement('div');
        card.className = 'project-card';
        
        card.innerHTML = `
            <img src="${project.image}" alt="${project.title}">
            <div class="project-info">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <div class="technologies">
                    ${project.technologies.map(tech => `<span>${tech}</span>`).join('')}
                </div>
                <div class="project-links">
                    <a href="${project.github}" target="_blank">GitHub</a>
                    <a href="${project.demo}" target="_blank">Demo</a>
                </div>
            </div>
        `;
        
        projectsGrid.appendChild(card);
    });
}

// Appeler la fonction au chargement de la page
document.addEventListener('DOMContentLoaded', createProjectCards); 