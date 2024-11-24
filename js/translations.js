const translations = {
    fr: {
        // Navigation
        nav_home: "Accueil",
        nav_projects: "Projets",
        nav_about: "À propos",
        nav_contact: "Contact",
        
        // Index page
        welcome: "Bienvenue sur mon portfolio",
        my_projects: "Mes Projets",
        about_me: "À propos de moi",
        about_link: "Pour en savoir plus sur mon parcours, cliquez ici",
        
        // About page
        about_title: "À propos",
        student_title: "Étudiant ingénieur informatique à l'INSA Lyon",
        internship_search: "À la recherche d'un stage dans le domaine de l'architecture des processeurs d'une durée de 3 mois de juin à août 2025",
        profile_title: "Profil",
        profile_text1: "Passionné par l'informatique, je souhaite mettre mes connaissances à profit afin de contribuer à un avenir meilleur.",
        profile_text2: "Participant de sports d'équipe tels que le handball et le basketball, le travail d'équipe m'encourage à me dépasser.",
        profile_text3: "Curieux et avide d'apprendre, les challenges sont pour moi une source de motivation.",
        
        // Formation
        education_title: "Formation",
        education_insa_current: "Élève en 4e année au département informatique",
        education_insa_prep: "Classe préparatoire intégrée à l'INSA de Lyon",
        education_bac: "Baccalauréat mention très bien",
        
        // Compétences
        skills_title: "Compétences",
        skills_languages: "Langages",
        skills_tools: "Outils",
        
        // Langues
        languages_title: "Langues",
        french: "Français",
        english: "Anglais",
        spanish: "Espagnol",
        french_level: "Langue maternelle",
        english_level: "Niveau B2",
        spanish_level: "Niveau B1",
        
        // Contact page
        contact_title: "Contact",
        my_coordinates: "Mes Coordonnées",
        copy_tooltip: "Copier dans le presse-papier",
        drivers_license: "Permis B",
        
        // Footer
        copyright: "Tous droits réservés",
        
        // Hero page
        hero_description: "Étudiant en informatique passionné par l'architecture des processeurs",
        view_projects: "Voir mes projets",
        learn_more: "En savoir plus",
        projects_description: "Découvrez mes réalisations",
        about_description: "Mon parcours et mes compétences",
        contact_description: "Prenez contact avec moi",
        download_cv: "Mon CV",
        
        // Expériences
        experience_title: "Expériences",
        experience_gcu_title: "Développement d'une app de gestion",
        experience_gcu_detail1: "Projet de Junior Entreprise (ETIC)",
        experience_gcu_detail2: "Travail en équipe / Relation client",
        experience_gcu_detail3: "Développement web (React / Node.js)",
        
        experience_inria_title: "Stage de recherche en bioinformatique",
        experience_inria_detail1: "Découverte de la recherche",
        experience_inria_detail2: "Apprentissage du calcul sur GPU avec CUDA",
        experience_inria_detail3: "Benchmark CPU et GPU",
        
        experience_module_title: "Projet d'un module d'assistance au déplacement",
        experience_module_detail1: "Programmation embarquée (IoT)",
        experience_module_detail2: "Réseau",
        experience_module_detail3: "Traitement de données (Python / R)",
        
        experience_ineo_title: "Stage en bureau d'étude",
        experience_ineo_detail1: "Découverte du monde de l'entreprise",
        experience_ineo_detail2: "Étude de conception",
    },
    en: {
        // Navigation
        nav_home: "Home",
        nav_projects: "Projects",
        nav_about: "About",
        nav_contact: "Contact",
        
        // Index page
        welcome: "Welcome to my portfolio",
        my_projects: "My Projects",
        about_me: "About me",
        about_link: "To learn more about my background, click here",
        
        // About page
        about_title: "About",
        student_title: "Computer Science Engineering Student at INSA Lyon",
        internship_search: "Looking for a 3-month internship in processor architecture from June to August 2025",
        profile_title: "Profile",
        profile_text1: "Passionate about computer science, I aim to use my knowledge to contribute to a better future.",
        profile_text2: "Playing team sports such as handball and basketball has taught me the value of teamwork and pushing my limits.",
        profile_text3: "Curious and eager to learn, I see challenges as opportunities for growth.",
        
        // Formation
        education_title: "Education",
        education_insa_current: "4th year student in Computer Science Department",
        education_insa_prep: "Integrated preparatory class at INSA Lyon",
        education_bac: "High School Diploma with highest honors",
        
        // Compétences
        skills_title: "Skills",
        skills_languages: "Programming Languages",
        skills_tools: "Tools",
        
        // Langues
        languages_title: "Languages",
        french: "French",
        english: "English",
        spanish: "Spanish",
        french_level: "Native",
        english_level: "B2 Level",
        spanish_level: "B1 Level",
        
        // Contact page
        contact_title: "Contact",
        my_coordinates: "Contact Information",
        copy_tooltip: "Copy to clipboard",
        drivers_license: "Driving License",
        
        // Footer
        copyright: "All rights reserved",
        
        // Hero page
        hero_description: "Computer Science student passionate about processor architecture",
        view_projects: "View my projects",
        learn_more: "Learn more",
        projects_description: "Discover my work",
        about_description: "My background and skills",
        contact_description: "Get in touch",
        download_cv: "My CV",
        
        // Experiences
        experience_title: "Experiences",
        experience_gcu_title: "Management App Development",
        experience_gcu_detail1: "Junior Enterprise Project (ETIC)",
        experience_gcu_detail2: "Teamwork / Client Relations",
        experience_gcu_detail3: "Web Development (React / Node.js)",
        
        experience_inria_title: "Bioinformatics Research Internship",
        experience_inria_detail1: "Research Discovery",
        experience_inria_detail2: "GPU Computing with CUDA",
        experience_inria_detail3: "CPU and GPU Benchmarking",
        
        experience_module_title: "Mobility Assistance Module Project",
        experience_module_detail1: "Embedded Programming (IoT)",
        experience_module_detail2: "Network",
        experience_module_detail3: "Data Processing (Python / R)",
        
        experience_ineo_title: "Design Office Internship",
        experience_ineo_detail1: "Business World Discovery",
        experience_ineo_detail2: "Design Study",
    }
};

function updateContent(lang) {
    // Sauvegarder la langue choisie
    localStorage.setItem('preferred_language', lang);
    
    // Mettre à jour les éléments avec les attributs data-i18n
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });

    // Mettre à jour les tooltips
    document.querySelectorAll('[data-tooltip]').forEach(element => {
        if (element.classList.contains('copy-btn')) {
            element.setAttribute('data-tooltip', translations[lang]['copy_tooltip']);
        }
    });

    // Mettre à jour la classe active du sélecteur de langue
    document.querySelectorAll('.language-selector a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-lang') === lang) {
            link.classList.add('active');
        }
    });
}

// Initialiser la langue au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('preferred_language') || 'fr';
    updateContent(savedLang);

    // Ajouter les écouteurs d'événements pour les boutons de langue
    document.querySelectorAll('.language-selector a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const lang = e.target.getAttribute('data-lang');
            updateContent(lang);
        });
    });
}); 